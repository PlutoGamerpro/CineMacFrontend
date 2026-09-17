import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SpilletidService} from "../../services/spilletid.service";
import { Spilletid } from '../../models/Spilletid';

interface ShowtimeWithDetails extends Spilletid {
  film?: {
    title: string;
    genre: string;
    varighed: number;
    billedeturl: string;
  };
  sal?: {
    navn: string;
  };
}

interface FilmShowtimes {
  filmId: number;
  film?: ShowtimeWithDetails['film'];
  showtimes: ShowtimeWithDetails[];
}

@Component({
  imports: [CommonModule],
  selector: 'app-showtimes',
  styleUrl: './showtimes.css',
  templateUrl: './showtimes.html',
})
export class Showtimes  implements OnInit {

showtime: ShowtimeWithDetails[] = [];
filmShowtimes: FilmShowtimes[] = [];
selectedDate: string | null = null;
isLoading = false;
errorMessage = '';

get availableDates(): string[] {
  return [...new Set(this.showtime.map(showtime => this.dateKey(showtime.startTime)))].sort();
}

get visibleFilmShowtimes(): FilmShowtimes[] {
  if (!this.selectedDate) {
    return this.filmShowtimes;
  }

  return this.filmShowtimes
    .map(group => ({
      ...group,
      showtimes: group.showtimes.filter(showtime => this.dateKey(showtime.startTime) === this.selectedDate),
    }))
    .filter(group => group.showtimes.length > 0);
}

ngOnInit(): void {
this.GetShowTimes();
}


  constructor(private spilletidService: SpilletidService) { }

   GetShowTimes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.spilletidService.GetSpilletider().subscribe({
      next: data => {
        this.showtime = data as ShowtimeWithDetails[];
        this.filmShowtimes = this.groupByFilm(this.showtime);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Kunne ikke hente spilletider:', error);
        this.isLoading = false;
        this.errorMessage = 'Spilletiderne kunne ikke hentes.';
      }
    });
}

selectDate(date: string | null): void {
  this.selectedDate = date;
}

formatDate(date: string): string {
  return new Intl.DateTimeFormat('da-DK', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${date}T12:00:00`));
}

private dateKey(value: Date | string): string {
  return new Date(value).toISOString().slice(0, 10);
}

private groupByFilm(showtimes: ShowtimeWithDetails[]): FilmShowtimes[] {
  const groups = new Map<number, FilmShowtimes>();

  for (const showtime of showtimes) {
    const group = groups.get(showtime.filmId);

    if (group) {
      group.showtimes.push(showtime);
    } else {
      groups.set(showtime.filmId, {
        filmId: showtime.filmId,
        film: showtime.film,
        showtimes: [showtime],
      });
    }
  }

  return Array.from(groups.values());
}
    
  }
   
  


