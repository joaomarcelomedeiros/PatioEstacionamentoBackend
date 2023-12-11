import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import { Car } from "./entity/Car"
import { urlConnection } from "./config"
import { Cliente } from "./entity/Cliente"
import { Vaga } from "./entity/Vaga"
import { Estacionar } from "./entity/Estacionar"
import {ClienteSubscriber} from './subscriber/ClienteSubscriber'
import { CarSubscriber } from "./subscriber/CarSubscriber"
import { EstacionarSubscriber } from "./subscriber/EestacionarSubscriber"

const options:DataSourceOptions ={
    type: "postgres",
    url: urlConnection,
    synchronize: true,
    logging: false,
    entities: [Car, Cliente,Vaga,Estacionar],
    migrations: [],
    subscribers: [ClienteSubscriber, CarSubscriber,EstacionarSubscriber],
 
}
export const AppDataSource = new DataSource(options);

