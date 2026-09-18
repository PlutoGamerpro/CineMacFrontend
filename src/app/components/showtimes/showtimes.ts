import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmShowtime, SpilletidService } from '../../services/spilletid.service';

@Component({
  selector: 'app-showtimes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './showtimes.html',
  styleUrl: './showtimes.css',
})
export class Showtimes implements OnInit {
  selectedDate: string | null = null;
  filmShowtimes: FilmShowtime[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private spilletidService: SpilletidService) {}

  ngOnInit(): void {
  this.GetGroupShowtimes();
}

GetGroupShowtimes(): void {
  this.isLoading = true;
  this.errorMessage = '';

  this.spilletidService.GroupedSpilletider(this.selectedDate).subscribe({
    next: (data) => {
      console.log('Hentede spilletider:', data);
      this.filmShowtimes = data;
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Kunne ikke hente spilletider:', error);
      this.errorMessage = 'Spilletiderne kunne ikke hentes.';
      this.isLoading = false;
    }
  });
  }

  selectDate(date: string | null): void {
    this.selectedDate = date;
    this.GetGroupShowtimes();
  }
}