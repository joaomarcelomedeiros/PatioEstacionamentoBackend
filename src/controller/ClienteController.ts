
import { NextFunction, Request, Response } from "express";
import { ClienteService } from "../services/ClienteService";
import { Cliente } from "../entity/Cliente";
import { retornaData } from "../utils/dateFormatter";
import unorm from "unorm";
export class ClienteController {
    async createCliente(request: Request, response: Response, next: NextFunction) {
        try {
            const cliente: Cliente = ClienteController.processBodyCliente(request);
            return response.status(201).json(
                await new ClienteService().createCliente(cliente)
                
            );
        } catch (erro: any) {
            erro.status = 400;
            console.error("Bad request: ", erro.message)
            next(erro);
        }
    }
 
    async updateCliente(request: Request, response: Response, next: NextFunction) {
        try {
            const cliente: Cliente = ClienteController.processBodyCliente(request);
            return response.status(200).json(await new ClienteService().updateCliente(cliente));
        }
        catch (err: any) {
            err.status=400;
            console.error("Bad request: ", err.message);
            next(err);
        }
    }

    async deleteCliente(request: Request, response: Response, next: NextFunction) {
        try {
            const id: number = Number(request.params.id);
            if (!id)
                throw new Error("Não foi inserido dado para o cpf no corpo da requisição!");

            return response.status(204).json(
                {
                    message: "Cliente deletado !",
                    date: new Date(),
                    delete: await new ClienteService().deleteCliente(id)
                }
            );
        } catch (err: any) {
            err.status=400;
            console.error("Bad request: ", err.message);
            next(err);
        }
    }

    async getCliente(request: Request, response: Response, next: NextFunction) {
        try {
            const id: number = Number(request.params.id);
            console.log(id, request.params.id);
            if (!id) {
                throw new Error("Não foi inserido dado para o cpf no corpo da requisição!");
            }
            const cliente = await new ClienteService().getCliente(id)
             if(!cliente)
                throw new Error("Não encontrado")!
            return response.status(200).json(cliente);
        } catch (err: any) {
            err.status=400;
            console.error("Bad request: ", err.message);
            next(err);
        }
    }

     static processBodyCliente(request: Request): Cliente {
        const cliente = request.body;
        if (cliente.cpf && cliente.nome && cliente.telefone) {
            if(!cliente.id)
                return new Cliente(cliente.cpf, cliente.nome, cliente.telefone, -1);
            return new Cliente(cliente.cpf, cliente.nome,   cliente.telefone,cliente.id);
        } else {
            throw new Error("Dados da request inválidos!");
        }
    }
    async getClientes(request: Request, response: Response, next: NextFunction) {
        try {
          const nome = String(request.params.nome);
    
          if (nome) {
            console.log("aqui",unorm.nfd(nome).toLowerCase());
            
            const clientes = await new ClienteService().getClientes(nome);
    
            return response.status(200).json( clientes);
          } else {
            throw new Error("Parâmetro 'nome' inválido!");
          }
        } catch (error) {
          console.error(error);
          return response.status(500).json({ error: 'Erro interno do servidor' });
        }
      }
}