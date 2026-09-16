import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {sal} from "../models/sal";



@Injectable({
  providedIn: 'root'
})
export class SalService {
  private apiUrl = 'https://localhost:7269/api/Sal'; // Replace with your API endpoint


  constructor(private http: HttpClient) { }

GetSæde(): Observable<sal[]> {
    return this.http.get<sal[]>(this.apiUrl);
  }
GetSædeId(id:number): Observable<sal>{
    return this.http.get<sal>(`${this.apiUrl}/${id}`);
  }

}