import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Film } from '../models/film';



@Injectable({
  providedIn: 'root'
})
export class FilmService {
  private readonly apiUrl = 'https://localhost:7269/api/Films/GetFilms';
  private readonly apiUrlById = 'https://localhost:7269/api/Films/GetFilmById';
  private readonly films$: Observable<Film[]>;

  constructor(private http: HttpClient) {
    this.films$ = this.http.get<Film[]>(this.apiUrl).pipe(shareReplay(1));
  }

  GetFilm(): Observable<Film[]> {
    // Both the front page and /film use this same request.  Sharing it prevents
    // one route from receiving a different response while the other is loading.
    return this.films$;
  }
  GetFilmById(id:number): Observable<Film>{
    return this.http.get<Film>(`${this.apiUrlById}/${id}`);
  }
}
