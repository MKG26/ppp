import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Task } from '../models/task.interface';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const tasks: Task[] = [
      {
        id: 1,
        title: 'Learn Angular',
        description:
          'Study Angular fundamentals and build a sample application',
        status: 'In Progress',
        createdAt: new Date('2024-03-18T10:00:00'),
      },
      {
        id: 2,
        title: 'Complete Project Documentation',
        description:
          'Write comprehensive documentation for the current project',
        status: 'To Do',
        createdAt: new Date('2024-03-18T11:00:00'),
      },
      {
        id: 3,
        title: 'Fix Bug Reports',
        description: 'Address reported issues in the tracking system',
        status: 'Done',
        createdAt: new Date('2024-03-18T09:00:00'),
      },
    ];
    return { tasks };
  }

  // Overrides the genId method to ensure that a task always has an id
  genId(tasks: Task[]): number {
    return tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
  }
}
