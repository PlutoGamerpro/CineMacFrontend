import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/Booking';
import { sæde } from '../models/sæde';

export interface BookingEntry {
    id: number,
    navn: string,
    email: string,
    SpilletidId: number,
    SædeId: number,
    bookingTidspunkt: string;
    totalSeats: sæde[];       // All seats in the hall
  occupiedSeatIds: number[]; // IDs of seats already booked
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
    GetBookingsByShowtimeId(showtimeId: number | string): Observable<Booking[]> {
        return this.http.get<Booking[]>(`${this.GetBookingsByShowtimeIdApiUrl}/${showtimeId}`);
    }
    DeleteBooking(id: number): Observable<void> {
        return this.http.delete<void>(`https://localhost:7269/api/Bookings/DeleteBooking/${id}`);
    }
    

}
