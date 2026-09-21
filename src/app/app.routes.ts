import { Routes } from '@angular/router';
import { About } from './components/about/about';
import { Facilities } from './components/facilities/facilities';
import { Home } from './components/home/home';
import { FilmList } from './components/film-list/film-list';
import { Showtimes } from './components/showtimes/showtimes';
import { Prices } from './components/prices/prices';


export const routes: Routes = [
	{ path: '', component: Home },
	{ path: 'film', component: FilmList },
	{ path: 'about', component: About },
	{ path: 'facilities', component: Facilities },
	{ path: 'showtimes', component: Showtimes },
	{ path: 'prices', component: Prices },
	{ path: '**', redirectTo: '' },
	{path: 'film/:id', component: FilmList}
];
