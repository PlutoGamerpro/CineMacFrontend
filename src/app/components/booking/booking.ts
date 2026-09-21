import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ChangeDetectorRef} from '@angular/core';
import { BookingService } from '../../services/booking.service';
import {Booking} from '../../models/Booking';
import {FILM_IMAGES} from '../../images';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-booking',
  styleUrl: './booking.css',
  templateUrl: './booking.html',
})
export class Bookingp implements OnInit {

  readonly cinemaImages = FILM_IMAGES; 
  errorMessage = '';
  bookings: Booking[] = [];
  isLoading = false;

  constructor(private bookingService: BookingService, private changeDetector: ChangeDetectorRef) {}

ngOnInit(): void {
  console.log("Booking component initialized");
}

CreateBooking(booking: Booking): void {
  this.isLoading = true;
this.bookingService.CreateBooking(booking).subscribe({
next:(data: Booking) => {
  this.bookings = [data];
  this.isLoading = false;
  this.changeDetector.markForCheck();
},
error:(error: any )=> {
  this.isLoading = false;
  this.errorMessage = 'Kunne ikke oprette booking. Kontrollér at backend-serveren kører.';
  console.error('Kunne ikke oprette booking:', error);
  this.changeDetector.markForCheck();
}
});

}
GetBookings(): void {
  this.isLoading = true;
   this.bookingService.GetBookings().subscribe({
    next:(data: Booking[]) => {
     this.bookings = data ?? [];
     this.changeDetector.markForCheck();
    },
    error:(error: any) => {
      this.isLoading = false;
      this.errorMessage = 'Kunne ikke hente bookinger. Kontrollér at backend-serveren kører.';
      console.error('Kunne ikke hente bookinger:', error);
      this.changeDetector.markForCheck();
    }

   });

  

   
}

}
