import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { FilmList } from './components/film-list/film-list';
import { Showtimes } from './components/showtimes/showtimes';

export const routes: Routes = [
	{ path: '', component: Home },
	{ path: 'film', component: FilmList },
	{ path: 'showtimes', component: Showtimes },
	{ path: '**', redirectTo: '' },
];
