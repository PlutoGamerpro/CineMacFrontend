import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FilmService } from '../../services/film.service';
import { Film } from '../../models/film';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-film-list',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './film-list.css',
  templateUrl: './film-list.html',
})
export class FilmList implements OnInit {
  films: Film[] = [];
  film: Film | null = null;
  searchTerm = '';
  selectedGenre = 'Alle genrer';
  isLoading = false;
  errorMessage = '';

  //private route = inject(ActivatedRoute);

  constructor(private filmService: FilmService, private changeDetector: ChangeDetectorRef, private router: ActivatedRoute) {}


  
  ngOnInit(): void {
    this.loadFilms();
  }

  LoadFilmById(id: number): void {

    

    this.isLoading = true;
    this.errorMessage = '';
    this.film = null;


    this.filmService.GetFilmById(id).subscribe({
      next: (data) => {
        this.film = data ?? [];
        this.isLoading = false;
        this.changeDetector.markForCheck();
      },
      error: (error) => {
        console.error('Kunne ikke hente film med ID:', id, error);
        this.isLoading = false;
        this.changeDetector.markForCheck();
      }
    });
  }


  loadFilms(): void {
    this.isLoading = true;
    this.errorMessage = '';

   

    this.filmService.GetFilm().subscribe({
      next: (data: Film[]) => {
        this.films = data ?? [];
        this.isLoading = false;
        this.changeDetector.markForCheck();
      },
      error: (error) => {
        console.error('Kunne ikke hente film:', error);
        this.isLoading = false;
        this.errorMessage = 'Filmene kunne ikke hentes. Kontrollér at backend-serveren kører.';
      },
    });
  }

  get genres(): string[] {
    return ['Alle genrer', ...new Set(this.films.map((film) => film.genre).filter(Boolean))];
  }

  get filteredFilms(): Film[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.films.filter((film) => {
      const matchesGenre = this.selectedGenre === 'Alle genrer' || film.genre === this.selectedGenre;
      const matchesSearch = !search || `${film.title} ${film.genre}`.toLowerCase().includes(search);
      return matchesGenre && matchesSearch;
    });
  }

  onFilmClick(film: Film): void {
    
  const Id = this.router.snapshot.paramMap.get('id');
    if (Id) {
      const filmId = parseInt(Id, 10);
      this.LoadFilmById(filmId);
    }

   
  }
}