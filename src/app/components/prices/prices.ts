import { Component } from '@angular/core';

interface PriceItem {
  title: string;
  description: string;
  price: string;
  note?: string;
  featured?: boolean;
  badge?: string;
}

@Component({
  selector: 'app-prices',
  standalone: true,
  templateUrl: './prices.html',
  styleUrl: './prices.css',
})
export class Prices {


    
  ticketPrices: PriceItem[] = [
    { title: 'Voksen', description: 'Gyldig alle dage og alle forestillinger', price: '125' },
    { title: 'Børn (under 12)', description: 'Gyldig alle dage og alle forestillinger', price: '85' },
    { title: 'Senior (65+)', description: 'Gyldig alle dage', price: '95' },
    { title: 'Student', description: 'Vis gyldigt studiekort ved entréen', price: '95' },
    { title: '3D-tillæg', description: 'Tillæg til alle 3D-forestillinger', price: '25', featured: true },
    { title: 'IMAX-tillæg', description: 'Tillæg til alle IMAX-forestillinger', price: '50', featured: true },
  ];

  packages: PriceItem[] = [
    { title: 'Familiebillet', description: '2 voksne + 2 børn', price: '350', note: 'Spar 75 kr' },
    { title: 'Klippekort', description: '10 valgfri billetter', price: '950', note: 'Spar 300 kr' },
    { title: 'Årsklip', description: 'Ubegrænsede forestillinger', price: '1799', featured: true, badge: 'Bedst' },
  ];
}
