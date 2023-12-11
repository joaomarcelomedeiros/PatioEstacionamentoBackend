import { NextFunction, Request, Response } from "express";
import { EstacionarService } from "../services/EstacionarService";
import { retornaData } from "../utils/dateFormatter";
import { VagaService } from "../services/VagaService";

export class VagaController {

    async getVagas(request: Request, response: Response, next: NextFunction) {
        try {
            const retorno = await new VagaService().getVagas();
            return response.status(200).json(retorno);
        } catch (err) {
            console.error("Não foi possível fazer o GET das vagas", err);
            next(err);
        }
    }

    async getVagasDisponiveis(request: Request, response: Response, next: NextFunction) {
        try {
            const retorno = await new VagaService().getVagasDisponiveis();
            return response.status(200).json(retorno);
        } catch (err) {
            console.error("Não foi possível fazer o GET de vagas disponíveis", err);
            next(err);
        }
    }

    async getEstacionarIdEmAberto(request: Request, response: Response, next: NextFunction) {
        try {
            const numVaga = Number(request.params.numvaga);
            const retorno = await new VagaService().getEstacionarIdEmAberto(numVaga);
            return response.status(200).json({id: retorno});
        } catch (err) {
            console.error("Não foi possível fazer o GET de vagas disponíveis", err);
            next(err);
        }
    }
}
