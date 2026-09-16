import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Film } from "../models/film"



@Injectable({
  providedIn: 'root'
})
export class FilmService {
  private apiUrl = 'https://localhost:7269/api/Films/GetFilms'; // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  GetFilm():Observable<Film[]> {
    return this.http.get<Film[]>(this.apiUrl);
  }
  GetFilmById(id:number): Observable<Film>{
    return this.http.get<Film>(`${this.apiUrl}/${id}`);
  }
}