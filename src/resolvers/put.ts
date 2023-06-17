import { RouterContext } from "oak/router.ts";
import { cochesCollection } from "../db/conexiondb.ts";
import { ObjectId } from "mongo";
import { Coche } from "../types.ts";

type AskCarCtx = RouterContext<
    "/askCar",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

type ReleaseCarCtx = RouterContext<
    "/releaseCar/:id",
    {
        id: string;
    } & Record<string | number, string | undefined>,
    Record<string, any>
>;

export const askCar = async (ctx: AskCarCtx): Promise<void> => {
    try{
        const cocheLibre = await cochesCollection.findOne({libre: true});
        if(!cocheLibre){
            ctx.response.body = {mensaje: "No hay coches disponibles en este momento"};
            ctx.response.status = 404;
            return;
        }

        
        await cochesCollection.updateOne(
            {_id: cocheLibre._id},
            {$set: {libre: false}},
        );

        const id = cocheLibre._id.toString();
        ctx.response.body = {id: id};
        ctx.response.status = 200;
        

    }catch(e){
        console.error(e);
        ctx.response.status = 500;
    }
};

export const releaseCar = async (ctx: ReleaseCarCtx): Promise<void> => {
    try{
        const id = ctx.params.id;
        if(!id){
            ctx.response.body = {mensaje: "Tienes que especificar el id en el endpoint"};
            ctx.response.status = 406;
            return;
        }

        const coche = await cochesCollection.findOne({_id: new ObjectId(id)});
        if(!coche){
            ctx.response.body = {mensaje: "No existe ningun coche con ese id"};
            ctx.response.status = 404;
            return;
        }

        const libre = coche.libre;

        if(libre){
            ctx.response.body = {mensaje: "El coche que intentas liberar ya estaba libre"};
            ctx.response.status = 400;
        }
        else{
            await cochesCollection.updateOne(
                {_id: coche._id},
                {$set: {libre: true}},
            ); 
            ctx.response.body = {mensaje: "El coche ha sido liberado correctamente"};
            ctx.response.status = 200;
        }


    }catch(e){
        console.error(e);
        ctx.response.status = 500;
    }
};