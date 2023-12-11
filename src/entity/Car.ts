import { Entity, Column, PrimaryColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Cliente } from "./Cliente"
import { Estacionar } from "./Estacionar"

@Entity()
export class Car {
    @PrimaryGeneratedColumn()
    id!:number

    @Column({
        length: 7
    })
    placa!: string

    @Column(
        {
            length: 50
        }
    )
    modelo!: string

    @Column(
        {
            length:50
        }
    )
    marca!:string
    
    @Column(
       { 
        length:50}
       )
    cor!: string

    @Column()
    ano!: number
    
   @ManyToOne(()=>Cliente, (cliente)=>cliente.cars, { onDelete: 'CASCADE' })
   cliente!:Cliente
   
   @OneToMany(() => Estacionar, (estacionar) => estacionar.carro, { onDelete: 'CASCADE' })
   registrosEstacionar!:Estacionar[];

   constructor (placa?:string, modelo?:string, marca?:string, cor?:string, ano?:number, cliente?:Cliente ,id?:number){
        if( placa && modelo && marca && cor && ano ){
             this.placa = placa; this.modelo=modelo; this.marca=marca; this.cor =cor, this.ano=ano; 
        }
        if(cliente)
            this.cliente= cliente;
        if(id)
            this.id=id;
   }
}
