"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const schemas_1 = require("../model/schemas");
const database_1 = require("../database/database");
class Routes {
    constructor() {
        this.getSeries = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Series.aggregate([
                    {
                        $lookup: {
                            from: 'actores',
                            localField: 'nombre',
                            foreignField: 'serie',
                            as: "actores"
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getSerie = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Series.aggregate([
                    {
                        $lookup: {
                            from: 'actores',
                            localField: 'nombre',
                            foreignField: 'serie',
                            as: "actores"
                        }
                    }, {
                        $match: {
                            id: id
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.postSerie = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, nombre, visualizaciones, temporadas, episodios } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                id: id,
                nombre: nombre,
                visualizaciones: visualizaciones,
                temporadas: temporadas,
                episodios: episodios
            };
            const oSchema = new schemas_1.Series(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.postActor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { idActor, nombre, serie, temporadaAparicion, minutosAparicion, notaIMDB } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                idActor: idActor,
                nombre: nombre,
                serie: serie,
                temporadaAparicion: temporadaAparicion,
                minutosAparicion: minutosAparicion,
                notaIMDB: notaIMDB
            };
            const oSchema = new schemas_1.Actores(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.getActor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { serie, idActor } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const a = yield schemas_1.Actores.findOne({
                    idActor: idActor,
                    serie: serie
                });
                res.json(a);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.updateActor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { idActor, serie } = req.params;
            const { nombre, temporadaAparicion, minutosAparicion, notaIMDB } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Actores.findOneAndUpdate({
                idActor: idActor,
                serie: serie
            }, {
                idActor: idActor,
                nombre: nombre,
                serie: serie,
                temporadaAparicion: temporadaAparicion,
                minutosAparicion: minutosAparicion,
                notaIMDB: notaIMDB
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.updateSerie = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { nombre, visualizaciones, temporadas, episodios } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Series.findOneAndUpdate({
                id: id
            }, {
                id: id,
                nombre: nombre,
                visualizaciones: visualizaciones,
                temporadas: temporadas,
                episodios: episodios
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.deleteActor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { idActor, serie } = req.params;
            yield database_1.db.conectarBD();
            yield schemas_1.Actores.findOneAndDelete({ idActor: idActor, serie: serie }, (err, doc) => {
                if (err)
                    console.log(err);
                else {
                    if (doc == null) {
                        res.send(`No encontrado`);
                    }
                    else {
                        res.send('Borrado correcto: ' + doc);
                    }
                }
            });
            database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/series', this.getSeries),
            this._router.get('/serie/:id', this.getSerie),
            this._router.post('/', this.postSerie),
            this._router.post('/actor', this.postActor),
            this._router.get('/actor/:idActor&:serie', this.getActor),
            this._router.post('/actor/:idActor&:serie', this.updateActor),
            this._router.post('/serie/:id', this.updateSerie),
            this._router.get('/deleteActor/:idActor&:serie', this.deleteActor);
    }
}
const obj = new Routes();
obj.misRutas();
exports.routes = obj.router;
