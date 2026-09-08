import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

@Service()
export class TodoApiService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/api/todos';

  list(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.url);
  }
  create(title: string): Observable<Todo> {
    return this.http.post<Todo>(this.url, { title });
  }
  toggle(todo: Todo): Observable<Todo> {
    return this.http.patch<Todo>(`${this.url}/${todo.id}`, { completed: !todo.completed });
  }
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
