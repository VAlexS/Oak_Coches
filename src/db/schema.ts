import { ObjectId } from "mongo";
import { Coche } from "../types.ts";

export type CocheSchema = Omit<Coche, "id"> & {
    _id: ObjectId;
};
