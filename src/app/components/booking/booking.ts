import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/Booking';
import { FILM_IMAGES } from '../../images';
import { sæde } from '../../models/sæde';

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

  bookings: Booking[] = [];

  isLoading = false;

  showtimeId!: number;

  constructor(
    private bookingService: BookingService,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    console.log('Booking component initialized');

    const showtimeIdParam =
      this.route.snapshot.paramMap.get('showtimeId')
      ?? this.route.snapshot.paramMap.get('id');

    if (!showtimeIdParam) {
      this.errorMessage = 'Ingen spilletid blev fundet.';
      return;
    }

    this.showtimeId = Number(showtimeIdParam);

    if (isNaN(this.showtimeId)) {
      this.errorMessage = 'Ugyldigt showtime ID.';
      return;
    }

    this.LoadSeats(this.showtimeId);
  }

  LoadSeats(showtimeId: number): void {
    this.GetBookingsByShowtimeId(showtimeId);
  }

  GetBookingsByShowtimeId(showtimeId: number): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.bookingService.GetBookingsByShowtimeId(showtimeId).subscribe({

      next: (data: Booking[]) => {

        this.bookings = data ?? [];

        console.log('Bookings for showtime:', this.bookings);

        const occupiedSeatIds = this.bookings
          .map(booking => booking.sædeId);

        console.log(
          'Occupied seat IDs:',
          occupiedSeatIds
        );

        this.rowseats =
          this.generateSeatsLayout(occupiedSeatIds);

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
        this.rowseats = [];

        this.changeDetector.detectChanges();
      }
    });
  }

  ClickOnSeat(seat: sæde): void {

    if (seat.isOccupied) {
      console.log(
        'Seat is occupied and cannot be selected.'
      );

      return;
    }

    seat.isSelected = !seat.isSelected;

    console.log(
      'Seat:',
      seat.id,
      'Selected:',
      seat.isSelected
    );
  }

  private generateSeatsLayout(
    occupiedSeatIds: number[]
  ): sæde[] {

    const totalSeatsInRow = 14;

    const generatedSeats: sæde[] = [];

    for (let i = 1; i <= totalSeatsInRow; i++) {

      const isOccupied =
        occupiedSeatIds.includes(i);

      const newSeat: sæde = {

        id: i,

        nummer: i,

        række: 'C',

        salId: 1,

        isOccupied: isOccupied,

        isAvailable: !isOccupied,

        isSelected: false
      };

      generatedSeats.push(newSeat);
    }

    return generatedSeats;
  }
}