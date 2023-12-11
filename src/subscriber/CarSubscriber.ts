import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, BeforeRemove, RemoveEvent } from "typeorm"
import { Car } from "../entity/Car"
import { error } from "console";

@EventSubscriber()
export class CarSubscriber implements EntitySubscriberInterface<Car> {
    
    listenTo() {
        return Car;
    }

    async beforeUpdate(event: UpdateEvent<Car>): Promise<void> {
        if (event.entity) {
            const existingCar = await event.manager.findOne(Car, { where: { placa: event.entity.placa }, relations:{cliente:true} })
            const cliente = await event.manager.findOne(Car, {where:{id: event.entity.id}, relations:{cliente:true}}).then(car=>car?.cliente);
            if( event.entity.cliente.id !== cliente?.id){
                console.error("UPDATE: CARRO já está associado a outro CLIENTE");
                throw new Error("UPDATE: CARRO já está associado a outro CLIENTE");
            }
            if (existingCar && existingCar.id !== event.entity.id) {
                console.error("UPDATE: PLACA já está associado a outro carro");
                throw new Error("PLACA já está associado a outro cliente.");
            }
            
        }
    }
    async beforeInsert(event: InsertEvent<Car>) {
        const existingCar = await event.manager.findOne(Car, { where: { placa: event.entity.placa } });
        if (existingCar) {
            console.error("CREATE: PLACA já está associado a outro carro");
            throw new Error("PLACA já está associado a outro carro.");
        }
    }
    
}