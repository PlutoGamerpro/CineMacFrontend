import { Component } from '@angular/core';
import { CINEMA_IMAGES } from '../../images';



@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
      readonly cinemaImages = CINEMA_IMAGES;
}
