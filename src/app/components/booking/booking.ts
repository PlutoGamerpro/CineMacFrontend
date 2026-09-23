import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


import { Booking } from '../../models/Booking';
import { FILM_IMAGES } from '../../images';
import { sæde } from '../../models/sæde';

import { SpilletidService } from '../../services/spilletid.service';
import { Spilletid } from '../../models/Spilletid';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './booking.css',
  templateUrl: './booking.html',
})
export class booking implements OnInit {

 rowseats: sæde[] = [];

  readonly cinemaImages = FILM_IMAGES;

  errorMessage = '';

  spilletider: Spilletid | null = null;

  isLoading = false;
  bookings: Booking[] = [];


  constructor(
    
    private spilletidService: SpilletidService,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}


 GetSpilletiderById(id: number | string): void {
 this.isLoading = true;
 this.errorMessage = '';

 this.spilletidService.GetSpilletider().subscribe({
   next: (data) => {
    // loops throw data find found id matches url then return spilletider else return null
     this.spilletider = data.find(s => s.id === Number(id)) ?? null;
     
     
 
     this.isLoading = false;
     console.log('Spilletider:', this.spilletider);
     this.changeDetector.markForCheck();
     
   }, error: (error) => {
     console.error('Kunne ikke hente film med ID:', id, error);
     this.isLoading = false;
     this.changeDetector.markForCheck();
   }
    });
  

}
     ngOnInit(): void {
     this.isLoading = true;
     this.errorMessage = '';
     this.spilletider = null;
     // 1. Get the 'id' parameter from the URL (/films/1 -> '1')


     var occupiedSeats = this.bookings.map(b => b.sædeId);

      console.log(
          'Occupied seat IDs:',
          occupiedSeats
        );

        this.rowseats =
          this.generateSeatsLayout(occupiedSeats);

     const id = this.route.snapshot.paramMap.get('id');
 
     // 2. Call your https://localhost:7269 backend endpoint
     if (id) { 
       this.GetSpilletiderById(id);  
      }
   }
  generateSeatsLayout(occupiedSeats: number[]): sæde[] {
    const rows = 9;
    const seatsPerRow = 20;
    const layout: sæde[] = [];

    for (let row = 0; row < rows; row++) {
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const id = row * seatsPerRow + seat;
        const isOccupied = occupiedSeats.includes(id);
        layout.push({
          række: String.fromCharCode(65 + row),
          nummer: seat,
          isAvailable: !isOccupied,
          isOccupied: isOccupied,
          isSelected: false,
          id,
          salId: 0
        });
      }
    }

    return layout;
  }

  seatsForRow(row: string): sæde[] {
    return this.rowseats.filter(seat => seat.række === row);
  }


  GoBack(): void {
    window.history.back();
  }

/*
  LoadSeats(showtimeId: number): void {
    this.GetBookingsByShowtimeId(showtimeId);
  }
    */
/*
  GetBookingsByShowtimeId(showtimeId: number): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.bookingService.GetBookingsByShowtimeId(showtimeId).subscribe({

      next: (data: Booking[]) => {

        this.bookings = data ?? [];

        console.log('Bookings for showtime:', this.bookings);

       


               

        this.isLoading = false;

        this.changeDetector.detectChanges();
      },

      error: (error) => {

        console.error(
          'Kunne ikke hente bookinger:',
          error
        );

        this.isLoading = false;

        this.errorMessage =
          'Kunne ikke hente sæder. Prøv igen senere.';

        // IMPORTANT:
        // Don't show all seats as available if the
        // booking information could not be loaded.
       

        this.changeDetector.detectChanges();
      }
    });
  }
*/
  ClickOnSeat(seat: sæde): void {

    if(seat.isAvailable && !seat.isOccupied) {
      seat.isSelected = !seat.isSelected;
      console.log(`Seat ${seat.række}${seat.nummer} selected: ${seat.isSelected}`);
    }
  }

    

   

}
  


   
