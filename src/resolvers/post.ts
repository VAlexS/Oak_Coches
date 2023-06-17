import { RouterContext } from "oak/router.ts";
import { cochesCollection } from "../db/conexiondb.ts";
import { Coche } from "../types.ts";
import { ObjectId } from "mongo";
import { getQuery } from "oak/helpers.ts";

type PostCarCtx = RouterContext<
    "/addCar",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

export const nuevoCoche = async (ctx: PostCarCtx): Promise<void> => {
    try{
        const params = getQuery(ctx, {mergeParams: true});

        const matricula = params.matricula; const plazas = params.plazas; const libre = params.libre;

        if(!matricula && !plazas && !libre){
            ctx.response.body = {mensaje: "Tienes que especificar la matricula, las plazas y si esta libre o no"};
            ctx.response.status = 406;
            return;
        }

        const existe = await cochesCollection.findOne({matricula: matricula});
        if(existe){
            ctx.response.body = {mensaje: "Ya existe un coche con esa matricula"};
            ctx.response.status = 409;
            return;
        }

        const cocheNuevo : Coche = {
            id: new ObjectId().toString(),
            matricula: matricula,
            numPlazas: Number(plazas),
            libre: Boolean(libre),
        }

        await cochesCollection.insertOne(cocheNuevo);

        ctx.response.body = {
            id: cocheNuevo.id,
            matricula: cocheNuevo.matricula,
            numPlazas: cocheNuevo.numPlazas,
            libre: cocheNuevo.libre,
        };

        ctx.response.status = 200;
    }catch(e){
        console.error(e);
        ctx.response.status = 500;
    }
};