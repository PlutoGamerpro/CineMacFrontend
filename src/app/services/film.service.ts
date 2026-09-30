import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Film } from '../models/film';



@Injectable({
  providedIn: 'root'
})
export class FilmService {
  private readonly apiUrl = 'https://localhost:7269/api/Films';

  constructor(private http: HttpClient) {}

  GetFilm(): Observable<Film[]> {
    return this.http.get<Film[]>(`${this.apiUrl}/GetFilms`);
  }
  GetFilmById(id:number | string): Observable<Film>{
    return this.http.get<Film>(`${this.apiUrl}/GetFilmById/${id}`);
  }
  /// Omit here mean take an film objekt as input but remove id
  CreateFilm(film: Omit<Film, 'id'>): Observable<Film> {
    return this.http.post<Film>(`${this.apiUrl}/Createfilm`, film);
  }
  UpdateFilm(id: number | string, film: Omit<Film, 'id'>): Observable<Film> {
    return this.http.put<Film>(`${this.apiUrl}/UpdateFilm/${id}`, film);
  }
  DeleteFilm(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteFilm/${id}`);
  }
}
