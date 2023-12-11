import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent } from "typeorm"
import { Car } from "../entity/Car"
import { Cliente } from "../entity/Cliente";
import { Vaga } from "../entity/Vaga";
import { VagaService } from "../services/VagaService";
import { Estacionar } from "../entity/Estacionar";

@EventSubscriber()
export class EstacionarSubscriber implements EntitySubscriberInterface<Estacionar> {
    
    listenTo() {
        return Estacionar;
    }

    async beforeUpdate(event: UpdateEvent<Estacionar>): Promise<void> {
        

    }
    
    async beforeInsert(event: InsertEvent<Estacionar>) {
        const vaga: Vaga | null = await new VagaService().getVaga(event.entity.vaga.numVaga);
        if(!vaga?.disponivel)
            throw new Error("Vaga indisponível");
        const car:Car |null = await  event.manager.findOne(Car,
            {
                where: {
                    id: event.entity.carro.id, 
            
                },
                relations:{
                    registrosEstacionar:true,
                    cliente:true
                }
            });

            if(car ){
                const estacionarEmAberto =car.registrosEstacionar.filter((registro)=> !registro.saida );
                if(estacionarEmAberto.length >0)
                    throw new Error("Carro já está estacionado!");
            }else{
                throw new Error("Carro não encontrado !")
            }
        if(event.entity.cliente.id != car.cliente.id)
            throw new Error("Cliente ID do objeto carro, diferente do Cliente ID do objeto ESTACIONAR");


    }
}