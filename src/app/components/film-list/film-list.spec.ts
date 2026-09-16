import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilmList } from './film-list';

describe('FilmList', () => {
  let component: FilmList;
  let fixture: ComponentFixture<FilmList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmList],
    }).compileComponents();

    fixture = TestBed.createComponent(FilmList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
