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

        // Only build date tabs once from future showtimes.
        if (this.dateOptions.length === 0) {
          const now = Date.now();

          this.dateOptions = [...new Set(
            data
              .flatMap((filmGroup: any) => (filmGroup.showtimes ?? []).map((st: any) => st.startTime))
              .filter((startTime: string) => new Date(startTime).getTime() > now)
              .map((startTime: string) => this.toDateKey(startTime))
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

  get visibleFilmShowtimes(): any[] {
    if (!this.filmShowtimes) return [];

    const now = Date.now();

    return this.filmShowtimes
      .map(group => ({
        ...group,                                     // opretter ny date udfra filemen startpunkt og omdanner det til millisekunder
        showtimes: (group.showtimes ?? []).filter(st => new Date(st.startTime).getTime() >= now)
      }))
      .filter(group => group.showtimes.length > 0);
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