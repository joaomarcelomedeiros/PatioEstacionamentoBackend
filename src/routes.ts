import { Router } from "express";
import { CarController } from "./controller/CarController";
import { ClienteController } from "./controller/ClienteController";
import { EstacionarController } from "./controller/EstacionarController";
import { VagaController } from "./controller/VagaController";

export const router:Router = Router();

const carController = new CarController();

router.post('/car', carController.createCar);
router.delete('/car/:id', carController.deleteCar);
router.put('/car', carController.updateCar);
router.get('/car/:id',carController.getCar);

const clienteController = new ClienteController();

router.post('/cliente', clienteController.createCliente);
router.delete('/cliente/:id', clienteController.deleteCliente);
router.put('/cliente', clienteController.updateCliente);
router.get('/cliente/:id', clienteController.getCliente);
router.get('/clientes/:nome', clienteController.getClientes)

const estacionarController = new EstacionarController();

router.post('/estacionar', estacionarController.createEstacionar);
router.delete('/estacionar/:id',  estacionarController.deleteEstacionar);
router.get('/listarregistros/:ano/:mes', estacionarController.listarRegistrosMesAno);
router.put('/finalizarestacionar/:id', estacionarController.finalizarEstacionar);

const vagaController = new VagaController();
router.get('/vagas', vagaController.getVagas);
router.get('/vagasdisponiveis', vagaController.getVagasDisponiveis);
router.get('/registrovagaocupada/:numvaga', vagaController.getEstacionarIdEmAberto);
