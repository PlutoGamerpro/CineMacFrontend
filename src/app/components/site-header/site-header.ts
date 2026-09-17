import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './site-header.css',
  templateUrl: './site-header.html',
})
export class SiteHeader {}