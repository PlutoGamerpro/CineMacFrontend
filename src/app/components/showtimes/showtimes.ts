import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeDa from '@angular/common/locales/da';
// import { finalize } from 'rxjs';
import { FilmShowtime, SpilletidService } from '../../services/spilletid.service';

registerLocaleData(localeDa);

@Component({
  selector: 'app-showtimes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './showtimes.html',
  styleUrl: './showtimes.css',
})
export class Showtimes implements OnInit {
  selectedDate: string | null = null;
  dateOptions: string[] = [];
  filmShowtimes: FilmShowtime[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private spilletidService: SpilletidService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.dateOptions = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() + index);
      return date.toISOString().slice(0, 10);
    });

    this.GetGroupShowtimes();
  }

GetGroupShowtimes(): void {
  this.isLoading = true;
  this.errorMessage = '';

  this.spilletidService.GroupedSpilletider(this.selectedDate)
   /* .pipe(finalize(() => {
      this.isLoading = false;
      this.changeDetectorRef.markForCheck();
    }))
      */
    .subscribe({
      next: (data) => {
        console.log('Hentede spilletider:', data);
        this.filmShowtimes = data;
        this.changeDetectorRef.markForCheck();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Kunne ikke hente spilletider:', error);
        this.errorMessage = 'Spilletiderne kunne ikke hentes.';
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  selectDate(date: string | null): void {
    this.selectedDate = date;
    this.GetGroupShowtimes();
  }
}