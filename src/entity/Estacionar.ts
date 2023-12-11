import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, ManyToOne, CreateDateColumn } from "typeorm";
import { Vaga } from "./Vaga";
import { Cliente } from "./Cliente";
import { Car } from "./Car";


@Entity()
export class Estacionar{
    @PrimaryGeneratedColumn()
    id!:number;
    
    @Column({type:"timestamptz"})
    entrada!: string;
    
    @Column({type:"timestamptz", nullable:true})
    saida!: string;
    
    @Column({type: "money", nullable:true})
    preco!:Number;

    @Column({nullable: true})
    tempoEstadia!:number;

       
    @ManyToOne(() => Vaga, (vaga) => vaga.registrosEstacionar, {eager:true})
    vaga!: Vaga;


    @ManyToOne(()=>Car, (car)=>car.registrosEstacionar, {eager:true, onDelete:'CASCADE'})
    carro!:Car;

    @ManyToOne(()=>Cliente, (cliente)=>cliente.registrosEstacionar, {eager:true, onDelete:'CASCADE'})
    cliente!:Cliente;
    
}