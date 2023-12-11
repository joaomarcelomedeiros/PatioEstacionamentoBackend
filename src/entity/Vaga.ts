import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from "typeorm"
import { Estacionar } from "./Estacionar"

@Entity()
export class Vaga {

    @PrimaryGeneratedColumn()
    numVaga!: number

    @Column()
    disponivel!: boolean
    
    @OneToMany(() => Estacionar, (estacionar) => estacionar.vaga)
    registrosEstacionar!: Estacionar[];

    
    
}
