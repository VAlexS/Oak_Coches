import { RouterContext } from "oak/router.ts";
import { cochesCollection } from "../db/conexiondb.ts";
import { ObjectId } from "mongo";
import { Coche } from "../types.ts";


type GetCarCtx = RouterContext<
    "/car/:id",
    {
        id: string;
    } & Record<string | number, string | undefined>,
    Record<string, any>
>;

export const getCar = async (ctx: GetCarCtx): Promise<void> => {
    try{
        const id = ctx.params.id;
        if(!id){
            ctx.response.body = {mensaje: "Tienes que especificar el id en el endpoint"};
            ctx.response.status = 400;
            return;
        }

        const coche = await cochesCollection.findOne({_id: new ObjectId(id)});
        if(!coche){
            ctx.response.body = {mensaje: "Coche no encontrado"};
            ctx.response.status = 404;
            return;
        }

        const cocheEncontrado : Coche = {
            id: coche._id.toString(),
            matricula: coche.matricula,
            numPlazas: coche.numPlazas,
            libre: coche.libre,
        };

        ctx.response.body = cocheEncontrado;
        ctx.response.status = 200;

    }catch(e){
        console.error(e);
        ctx.response.status = 500;
    }
};

