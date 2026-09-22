import { Film } from "./film";

export interface Spilletid {
    id: number;
    startTime: Date;
    filmId: number;
    salId: number;
    film?: Film;
}