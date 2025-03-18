import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.interface';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
})
export class TaskDetailsComponent implements OnInit {
  task: Task | undefined;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.taskService.getTaskById(Number(id)).subscribe(
      (task) => {
        this.task = task;
      },
      (error) => {
        console.error('Error fetching task:', error);
        this.router.navigate(['/tasks']);
      }
    );
  }

  editTask(): void {
    if (this.task) {
      this.router.navigate(['/tasks', this.task.id, 'edit']);
    }
  }

  deleteTask(): void {
    if (this.task && confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(this.task.id).subscribe(
        () => {
          this.router.navigate(['/tasks']);
        },
        (error) => {
          console.error('Error deleting task:', error);
        }
      );
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}
