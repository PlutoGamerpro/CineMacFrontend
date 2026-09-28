import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeDa from '@angular/common/locales/da';
// import { finalize } from 'rxjs';
import { FilmShowtime, SpilletidService } from '../../services/spilletid.service';
import { Router } from '@angular/router';
import { Film } from '../../models/film';
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
    private router: Router
  ) {}

  ngOnInit(): void {
   this.GetGroupShowtimes();
    }

 GetGroupShowtimes(): void {
  this.isLoading = true;
  this.errorMessage = '';

  this.spilletidService.GroupedSpilletider(this.selectedDate)
    .subscribe({
      next: (data) => {
        console.log('Hentede spilletider:', data);
        this.filmShowtimes = data;

        // 1. Only build dateOptions on the FIRST load when tabs are empty
        if (this.dateOptions.length === 0) {
          const now = Date.now();
          const allStartTimes: string[] = [];

          // Collect all start times across all movies
          data.forEach((filmGroup: any) => {
            const showtimes = filmGroup.showtimes || filmGroup.spilletider || [];
            showtimes.forEach((st: any) => {
              if (st.startTime) {
                allStartTimes.push(st.startTime);
              }
            });
          });

          // Filter out past showtimes and generate unique date keys
          this.dateOptions = [...new Set(
            allStartTimes
              .filter(startTime => new Date(startTime).getTime() > now)
              .map(startTime => this.toDateKey(startTime))
          )].sort();
        }

        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Kunne ikke hente spilletider:', error);
        this.errorMessage = 'Spilletiderne kunne ikke hentes.';
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
}

// 1. Filter individual showtime items to only include future times
getUpcomingShowtimes(showtimes: any[]): any[] {
  if (!showtimes) return [];
  const now = Date.now();
  return showtimes.filter(st => new Date(st.startTime).getTime() > now);
}

// 2. Filter film groups so movies with zero remaining showtimes don't display
get visibleFilmShowtimes(): any[] {
  if (!this.filmShowtimes) return [];
  
  return this.filmShowtimes
    .map(group => ({
      ...group,
      upcomingShowtimes: this.getUpcomingShowtimes(group.showtimes)
    }))
    .filter(group => group.upcomingShowtimes.length > 0);
}

  selectDate(date: string | null): void {
    this.selectedDate = date;
    this.GetGroupShowtimes();
  }

  
  private toDateKey(value: Date | string): string {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


 
  OnShowTimeClick(film: any): void {

    console.log('Clicked showtime:', film);
    this.router.navigate(['/booking', film.id]);
  }
}