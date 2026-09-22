import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FilmService } from '../../services/film.service';
import { Film } from '../../models/film';


@Component({
  selector: 'app-film-detail',
  standalone: true,
  templateUrl: './film-detail.html',
  styleUrl: './film-detail.css'
})
export class FilmDetail implements OnInit {

  constructor(private filmService: FilmService, private route: ActivatedRoute, private cdRef: ChangeDetectorRef) {}
  errorMessage = '';
  isLoading = false;
  film: Film | null = null;
 
GetFilmDetailById(id: number | string): void {
this.isLoading = true;
this.errorMessage = '';
this.film = null;

this.filmService.GetFilmById(id).subscribe({
  next: (data) => {
    this.film = data ?? null;
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