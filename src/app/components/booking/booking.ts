import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


import { Booking } from '../../models/Booking';
import { FILM_IMAGES } from '../../images';
import { sæde } from '../../models/sæde';
import { BookingService } from '../../services/booking.service';
import { SpilletidService } from '../../services/spilletid.service';
import { Spilletid } from '../../models/Spilletid';
import { map } from 'rxjs';

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

  spilletider: Spilletid | null = null;

  readonly bookinggebyr = 50;
  readonly ticketprice = 125;
   totalprice = 0;

  isLoading = false;
  bookings: Booking[] = [];
  bookingt: Booking | null = null;

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
 generateSeatsLayout(occupiedSeats: number[]): sæde[]{
  const rows =  14;
  const seatsPerRow = 20;
  const Layount: sæde[] = []
   

  for(let row = 0; row <= rows; row++){
    for(let seat = 1; seat <= seatsPerRow; seat++){
      const SeatId = (row * seatsPerRow ) +  seat;
      // example row9 * 14 + 1
      const IsOccupied = occupiedSeats.includes(SeatId);

      Layount.push({
        rokke: String.fromCharCode(65 + row),
        nummer: SeatId,
        isAvailable: !IsOccupied,
        isOccupied: IsOccupied,
        isSelected: false,
        salId: 0,
        id: SeatId,
      });

    }
  }
  return Layount;
 }
 seatsForRow(row: string): sæde[]{
  return this.rowseats.filter(seat => seat.rokke === row);
 }

  


  GoBack(): void {
    window.history.back();
  }


  LoadSeats(): void {
    this.LoadBookings();
  }


LoadBookings(): void{
  this.bookingservice.GetBookings().subscribe({
    next: (data: Booking[]) => {
      this.bookings = data ?? []; 
      this.isLoading = false;
      this.changeDetector.markForCheck();
    },
     error: (error) => {
        console.error('Kunne ikke hente bookingen', error);
        this.isLoading = false;
        this.errorMessage = 'bookigene kunne ikke hentes. Kontrollér at backend-serveren kører.';
        this.changeDetector.markForCheck();
      },
    });
}

CreateBooking(booking: Booking){
  this.bookingservice.CreateBooking(booking).subscribe({
   next(data){
    console.log({data}, "data send to db")
   },
    error(){
      console.log("error ");
    }
  })
}

  ClickOnSeat(seat: sæde): void {

    if(seat.isAvailable && !seat.isOccupied){
      seat.isSelected = !seat.isSelected;
      
      if(seat.isSelected && !this.SelectedSeats.includes(seat)){
        
        this.SelectedSeats.push(seat)
      }
      else{  
        this.SelectedSeats = this.SelectedSeats.filter(s => s !== seat );
    }
     
     console.log(this.SelectedSeats);
      /*
      seat.isSelected = seat.isAvailable = false;
        this.SelectedSeats.push(seat)
        console.log(`Seat ${seat.række}${seat.nummer} selected: ${seat.isSelected}`);
      }
      else{
      seat.isSelected = !seat.isSelected;
      this.SelectedSeats.pop();
      console.log(this.SelectedSeats.pop())
      }
      */
      console.log(`Seat ${seat.rokke}${seat.nummer} selected: ${seat.isSelected}`);
    }
  }


  ContinueBooking(): void {
    if(this.SelectedSeats.length > 0){
      this.showConfirmation = true;
    }
  }
  ChooseOtherSeat(): void {
    this.showConfirmation = false;
    
  }
  // map mean you convert an array to a string 
  // example [a,12,b,20] => 'a', '12',  'b', '20  ( if not join then it still has [])
get SelectedSeatLabel(): string { 
  return this.SelectedSeats.map(seat => `Række ${seat.rokke}, Sæde ${seat.nummer}`)
  .join(', ');
}

get TicketPrice(): number {
  return this.totalprice = (this.BookingTotal) * this.SelectedSeats.length;
}

get BookingTotal(): number {

  return this.totalprice =  (this.ticketprice + this.bookinggebyr) * this.SelectedSeats.length;

}



ConfirmBooking(): void {
 const spilletidId = this.spilletider?.id;

 if (spilletidId == null || this.SelectedSeats.length === 0 || !this.customerName.trim() || !this.customerEmail.trim()) {
  return;
 }

 this.SelectedSeats.forEach(seat => {
  this.CreateBooking({
    id: 0,
    navn: this.customerName,
    email: this.customerEmail,
    sædeId: seat.id,
    BookingTispunkt: new Date(),
    spilletidId,
  });
});
  this.bookingConfirmed = true;
}




   

}
  


   
