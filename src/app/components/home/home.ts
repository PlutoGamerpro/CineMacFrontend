import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Film } from '../../models/film';
import { FilmService } from '../../services/film.service';


@Component({
  selector: 'app-home',
  imports: [RouterLink],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  featuredFilm?: Film;
  currentFilms: Film[] = [];
  upcomingFilms: Film[] = [];
  errorMessage = '';

  constructor(private filmService: FilmService) {}

  ngOnInit(): void {
    this.filmService.GetFilm().subscribe({
      next: (films) => {
        const availableFilms = films ?? [];
        this.featuredFilm = availableFilms[0];
        this.currentFilms = availableFilms.slice(0, 6);
        this.upcomingFilms = availableFilms.slice(6, 10);
      },
      error: (error) => {
        console.error('Kunne ikke hente film til forsiden:', error);
        this.errorMessage = 'Filmene kunne ikke hentes. Kontrollér at backend-serveren kører.';
      },
    });
  }
}
