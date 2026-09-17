import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmService } from '../../services/film.service';
import { Film } from '../../models/film';

@Component({
  selector: 'app-film-list',
  imports: [CommonModule],
  styleUrl: './film-list.css',
  templateUrl: './film-list.html',
})
export class FilmList implements OnInit {
  films: Film[] = [];
  searchTerm = '';
  selectedGenre = 'Alle genrer';
  isLoading = false;
  errorMessage = '';

  constructor(private filmService: FilmService) {}

  ngOnInit(): void {
    this.loadFilms();
  }

  loadFilms(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.filmService.GetFilm().subscribe({
      next: (data: Film[]) => {
        this.films = data ?? [];
        this.isLoading = false;
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
}