import { Schema, model } from 'mongoose'

const SerieSchema = new Schema({
    id: String,
    nombre: String,
    visualizaciones: Number,
    temporadas: Number,
    episodios: Number
},{
    collection:'series'
})


const ActorSchema = new Schema({
    idActor: Number,
    nombre: String,
    serie: String,
    temporadaAparicion: Number,
    minutosAparicion: Number,
    notaIMDB:Number
},{
    collection:'actores'
})



export const Series = model('series', SerieSchema  )
export const Actores = model('actores', ActorSchema  )
