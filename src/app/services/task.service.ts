import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Task } from '../models/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksUrl = 'api/tasks'; // URL to web api
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.http.get<Task[]>(this.tasksUrl).subscribe((tasks) => {
      this.tasksSubject.next(tasks);
    });
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  getTaskById(id: number): Observable<Task> {
    const url = `${this.tasksUrl}/${id}`;
    return this.http.get<Task>(url);
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): Observable<Task> {
    const newTask = {
      ...task,
      createdAt: new Date(),
    };
    return this.http.post<Task>(this.tasksUrl, newTask, this.httpOptions).pipe(
      tap((task: Task) => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next([...currentTasks, task]);
      })
    );
  }

  updateTask(task: Task): Observable<any> {
    return this.http.put(this.tasksUrl, task, this.httpOptions).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.value;
        const index = currentTasks.findIndex((t) => t.id === task.id);
        if (index !== -1) {
          currentTasks[index] = task;
          this.tasksSubject.next([...currentTasks]);
        }
      })
    );
  }

  deleteTask(id: number): Observable<Task> {
    const url = `${this.tasksUrl}/${id}`;
    return this.http.delete<Task>(url, this.httpOptions).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next(currentTasks.filter((task) => task.id !== id));
      })
    );
  }
}
