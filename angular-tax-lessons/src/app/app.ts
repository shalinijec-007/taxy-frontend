import { Component } from '@angular/core';
import { Lessons } from './lessons/lessons';

@Component({
  selector: 'app-root',
  imports: [Lessons],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}