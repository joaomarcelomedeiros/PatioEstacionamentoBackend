import { Entity, Column, OneToMany, PrimaryGeneratedColumn, BeforeUpdate, BeforeInsert } from "typeorm"
import { Car } from "./Car"
import { Estacionar } from "./Estacionar"
import { AppDataSource } from "../data-source";

@Entity()
export class Cliente {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 14
    })
    cpf!: string;

    @Column(
        {
            length: 50
        }
    )
    nome!: string

    @Column(
        {
            length: 50
        }
    )
    telefone!: string

    @OneToMany(() => Car, (car) => car.cliente,{ eager: true , onDelete: 'CASCADE'}, )
    cars!: Car[]
    @OneToMany(() => Estacionar, (estacionar) => estacionar.cliente, { onDelete: 'CASCADE' })
    registrosEstacionar!: Estacionar[]

    constructor(cpf?: string, nome?: string, telefone?: string, id?: number) {
        if (cpf && nome && telefone) {
            this.cpf = cpf;
            this.nome = nome;
            this.telefone = telefone;
            if (id)
                this.id = id;
        }
    }
}
