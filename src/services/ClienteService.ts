import { AppDataSource } from "../data-source";
import { Cliente } from "../entity/Cliente";
import { Repository } from "typeorm";
import unorm from 'unorm';

export class ClienteService {
    private readonly clienteRepository: Repository<Cliente> = AppDataSource.manager.getRepository(Cliente);
    async createCliente(cliente: Cliente): Promise<Cliente> {
        return this.insertCliente(cliente)
            .then(cliente => cliente)
            .catch(err => { throw err });
    }
    async updateCliente(cliente: Cliente): Promise<Cliente> {
        try {
            return await this.insertCliente(cliente);
        } catch {
            throw new Error("Não foi possível adicionar o cliente");
        }
    }
    private async insertCliente(cliente: Cliente): Promise<Cliente> {
        try {
            return await this.clienteRepository.manager.transaction(async clienteRepositoryTransaction => {
                return await clienteRepositoryTransaction.save(cliente);
            });
        } catch (error:any) {
            console.error('Erro ao adicionar cliente:', error);
    
            if (error.code === '23505' && error.constraint === 'UQ_cliente_cpf') {
                throw new Error("CPF já está associado a outro cliente.");
            } else {
                throw new Error("Cliente não pode ser adicionado!");
            }
        }
    }
    
    async deleteCliente(id: number): Promise<Cliente | null> {
        try {
            const deleteCliente: Cliente | null = await this.getCliente(id);
            if (deleteCliente) {
                return await this.clienteRepository.manager.transaction(async clienteRepositoryTransaction => {
                    if (await clienteRepositoryTransaction.remove(deleteCliente))
                        return deleteCliente;
                    else
                        throw new Error("Cliente não pode ser deletado!");
                });
            } else {
                throw new Error(`CLIENTE: ${id} não encontrado ! `);
            }
        } catch (err) {
            throw err
        }
    }
    async getCliente(id: number): Promise<Cliente | null> {
        return this.clienteRepository.findOne(
            {
                where: {
                    id: id,
                },
                relations: {
                    cars: true,
                }
            }
        )
            .then(cliente => cliente)
            .catch(err => err);
    }
    async getClientes(nome: string): Promise<Cliente[]> {
        try {
            const clientes = await this.clienteRepository.manager.find(Cliente);
            const clientesFiltrados = clientes.filter(
                cliente => {
                    return unorm.nfd(cliente.nome.toLowerCase()).includes(unorm.nfd(nome.toLowerCase()))
                }
            );
            if (clientesFiltrados.length === 0) {
                throw new Error('Não foram encontrados clientes!');
            }

            return clientesFiltrados;
        } catch (error) {
            throw error;
        }
    }
}