import { Film } from "./film";
import { sal } from "./sal";

export interface Spilletid {
    id: number;
    startTime: Date;
    filmId: number;
    salId: number;
    film?: Film;
    sal?: sal
    
}