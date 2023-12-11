import { error } from "console";
import { AppDataSource } from "../data-source";
import { Estacionar } from "../entity/Estacionar";
import { Vaga } from "../entity/Vaga";
export class VagaService {
  private readonly vagaRepository = AppDataSource.getRepository(Vaga);
  async getVaga(numVaga: number): Promise<Vaga | null> {
    return this.vagaRepository
      .findOneBy({
        numVaga: numVaga,
      })
      .then((vaga) => vaga)
      .catch((err) => {
        throw err;
      });
  }
  async alternarDispVaga(
    numVaga: number,
    status: boolean 
  ): Promise<Vaga | null> {
    return this.vagaRepository.manager
      .transaction(async (vagaRepositoryTransaction) => {
        const vaga = await this.getVaga(numVaga);
        if (!vaga) {
          throw new Error("Número de vaga não encontrado !");
        } else {
          vaga.disponivel = status;
          return await vagaRepositoryTransaction.save(vaga);
        }
      })
      .then((vaga) => vaga)
      .catch((err) => {
        throw err;
      });
  }

  async getVagasDisponiveis(): Promise<number[] | null> {
    return this.vagaRepository.manager
      .transaction(async (vagaRepositoryTransaction) => {
        return vagaRepositoryTransaction.find(Vaga, {
          where: {
            disponivel: true,
          },
        });
      })
      .then((vagas) => vagas.map((vaga) => vaga.numVaga))
      .catch((err) => {
        console.error("Não foi possível completar a requisição", err);
        throw err;
      });
  }

  async getVagas(): Promise<Vaga[] | null> {
    return this.vagaRepository.manager
      .transaction(async (vagaRepositoryTransaction) => {
        return vagaRepositoryTransaction.find(Vaga);
      })
      .then((vagas) => vagas)
      .catch((err) => {
        console.error("Não foi possível completar a requisição", err);
        throw err;
      });
  }
  async getEstacionarIdEmAberto(
    numVaga: number
  ): Promise< number | null> {
    try {
      const vaga = await this.vagaRepository.manager.findOne(Vaga, {
        where: {
          numVaga: numVaga,
          disponivel: false,
        },
        relations: {
          registrosEstacionar: true,
        },
      });
      if (!vaga) {
        throw new Error("Vaga disponível ou não encontrada!");
      }

      const registros = vaga.registrosEstacionar.filter(
        (estacionar) => !estacionar.saida
      );

      if (registros.length !== 1) {
        throw new Error(
          "COMPORTAMENTO INESPERADO NO BANCO DE DADOS! VAGA COM MAIS DE UM REGISTRO EM ABERTO PERIGO!"
        );
      }
      const id = registros[0]?.id;

      if (id === undefined) {
        throw new Error("Resultado não encontrado");
      }

      return id;
    } catch (err) {
      console.error("Não foi possível realizar o get ", err);
      throw err;
      
    }
  }
}
