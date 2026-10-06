import { Component, OnInit, signal } from '@angular/core';
import { Lesson, LessonService } from '../services/lesson';

@Component({
  selector: 'app-lessons',
  imports: [],
  templateUrl: './lessons.html',
  styleUrl: './lessons.css'
})
export class Lessons implements OnInit {

  lessons = signal<Lesson[]>([]);

  constructor(private lessonService: LessonService) {}

  ngOnInit(): void {
    this.lessonService.getLessons().subscribe({
      next: (data) => {
        console.log('API DATA:', data);
        this.lessons.set(data);
      },
      error: (error) => {
        console.error('API ERROR:', error);
      }
    });
  }
}