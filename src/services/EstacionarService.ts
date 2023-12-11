import { Between, MongoEntityManager, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Estacionar } from "../entity/Estacionar";
import { Vaga } from "../entity/Vaga";
import { Car } from "../entity/Car";
import { Cliente } from "../entity/Cliente";
import { VagaService } from "./VagaService";
import { CarService } from "./CarService";
import { ClienteService } from "./ClienteService";
import { converterFusoHorario, retornaData } from "../utils/dateFormatter";
interface RetornoTempoPreco {
    tempoEstadia: number,
    preco: number,
}
export class EstacionarService {
    private readonly estacionarRepository: Repository<Estacionar> = AppDataSource.manager.getRepository(Estacionar);
    static readonly precoHora = 10; //defina o preço da hora do estacionamento.
    async createEstacionar(numVaga: number, car: Car, cliente: Cliente): Promise<Estacionar | null> {
        return this.estacionarRepository.manager.transaction(
            async estacionarRepositoryTransaction => {
                const estacionar: Estacionar = new Estacionar();
                estacionar.entrada = retornaData();
                estacionar.cliente = cliente; estacionar.carro = car;
                const vaga = await estacionarRepositoryTransaction.findOneBy(Vaga, {numVaga: numVaga});
                if(vaga)
                    estacionar.vaga = vaga;
                const novoEstacionar = await estacionarRepositoryTransaction.save(estacionar)
                if (novoEstacionar && await new VagaService().alternarDispVaga(numVaga,false)) {
                    return novoEstacionar;
                } else {
                    throw new Error("O registro não pode ser criado!");
                }
            }
        )
            .then(estacionar => EstacionarService.ajustarFusoHorario(estacionar))
            .catch(err => { 
                console.error("erro ao criar o registro", err);
                throw (err) })
    }
    async finalizarEstacionar(idEstacionar: number): Promise<Estacionar> {
        return this.estacionarRepository.manager.transaction(async estacionarRepositoryTransaction => {
            const estacionar: Estacionar | null = await this.estacionarRepository.findOne(
                {
                    where: {
                        id: idEstacionar,
                    },
                    relations: {
                        vaga: true,
                    }
                }
            );
            if (estacionar && !estacionar.saida) {
                estacionar.saida = retornaData();
                const retornoTempoPreco: RetornoTempoPreco = EstacionarService.calcPreco(new Date(estacionar.entrada), new Date(estacionar.saida));
                estacionar.tempoEstadia = retornoTempoPreco.tempoEstadia;
                estacionar.preco = retornoTempoPreco.preco;
                let retornoEstacionar;
                if (await estacionarRepositoryTransaction.save(estacionar) && await new VagaService().alternarDispVaga(estacionar.vaga.numVaga, true)) {
                     
                     retornoEstacionar = await estacionarRepositoryTransaction.findOneBy(Estacionar, {id: idEstacionar});

                } 
                if(retornoEstacionar){
                    return retornoEstacionar;
                }
                else {
                    throw new Error("Não foi possível finalizar o serviço!")
                }
            } else {
                throw new Error(`Registro de estacionamento de número:${idEstacionar} não foi encontrado ou já foi finalizado!`);
            }
        })
            .then(estacionar => EstacionarService.ajustarFusoHorario(estacionar))
            .catch(err => { throw (err) });
    }
    async deleteEstacionar(idEstacionar: number): Promise<Estacionar> {
        return this.estacionarRepository.manager
            .transaction(async (estacionarRepositoryTransaction) => {
                const estacionar: Estacionar | null = await estacionarRepositoryTransaction.findOne(Estacionar,
                    {
                        relations: {
                            vaga: true
                        },
                        where: {
                            id: idEstacionar
                        },
                    }
                );

                if (estacionar) {
                    if (!estacionar.saida)
                        await new VagaService().alternarDispVaga(estacionar.vaga.numVaga, true)

                    return await estacionarRepositoryTransaction.remove(estacionar);

                }
                else {
                    throw new Error(`Registro de estacionamento de número: ${idEstacionar} não foi encontrado!`)
                }
            })
            .then(estacionar => EstacionarService.ajustarFusoHorario(estacionar))
            .catch((err) => { throw err })
    }
    private static calcPreco(entrada: Date, saida: Date): RetornoTempoPreco {
        const tempoDeEstadia: number = Math.floor((saida.getTime() - entrada.getTime()) / 60000);
        const retornoTempoPreco: RetornoTempoPreco = {
            tempoEstadia: tempoDeEstadia,
            preco: Number(((this.precoHora * tempoDeEstadia) / 60).toFixed(2))
        }
        return retornoTempoPreco;
    }
    async listarRegistrosMesAno(mes:number, ano:number): Promise<Estacionar[]> {
        
        const inicial = new Date(ano, mes-1, 1);
        const final = new Date(ano, mes, 0,23,59)
        return this.estacionarRepository.find({
            where:{
                entrada:Between(inicial.toISOString(), final.toISOString())
            }
        }
        )
            .then(listaEstacionar => {
                if (listaEstacionar) {
                    return listaEstacionar.map(EstacionarService.ajustarFusoHorario);
                } else
                    throw new Error("Não foi possível acessar os registros!")
            })
            .catch(err => {
                throw (err);
            });
    }
    private static ajustarFusoHorario = (estacionar: Estacionar): Estacionar => {
        const estacionarAjustado = { ...estacionar };
        estacionarAjustado.entrada = converterFusoHorario(estacionar.entrada);
        if (estacionar.saida)
            estacionarAjustado.saida = converterFusoHorario(estacionar.saida);
        return estacionarAjustado;
    }
}