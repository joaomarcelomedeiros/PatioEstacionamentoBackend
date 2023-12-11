import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Car } from "../entity/Car";

export class CarService {
    private readonly carRepository: Repository<Car> = AppDataSource.manager.getRepository(Car);
    async createCar(car: Car, id: number): Promise<Car> {
        try {
            return await new CarService().insertCar(car);
        } catch (erro: any) {
            console.error("CREATE: carro NÃO criado!", erro);
            throw erro;
        }
    }
    async deleteCar(id: number): Promise<Car | null> {
        return this.carRepository.manager.transaction(async carRepositoryTransaction => {
            const carRemove =await carRepositoryTransaction.findOne(Car, {where:{id:id}});
            if(carRemove)
                return await carRepositoryTransaction.remove(carRemove);
            else throw new Error("Carro não encontrado !");

        })
            .then(car => car)
            .catch(err => { 
                console.error("Não foi possível deleter o carro", err)
                throw err });
    }
    async updateCar(car: Car): Promise<Car | null> {
        try {
            return await this.insertCar(car);
        } catch (erro: any) {
            console.error("UPDATE: carro NÃO criado!");
            throw erro;
        }
    }
    async getCar(id: number): Promise<Car | null> {
        return await this.carRepository.findOne(
            {
                where: { id: id, },
                relations: { cliente: true }
            }
        );
    }
    private async insertCar(car: Car): Promise<Car> {
        return await this.carRepository.manager.transaction(async carRepositoryTransaction => {

            if (await carRepositoryTransaction.save(car)) {
                return car;
            } else {
                throw new Error('Cliente não pode ser adicionado!');
            }
        })
            .then(car => car)
            .catch(err => { throw err });
    }
}
