import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Buttontest } from './buttontest';

describe('Buttontest', () => {
  let component: Buttontest;
  let fixture: ComponentFixture<Buttontest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Buttontest],
    }).compileComponents();

    fixture = TestBed.createComponent(Buttontest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
