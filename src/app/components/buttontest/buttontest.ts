// buttontest.ts
import { Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Required for [(ngModel)]

@Component({
  selector: 'app-buttontest',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './buttontest.html',
  styleUrl: './buttontest.css',
})
export class Buttontest {
  // Input labels passed into the component
  text = input<string>('Save Data');
  ageLabel = input<string>('Enter age');

  // Local signals to store what the user types
  userAge = signal<string>('');
  savedAge = signal<string | null>(null);

  // Method triggered when the user clicks the button
  saveInfo(): void {
    // Read the value from userAge signal using userAge() and store it
    this.savedAge.set(this.userAge());
    console.log('Saved Age:', this.savedAge());
  }
}