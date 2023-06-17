import { RouterContext } from "oak/router.ts";
import { cochesCollection } from "../db/conexiondb.ts";
import { ObjectId } from "mongo";

type RemoveCarCtx = RouterContext<
    "/removeCar/:id",
    {
        id: string;
    } & Record<string | number, string | undefined>,
    Record<string, any>
>;

export const removeCar = async (ctx: RemoveCarCtx): Promise<void> => {
    try{
        const id = ctx.params.id;
        if(!id){
            ctx.response.body = {mensaje: "Tienes que especificar el id en el endpoint"};
            ctx.response.status = 400;
            return;
        }

        const coche = await cochesCollection.findOne({_id: new ObjectId(id)});
        if(!coche){
            ctx.response.body = {mensaje: "El coche que intentas eliminar no existe"};
            ctx.response.status = 404;
            return;
        }

        const libre = coche.libre;
        if(libre){
            await cochesCollection.deleteOne({_id: coche._id});
            ctx.response.body = {mensaje: "El coche ha sido eliminado correctamente de la base de datos"};
            ctx.response.status = 200;
        }
        else{
            ctx.response.body = {mensaje: "No es posible eliminar este coche de la base de datos porque esta ocupado"};
            ctx.response.status = 405;
        }

    }catch(e){
        console.error(e);
        ctx.response.status = 500;
    }
};