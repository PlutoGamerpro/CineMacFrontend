import { Component } from '@angular/core';
import { FilmService } from '../../services/film.service';
import { CommonModule } from '@angular/common';
import { Film } from '../../models/film';

@Component({
  imports: [CommonModule],
  selector: 'app-film-list',
  styleUrl: './film-list.css',
  templateUrl: './film-list.html',
})
export class FilmList {

  films: Film[] = [];

  constructor(private filmService: FilmService) { }
   
  ngOnInit(){
    this.filmService.GetFilm().subscribe((data: Film[]) => {
      this.films = data;
    });
  }

  get featuredFilm(): Film | undefined {
    return this.films[0];
  }
}

