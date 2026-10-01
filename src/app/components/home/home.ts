import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Film } from '../../models/film';
import { FilmService } from '../../services/film.service';
import {FILM_IMAGES} from '../../images';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {

  readonly  filmImages = FILM_IMAGES;

  featuredFilm?: Film;
  currentFilms: Film[] = [];
  upcomingFilms: Film[] = [];
  errorMessage = '';

  constructor(
    private filmService: FilmService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.filmService.GetFilm().subscribe({
      next: (films) => {
        const availableFilms = films ?? [];
        this.featuredFilm = availableFilms[0]; // slide tager elemmenter 0-6 og 
        this.currentFilms = availableFilms.slice(0, 6);
        this.upcomingFilms = availableFilms.slice(6, 10);
        // The first HTTP response can arrive after the initial render. Ensure
        // the front page is refreshed immediately, not only after navigation.
        this.changeDetector.markForCheck();
      },
      error: (error) => {
        console.error('Kunne ikke hente film til forsiden:', error);
        this.errorMessage = 'Filmene kunne ikke hentes. Kontrollér at backend-serveren kører.';
        this.changeDetector.markForCheck();
      },
    });
  }
}
