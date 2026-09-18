import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Spilletid } from "../models/Spilletid";

export interface Showtime {
  id: number;
  startTime: string;
  salNavn: string;
}

export interface FilmShowtime {
  filmId: number;
  title: string;
  beskrivelse: string;
  genre: string;
  varighed: number;
  trailerUrl: string;
  billedeturl: string;
  showtimes: Showtime[];
}

@Injectable({
  providedIn: 'root'
})
export class SpilletidService {

  private apiUrl = 'https://localhost:7269/api/Spilletider/GetSpilletider';
  private apiGroupedUrl = 'https://localhost:7269/api/Spilletider/GroupedSpilletider';

  constructor(private http: HttpClient) {}

  GetSpilletider(): Observable<Spilletid[]> {
    return this.http.get<Spilletid[]>(this.apiUrl);
  }

  GetSpilletiderById(id: number): Observable<Spilletid> {
    return this.http.get<Spilletid>(`${this.apiUrl}/${id}`);
  }

  GroupedSpilletider(date?: string | null): Observable<FilmShowtime[]> {

    let params = new HttpParams();

    if (date && date.trim() !== '') {
      params = params.set('date', date);
    }

    return this.http.get<FilmShowtime[]>(
      this.apiGroupedUrl,
      { params }
    );
  }
}