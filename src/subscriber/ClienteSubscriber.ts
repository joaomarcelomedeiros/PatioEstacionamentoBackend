import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent } from "typeorm"
import { Car } from "../entity/Car"
import { Cliente } from "../entity/Cliente";

@EventSubscriber()
export class ClienteSubscriber implements EntitySubscriberInterface<Cliente> {
    /**
     * Indicates that this subscriber only listen to Post events.
     */
    listenTo() {
        return Cliente;
    }

    async beforeUpdate(event: UpdateEvent<Cliente>): Promise<void> {
        if (event.entity) {
            const existingCliente = await event.manager.findOne(Cliente, { where: { cpf: event.entity.cpf, } });
            if (existingCliente && existingCliente.id !== event.entity.id) {
                console.error("UPDATE: CPF já está associado a outro cliente");
                throw new Error("CPF já está associado a outro cliente.");
            }
        }
    }
    async beforeInsert(event: InsertEvent<Cliente>) {
        const existingCliente = await event.manager.findOne(Cliente, { where: { cpf: event.entity.cpf } });
        if (existingCliente) {
            console.error("CREATE: CPF já está associado a outro cliente");

            throw new Error("CPF já está associado a outro cliente.");
        }

    }
}