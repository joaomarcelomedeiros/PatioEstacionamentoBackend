import { NextFunction, Request, Response } from "express";
import { EstacionarService } from "../services/EstacionarService";
import { retornaData } from "../utils/dateFormatter";
import { CarController } from "./CarController";
import { Car } from "../entity/Car";
import { ClienteController } from "./ClienteController";
import { Cliente } from "../entity/Cliente";
import { Estacionar } from "../entity/Estacionar";
export class EstacionarController {
    async createEstacionar(request: Request, response: Response, next: NextFunction) {
        try {
            
            const estacionar:Estacionar = EstacionarController.processRequestEstacionarBody(request);
            const retorno = await new EstacionarService().createEstacionar(Number(request.body.numVaga), estacionar.carro, estacionar.cliente);
            if (retorno) {
                return response.status(201).json(
                    {
                        meessage: "Registro criado!",
                        date: retornaData(),
                        retorno: retorno
                    });
            } else {
                throw new Error("Dados da request inválidos!");
            }
        } catch (err: any) {
            err.status = 400;
            console.error("Bad request: ", err.message);
            next(err);
        }
    }
    async finalizarEstacionar(request: Request, response: Response, next: NextFunction) {
        try {
            const id = Number(request.params.id);
            if (id) {
                console.log(await new EstacionarService().finalizarEstacionar(id));
                return response.status(204).json(
                    {
                        message: "Serviço finalizado!",
                        date: retornaData(),
                    }
                );
            } else {
                throw new Error("Dados da request inválidos!");
            }
        } catch (err: any) {
            err.status = 400;
            console.error("Bad request: ", err.meessage);
            next(err);
        }
    }
    async deleteEstacionar(request: Request, response: Response, next: NextFunction) {
        try {
            const id = Number(request.params.id);
            if (id) {
                await new EstacionarService().deleteEstacionar(id);
                return response.status(204).send();
            } else
                throw new Error("idEstacionar não foi passado na request!");
        } catch (err: any) {
            err.status = 404;
            console.error("Bad request: ", err.message)
            next(err);
        }
    }
    async listarRegistrosMesAno(request: Request, response: Response, next: NextFunction) {
        const mes = Number(request.params.mes);
        const ano = Number(request.params.ano);
        try {
            if (!mes && !ano)
                throw new Error("Dados pra requisição inválidos!")
            return response.status(200).json(await new EstacionarService().listarRegistrosMesAno(mes, ano));
        } catch (err: any) {
            err.status = 404;
            console.error("Bad request: ", err.message);
            next(err);
        }
    }
    static processRequestEstacionarBody(request: Request):Estacionar {
        const cliente = request.body.cliente;
        const car = request.body.car;
        console.log(car);
        const estacionar: Estacionar = new Estacionar();
        if (cliente.cpf && cliente.nome && cliente.telefone && cliente.id) {
            estacionar.cliente = new Cliente(cliente.cpf, cliente.nome, cliente.telefone,Number( cliente.id));
        }  
        if (car.id && car.placa && car.modelo && car.ano && car.cor) {
            const carro = new Car();
            carro.id =Number(car.id); carro.placa = car.placa; carro.modelo = car.modelo; carro.cor = car.cor;
            estacionar.carro= carro;
        
        }else{
            console.error("Dados inválidos!");
            throw new Error("Dados inválidos!");
        }
        return estacionar;
    }
}