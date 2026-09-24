import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Booking } from '../../models/Booking';
import { FILM_IMAGES } from '../../images';
import { sæde } from '../../models/sæde';
import { BookingService } from '../../services/booking.service';
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
  SelectedSeats: sæde[] = [];

  occupiedSeatIds = signal<number[]>([]);
  spilletider: Spilletid | null = null;

  readonly bookinggebyr = 50;
  readonly ticketprice = 125;
  totalprice = 0;

  isLoading = false;
  bookings: Booking[] = [];

  showConfirmation = false;
  bookingConfirmed = false;
  customerName = '';
  customerEmail = '';

  constructor(
    private spilletidService: SpilletidService,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
    private bookingservice: BookingService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.spilletider = null;

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.GetSpilletiderById(id);
      this.LoadBookings(id); // 1. Pass showtime ID to load existing bookings
    }
  }

  GetSpilletiderById(id: number | string): void {
    this.spilletidService.GetSpilletider().subscribe({
      next: (data) => {
        this.spilletider = data.find((s) => s.id === Number(id)) ?? null;
        this.isLoading = false;
        this.changeDetector.markForCheck();
      },
      error: (error) => {
        console.error('Kunne ikke hente film med ID:', id, error);
        this.isLoading = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  LoadBookings(spilletidId?: number | string): void {
    this.bookingservice.GetBookings().subscribe({
      next: (data: Booking[]) => {
        const currentSpilletidId = spilletidId ?? this.spilletider?.id;

        // 2. Filter bookings for THIS specific showtime
        if (currentSpilletidId) {
          this.bookings = data.filter((b) => b.spilletidId === Number(currentSpilletidId));
        } else {
          this.bookings = data ?? [];
        }

        // 3. Update occupied IDs list
        const occupied = this.bookings.map((b) => b.sædeId);
        this.occupiedSeatIds.set(occupied);

        // 4. Regenerate seat layout with new occupied data
        this.rowseats = this.generateSeatsLayout(occupied);

        this.isLoading = false;
        this.changeDetector.markForCheck();
      },
      error: (error) => {
        console.error('Kunne ikke hente bookingen', error);
        this.isLoading = false;
        this.errorMessage = 'Bookingerne kunne ikke hentes. Kontrollér at backend-serveren kører.';
        this.changeDetector.markForCheck();
      },
    });
  }

  generateSeatsLayout(occupiedSeats: number[]): sæde[] {
    const rows = 9; // Changed to 9 to match 'A' through 'I'
    const seatsPerRow = 20;
    const layout: sæde[] = [];

    for (let row = 0; row < rows; row++) {
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatId = row * seatsPerRow + seat;
        const isOccupied = occupiedSeats.includes(seatId);

        layout.push({
          rokke: String.fromCharCode(65 + row),
          nummer: seat,
          isAvailable: !isOccupied,
          isOccupied: isOccupied,
          isSelected: false,
          salId: 0,
          id: seatId,
        });
      }
    }
    return layout;
  }

  seatsForRow(row: string): sæde[] {
    return this.rowseats.filter((seat) => seat.rokke === row);
  }

  GoBack(): void {
    window.history.back();
  }

  get OccupiedSeatsId(): number[] {
    return [...new Set(this.bookings.map((seat) => seat.sædeId))];
  }

  ClickOnSeat(seat: sæde): void {
    if (seat.isAvailable && !seat.isOccupied) {
      seat.isSelected = !seat.isSelected;

      if (seat.isSelected) {
        this.SelectedSeats.push(seat);
      } else {
        this.SelectedSeats = this.SelectedSeats.filter((s) => s.id !== seat.id);
      }
    }
  }

  ContinueBooking(): void {
    if (this.SelectedSeats.length > 0) {
      this.showConfirmation = true;
    }
  }

  ChooseOtherSeat(): void {
    this.showConfirmation = false;
  }

  get SelectedSeatLabel(): string {
    return this.SelectedSeats.map((seat) => `Række ${seat.rokke}, Sæde ${seat.nummer}`).join(', ');
  }

  get TicketPrice(): number {
    return (this.totalprice = this.BookingTotal * this.SelectedSeats.length);
  }

  get BookingTotal(): number {
    return (this.totalprice = (this.ticketprice + this.bookinggebyr) * this.SelectedSeats.length);
  }

  ConfirmBooking(): void {
    const spilletidId = this.spilletider?.id;

    if (
      spilletidId == null ||
      this.SelectedSeats.length === 0 ||
      !this.customerEmail.trim() ||
      !this.customerName.trim()
    ) {
      return;
    }

    let completedRequests = 0;

    // Send HTTP POST request for each selected seat
    this.SelectedSeats.forEach((seat) => {
      const newBooking: Booking = {
        id: 0,
        navn: this.customerName,
        email: this.customerEmail,
        sædeId: seat.id,
        spilletidId: spilletidId,
        BookingTispunkt: new Date(),
      };

      this.bookingservice.CreateBooking(newBooking).subscribe({
        next: () => {
          completedRequests++;
          // 5. When all bookings are saved, reload from backend
          if (completedRequests === this.SelectedSeats.length) {
            this.bookingConfirmed = true;
            this.SelectedSeats = [];
            this.LoadBookings(spilletidId); // Reloads seats & turns newly booked seats red!
          }
        },
        error: (err) => console.error('Fejl ved oprettelse af booking:', err),
      });
    });
  }

  isOccupied(seatId: number): boolean {
    return this.occupiedSeatIds().includes(seatId);
  }
}