import { NextFunction, Request, Response } from "express";
import { retornaData } from "./utils/dateFormatter";

interface CustomError extends Error {
    status?: number;
  }

export const errorHandler = (erro: CustomError, req: Request, res: Response, next: NextFunction) => {
    const status = erro.status || 500;
    console.error(erro.message);
    res.status(status).json({
        erro: {
            mensagem: erro.message,
            status: status,
            date: retornaData()
        }
    });
};

