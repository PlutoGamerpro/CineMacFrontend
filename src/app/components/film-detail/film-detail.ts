import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FilmService } from '../../services/film.service';
import { Film } from '../../models/film';
import { FilmShowtime } from '../../services/spilletid.service';
import { Spilletid } from '../../models/Spilletid';
import { SpilletidService } from '../../services/spilletid.service';
import { Showtimes } from '../showtimes/showtimes';

@Component({
  selector: 'app-film-detail',
  standalone: true,
  templateUrl: './film-detail.html',
  styleUrl: './film-detail.css'
})
export class FilmDetail implements OnInit {

  filmtoEdit!: string | number;


  constructor(private filmService: FilmService, private route: ActivatedRoute, private cdRef: ChangeDetectorRef, private spilletidservice: SpilletidService) {}
  errorMessage = '';
  isLoading = false;
  film: Film | null = null;
  //filmShowtimes: FilmShowtime[] = [];


  filmshowtime: Spilletid[] = [];


  selectedDate: string | null = null;
  dateOptions: string[] = [];

  

  GetSpilletiderBy(){
  this.spilletidservice.GetSpilletider().subscribe({
    next: (data) =>   {
      this.filmshowtime = data;
     this.filmshowtime = data.filter(f => f.filmId === this.filmtoEdit);

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


  

OnShowTimeClick(showtime: Spilletid): void {
  console.log('Selected showtime:', showtime);
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
        this.GetSpilletiderBy();
     
      
        this.dateOptions = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() + index);
      return date.toISOString().slice(0, 10);
    });

  //  this.GetGroupShowtimes();
          
    }
  }
}