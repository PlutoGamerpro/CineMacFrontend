import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Booking } from '../models/Booking';

export interface BookingEntry {
    id: number,
    navn: string,
    email: string,
    SpilletidId: number,
    SædeId: number,
    BookingTispunkt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService { 
    
    private GetBookingApiUrl = "https://localhost:7269/api/Bookings/GetAllBookings";
    private CreateBookingApiUrl = "https://localhost:7269/api/Bookings/CreateBooking";

    private GetBookingsByShowtimeIdApiUrl ="https://localhost:7269/api/Bookings/GetBookingsForShowtime";
    constructor(private http: HttpClient) {}

    GetBookings(): Observable<Booking[]> {
        return this.http.get<Booking[]>(this.GetBookingApiUrl);
    }
    CreateBooking(booking: Booking): Observable<Booking> {
        return this.http.post<Booking>(this.CreateBookingApiUrl, booking);
    }
    GetBookingsByShowtimeId(showtimeId: number): Observable<Booking[]> {
        return this.http.get<Booking[]>(`${this.GetBookingsByShowtimeIdApiUrl}/${showtimeId}`);
    }
}