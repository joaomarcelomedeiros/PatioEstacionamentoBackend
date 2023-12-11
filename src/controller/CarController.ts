import { Request, Response, NextFunction } from "express";
import { CarService } from "../services/CarService";
import { Car } from "../entity/Car";
import { retornaData } from "../utils/dateFormatter";
import { Cliente } from "../entity/Cliente";
export class CarController {
    async createCar(request: Request, response: Response, next: NextFunction) {
        try {
            const car = CarController.processRequestBodyCar(request);
            return response
                .status(201)
                .json(   await new CarService().createCar(car, Number(request.body.id)));
        }
        catch (err:any){
            err.status=400;
            console.error("Bad request: ", err.message);
            next(err);
        }
    }
    async updateCar(request: Request, response: Response, next: NextFunction) {
        try {
            
            const car: Car = CarController.processRequestBodyCar(request);  
            return response
                .status(200)
                .json(await new CarService().updateCar(car));
        } catch (err:any) {
            err.status=400;
            console.error("Bad request: ", err.message);
            next(err);
        }

    }
    async deleteCar(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id;
            if (!id) {
                throw new Error("Não foi inserido dado para placa no corpo da requisição!")
            }
            return response.status(204).json({
                message: "Carro deletado !", date: retornaData(), retorno: await new CarService().deleteCar(Number(id))
            });
        } catch (err: any) {
            err.status=400;
            console.error("Bad request: ", err.message);
            next(err);
        }
    }
    async getCar(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id;
            if (!id) {
                throw new Error("Não foi inserido dado para placa no corpo da requisição!");
            }
            const car = await new CarService().getCar(Number(id));
            if(!car){
                throw new Error("Carro não encontrado!")
            }
            return response.status(200).json(car);
        } catch (err: any) {
            err.status = 400;
            console.error("Bad request: ", err.message);
            next(err);
        }
    }
     static processRequestBodyCar(request: Request): Car {
        const car = request.body;
        if (car.id && car.placa && car.modelo && car.marca && car.cor && car.ano && car.cliente.id && car.cliente.cpf  && car.cliente.nome && car.cliente.telefone) {
            const cliente =  new Cliente(car.cliente.cpf, car.cliente.nome,car.cliente.telefone, car.cliente.id);
            if(car.id===-1)
                return new Car(car.placa, car.modelo, car.marca, car.cor, car.ano, cliente);
            else{
                return new Car(car.placa, car.modelo, car.marca, car.cor, car.ano, cliente,car.id);

            }
        } else {
            throw new Error("Dados inválidos!");
        }
    }
}
