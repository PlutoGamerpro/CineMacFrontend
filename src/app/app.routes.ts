import { Routes } from '@angular/router';
import { About } from './components/about/about';
import { Facilities } from './components/facilities/facilities';
import { Home } from './components/home/home';
import { FilmList } from './components/film-list/film-list';
import { Showtimes } from './components/showtimes/showtimes';
import { Prices } from './components/prices/prices';

import { booking } from './components/booking/booking';
import { FilmDetail } from './components/film-detail/film-detail';
import { Admin } from './components/admin/admin';

export const routes: Routes = [
	{ path: '', component: Home },
	{ path: 'film', component: FilmList },
	{ path: 'about', component: About },
	{ path: 'facilities', component: Facilities },
	{ path: 'booking/:id', component: booking },
	{ path: 'showtimes', component: Showtimes },
	{ path: 'prices', component: Prices },
	{path: 'films/:id', component: FilmDetail},
	
	{path: 'admin', component: Admin},
	{ path: '**', redirectTo: '' },
	
];
