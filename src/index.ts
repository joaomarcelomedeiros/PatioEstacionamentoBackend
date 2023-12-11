

import { AppDataSource } from "./data-source"
import express from "express";
import cors from "cors";
import {router} from './routes';
import "dotenv/config";
import { errorHandler } from "./erroHandler";
import { Vaga } from "./entity/Vaga";

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler);

AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

app.get("/", (req, res) => {
  console.log("Response ok.");
  res.send("Ok – Servidor disponível.");
 });

app.listen(port, ()=>{
  console.log("Servidor funcionando na porta ", port);
});