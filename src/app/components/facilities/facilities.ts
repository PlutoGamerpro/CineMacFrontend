import { Component } from '@angular/core';
import { CINEMA_IMAGES } from '../../images';

@Component({
  selector: 'app-facilities',
  standalone: true,
  templateUrl: './facilities.html',
  styleUrl: './facilities.css',
})
export class Facilities {
   readonly cinemaImages = CINEMA_IMAGES;
}
