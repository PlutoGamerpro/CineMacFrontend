import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Showtimes } from './showtimes';

describe('Showtimes', () => {
  let component: Showtimes;
  let fixture: ComponentFixture<Showtimes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showtimes],
    }).compileComponents();

    fixture = TestBed.createComponent(Showtimes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
