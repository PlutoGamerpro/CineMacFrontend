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

  constructor(private filmService: FilmService) {}

  ngOnInit(): void {
    this.filmService.GetFilm().subscribe((films) => {
      this.featuredFilm = films[0];
    });
  }
}
