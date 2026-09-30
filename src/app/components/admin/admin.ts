import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Booking } from '../../models/Booking';
import { Film } from '../../models/film';
import { Spilletid } from '../../models/Spilletid';
import { sal } from '../../models/sal';
import { BookingService } from '../../services/booking.service';
import { FilmService } from '../../services/film.service';
import { SalService } from '../../services/sal.service';
import { SpilletidService } from '../../services/spilletid.service';

type AdminTab = 'film' | 'spilletider' | 'bookinger'; //type definiere at admintap kun må have det værdier
type FilmForm = Omit<Film, 'id'>; //omit opretter en filmform som har lige præcis de samme felter som film undtagen id

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  activeTab: AdminTab = 'film';
  films: Film[] = [];
  showtimes: Spilletid[] = [];
  bookings: Booking[] = [];
  halls: sal[] = [];
  bookingSearch = '';
  editingFilmId: number | string | null = null;
  isSaving = false;
  message = '';
  errorMessage = '';
  filmForm: FilmForm = this.emptyFilmForm();
  showtimeForm = { filmId: 0, salId: 0, startTime: '' };

  constructor(
    private filmsApi: FilmService,
    private bookingsApi: BookingService,
    private showtimesApi: SpilletidService,
    private hallsApi: SalService,
  ) {}

  ngOnInit(): void { this.loadAll(); }

  loadAll(): void {
    this.filmsApi.GetFilm().subscribe({ next: data => this.films = data ?? [], error: () => this.showError('Film kunne ikke hentes.') });
    this.showtimesApi.GetSpilletider().subscribe({ next: data => this.showtimes = data ?? [], error: () => this.showError('Spilletider kunne ikke hentes.') });
    this.bookingsApi.GetBookings().subscribe({ next: data => this.bookings = data ?? [], error: () => this.showError('Bookinger kunne ikke hentes.') });
    this.hallsApi.GetSæde().subscribe({ next: data => this.halls = data ?? [], error: () => this.showError('Sale kunne ikke hentes.') });
  }
  // clearNotice nulstiller notificationer / fejlbeskeder fra skærmen.
  selectTab(tab: AdminTab): void { this.activeTab = tab; this.clearNotice(); }

  saveFilm(): void {
    if (!this.filmForm.title.trim() || !this.filmForm.genre.trim() || this.filmForm.varighed <= 0) {
      this.showError('Udfyld titel, genre og en gyldig varighed.'); return;
    }
    this.isSaving = true; // 3 equals mean same value and same data type
    const request = this.editingFilmId === null
      ? this.filmsApi.CreateFilm(this.filmForm)
      : this.filmsApi.UpdateFilm(this.editingFilmId, this.filmForm);
    request.subscribe({
      next: () => { this.success(this.editingFilmId === null ? 'Filmen er oprettet.' : 'Filmen er opdateret.'); this.cancelFilmEdit(); this.reloadFilms(); this.isSaving = false; },
      error: () => { this.showError('Filmen kunne ikke gemmes.'); this.isSaving = false; },
    });
  }

  editFilm(film: Film): void {
    this.editingFilmId = film.id;
    this.filmForm = { title: film.title, beskrivelse: film.beskrivelse, genre: film.genre, varighed: film.varighed, trailerUrl: film.trailerUrl, billedeturl: film.billedeturl };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelFilmEdit(): void { this.editingFilmId = null; this.filmForm = this.emptyFilmForm(); }

  deleteFilm(film: Film): void {
    if (!confirm(`Vil du slette “${film.title}”?`)) return;
    this.filmsApi.DeleteFilm(film.id).subscribe({ next: () => { this.success('Filmen er slettet.'); this.reloadFilms(); }, error: () => this.showError('Filmen kan ikke slettes, muligvis fordi den har spilletider.') });
  }

  saveShowtime(): void {
    if (!this.showtimeForm.filmId || !this.showtimeForm.salId || !this.showtimeForm.startTime) { this.showError('Vælg film, sal og starttidspunkt.'); return; }
    this.isSaving = true;
    this.showtimesApi.CreateSpilletid(this.showtimeForm).subscribe({
      next: () => { this.success('Spilletiden er oprettet.'); this.showtimeForm = { filmId: 0, salId: 0, startTime: '' }; this.reloadShowtimes(); this.isSaving = false; },
      error: () => { this.showError('Spilletiden kunne ikke oprettes.'); this.isSaving = false; },
    });
  }

  cancelBooking(booking: Booking): void {
    if (!confirm(`Annullér booking for ${booking.navn}?`)) return;
    this.bookingsApi.DeleteBooking(booking.id).subscribe({ next: () => { this.success('Bookingen er annulleret.'); this.reloadBookings(); }, error: () => this.showError('Bookingen kunne ikke annulleres.') });
  }

  get filteredBookings(): Booking[] {
    const query = this.bookingSearch.trim().toLocaleLowerCase();
    if (!query) return this.bookings;
    //Tjekker om søgeordet (f.eks. "inc") findes inde i den lange tekst.
    return this.bookings.filter(b => `${b.navn} ${b.email} ${b.spilletid?.film?.title ?? ''} ${b.spilletid?.startTime ?? ''}`.toLocaleLowerCase().includes(query));
  }

  filmTitle(showtime: Spilletid): string { return showtime.film?.title ?? `Film #${showtime.filmId}`; }
  hallName(showtime: Spilletid): string { return showtime.sal?.navn ?? `Sal #${showtime.salId}`; }
  bookingFilm(booking: Booking): string { return booking.spilletid?.film?.title ?? `Spilletid #${booking.spilletidId}`; }
  bookingSeat(booking: Booking): string { return booking.sæde ? `Sæde #${booking.sædeId}` : `Sæde #${booking.sædeId}`; }

  private reloadFilms(): void { this.filmsApi.GetFilm().subscribe({ next: data => this.films = data ?? [] }); }
  private reloadShowtimes(): void { this.showtimesApi.GetSpilletider().subscribe({ next: data => this.showtimes = data ?? [] }); }
  private reloadBookings(): void { this.bookingsApi.GetBookings().subscribe({ next: data => this.bookings = data ?? [] }); }
  private emptyFilmForm(): FilmForm { return { title: '', beskrivelse: '', genre: '', varighed: 90, trailerUrl: '', billedeturl: '' }; }
  private success(message: string): void { this.message = message; this.errorMessage = ''; }
  private showError(message: string): void { this.errorMessage = message; this.message = ''; }
  private clearNotice(): void { this.message = ''; this.errorMessage = ''; }
}
