import {Request, Response, Router } from 'express'
import { Series, Actores } from '../model/schemas'
import { db } from '../database/database'

class Routes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getSeries = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Series.aggregate([
                {
                    $lookup: {
                        from: 'actores',
                        localField: 'nombre',
                        foreignField: 'serie',
                        as: "actores"
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getSerie = async (req:Request, res: Response) => {
        const { id } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await Series.aggregate([
                {
                    $lookup: {
                        from: 'actores',
                        localField: 'nombre',
                        foreignField: 'serie',
                        as: "actores"
                    }
                },{
                    $match: {
                        id:id
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private postSerie = async (req: Request, res: Response) => {
        const { id, nombre, visualizaciones, temporadas, episodios } = req.body
        await db.conectarBD()
        const dSchema={
            id: id,
            nombre: nombre,
            visualizaciones: visualizaciones,
            temporadas: temporadas,
            episodios: episodios
        }
        const oSchema = new Series(dSchema)
        await oSchema.save()
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }
    
    private postActor = async (req: Request, res: Response) => {
        const { idActor, nombre, serie, temporadaAparicion, minutosAparicion, notaIMDB } = req.body
        await db.conectarBD()
        const dSchema={
            idActor: idActor,
            nombre: nombre,
            serie: serie,
            temporadaAparicion: temporadaAparicion,
            minutosAparicion: minutosAparicion,
            notaIMDB: notaIMDB
        }
        const oSchema = new Actores(dSchema)
        await oSchema.save()
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }
    

    private getActor = async (req:Request, res: Response) => {
        const { serie, idActor } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const a = await Actores.findOne({
                idActor: idActor,
                serie: serie
            })
            res.json(a)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }


    private updateActor = async (req: Request, res: Response) => {
        const {idActor, serie} = req.params
        const {  nombre, temporadaAparicion, minutosAparicion, notaIMDB } = req.body
        await db.conectarBD()
        await Actores.findOneAndUpdate({
            idActor: idActor,
            serie:serie
        },{
            idActor: idActor,
            nombre: nombre,
            serie: serie,
            temporadaAparicion: temporadaAparicion,
            minutosAparicion: minutosAparicion,
            notaIMDB: notaIMDB
        },{
            new:true,
            runValidators:true
        }
        )
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    private updateSerie = async (req: Request, res: Response) => {
        const {id} =req.params
        const {  nombre, visualizaciones, temporadas, episodios } = req.body
        await db.conectarBD()
        await Series.findOneAndUpdate({
            id: id
        },{
            id:id,
            nombre:nombre,
            visualizaciones:visualizaciones,
            temporadas:temporadas,
            episodios:episodios
        },{
            new:true,
            runValidators:true
        }
        )
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }


    private deleteActor = async (req: Request, res: Response) => {
        const { idActor, serie } = req.params
        await db.conectarBD()
        await Actores.findOneAndDelete(
            { idActor: idActor,
            serie: serie
            }, 
            (err: any, doc) => {
                if(err) console.log(err)
                else{
                    if (doc == null) {
                        res.send(`No encontrado`)
                    }else {
                        res.send('Borrado correcto: '+ doc)
                    }
                }
            })
        db.desconectarBD()
    }
   

    misRutas(){
        this._router.get('/series', this.getSeries),
        this._router.get('/serie/:id', this.getSerie),
        this._router.post('/', this.postSerie),
        this._router.post('/actor', this.postActor),
        this._router.get('/actor/:idActor&:serie', this.getActor),
        this._router.post('/actor/:idActor&:serie', this.updateActor),
        this._router.post('/serie/:id', this.updateSerie),
        this._router.get('/deleteActor/:idActor&:serie', this.deleteActor)
    }
}

const obj = new Routes()
obj.misRutas()
export const routes = obj.router