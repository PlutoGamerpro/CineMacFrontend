import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FilmService } from '../../services/film.service';
import { Film } from '../../models/film';
import { Spilletid } from '../../models/Spilletid';
import { SpilletidService } from '../../services/spilletid.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-film-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './film-detail.html',
  styleUrl: './film-detail.css'
})
export class FilmDetail implements OnInit {

  filmtoEdit!: string | number;



  constructor(private filmService: FilmService, private route: ActivatedRoute, private cdRef: ChangeDetectorRef, private spilletidservice: SpilletidService, private router: Router) {}
  errorMessage = '';
  isLoading = false;
  film: Film | null = null;
  //filmShowtimes: FilmShowtime[] = [];


  filmshowtime: Spilletid[] = [];


  selectedDate: string | null = null;
  dateOptions: string[] = [];

  get filteredShowtimes(): Spilletid[] {
    const now = new Date();

    return this.filmshowtime.filter(showtime => {
      const startsInFuture = new Date(showtime.startTime) > now;
      const matchesDate = !this.selectedDate || this.toDateKey(showtime.startTime) === this.selectedDate;

      return startsInFuture && matchesDate;
    });
  }

  selectDate(date: string): void {
    this.selectedDate = date;
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('da-DK', { weekday: 'long', day: 'numeric', month: 'short' })
      .format(new Date(`${date}T12:00:00`));
  }

  formatTime(value: Date | string): string {
    return new Intl.DateTimeFormat('da-DK', { hour: '2-digit', minute: '2-digit', hour12: false })
      .format(new Date(value));
  }

  private toDateKey(value: Date | string): string {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  

  GetSpilletiderBy(){
  this.spilletidservice.GetSpilletider().subscribe({
    next: (data) =>   {
      this.filmshowtime = data;
     this.filmshowtime = data.filter(f => f.filmId === this.filmtoEdit);

         // this.filmshowtime.map(showtime => this.toDateKey(showtime.startTime))
   
   

    const CurrentlyDate = new Date();

    this.dateOptions = [...new Set(
      this.filmshowtime
        .filter(showtime => new Date(showtime.startTime) > CurrentlyDate)
        .map(showtime => this.toDateKey(showtime.startTime))
    )].sort();

     this.selectedDate = this.dateOptions[0] ?? null;
     


    

   
   

     this.filmshowtime.forEach(element => {
      console.log(element);
      this.cdRef.markForCheck();
     });
  },
   error: (error) => {
    this.cdRef.markForCheck();
    
   

  }
    });

  }


  

OnShowTimeClick(film: Spilletid): void {
  console.log('Selected film:', film);
  this.router.navigate(['/booking', film.id]);
  // Add your navigation or modal dialog logic here
}

  
GetFilmDetailById(id: number | string): void {
this.isLoading = true;
this.errorMessage = '';
this.film = null;

this.filmService.GetFilmById(id).subscribe({
  next: (data) => {
    this.film = data ?? null;
    this.filmtoEdit = this.film.id;
    this.GetSpilletiderBy();
    
    this.isLoading = false;
    this.cdRef.markForCheck();
  }, error: (error) => {
    console.error('Kunne ikke hente film med ID:', id, error);
    this.isLoading = false;
    this.cdRef.markForCheck();
  }
});
  }
    ngOnInit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.film = null;
    // 1. Get the 'id' parameter from the URL (/films/1 -> '1')
    const id = this.route.snapshot.paramMap.get('id');


   


    // 2. Call your https://localhost:7269 backend endpoint
    if (id) { 
         this.GetFilmDetailById(id); 
    }
  }
}