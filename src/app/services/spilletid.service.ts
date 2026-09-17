import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Spilletid} from "../models/Spilletid";



@Injectable({
  providedIn: 'root'
})
export class SpilletidService {
  private apiUrl = 'https://localhost:7269/api/Spilletider/GetSpilletider'; // Replace with your API endpoint


  constructor(private http: HttpClient) { 
    
  }

GetSpilletider(): Observable<Spilletid[]> {
    return this.http.get<Spilletid[]>(this.apiUrl);
  }
GetSpilletiderById(id:number): Observable<Spilletid>{
    return this.http.get<Spilletid>(`${this.apiUrl}/${id}`);
  }

}