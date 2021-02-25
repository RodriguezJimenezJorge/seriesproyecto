"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actores = exports.Series = void 0;
const mongoose_1 = require("mongoose");
const SerieSchema = new mongoose_1.Schema({
    id: String,
    nombre: String,
    visualizaciones: Number,
    temporadas: Number,
    episodios: Number
}, {
    collection: 'series'
});
const ActorSchema = new mongoose_1.Schema({
    idActor: String,
    nombre: String,
    serie: String,
    temporadaAparicion: Number,
    minutosAparicion: Number,
    notaIMDB: Number
}, {
    collection: 'actores'
});
exports.Series = mongoose_1.model('series', SerieSchema);
exports.Actores = mongoose_1.model('actores', ActorSchema);
