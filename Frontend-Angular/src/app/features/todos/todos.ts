import { Component, inject, signal } from '@angular/core';
import { Todo, TodoApiService } from './todo-api.service';

@Component({
  template: `
    <p class="eyebrow">05 · Comunicación asíncrona</p>
    <h1>TODO List con Express y MariaDB</h1>
    <p class="lead">
      Este ejemplo usa <code>HttpClient</code>, la solución HTTP nativa de Angular y equivalente a
      Axios.
    </p>
    <section class="lab">
      <h1>Agregar Tarea</h1>
      <form class="input-row" (submit)="create(input.value, $event)">
        <input #input aria-label="Nueva tarea" placeholder="Ej. Probar POST /api/todos" />
        <button type="submit">Crear tarea</button>
      </form>
      <p>Hay {{ todos().length }} tareas en total.</p>
      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }
      @if (loading()) {
        <p>Cargando tareas…</p>
      } @else if (!todos().length) {
        <p class="empty">No hay tareas.</p>
      } @else {
        <ul>
          @for (todo of todos(); track todo.id) {
            <li>
              <label>
                <input type="checkbox" [checked]="todo.completed" (change)="toggle(todo)" />
                <span [class.done]="todo.completed">{{ todo.title }}</span>
              </label>
              <button type="button" (click)="remove(todo.id)">Eliminar</button>
            </li>
          }
        </ul>
      }
    </section>
    <section class="comparison">
      <h2>Equivalencia con Axios</h2>
      <p>
        <code>axios.get(url).then(...)</code> equivale, conceptualmente, a
        <code>http.get&lt;Todo[]&gt;(url).subscribe(...)</code>. HttpClient devuelve Observables con
        buen tipado, interceptores y soporte de testing.
      </p>
    </section>
  `,
  styles: `
    li label {
      align-items: center;
      display: flex;
      flex: 1 1 0;
      gap: 0.65rem;
      min-width: 0;
    }
    li label input[type='checkbox'] {
      flex: 0 0 auto;
      padding: 0;
      width: 1rem;
    }
    li label span {
      overflow-wrap: anywhere;
    }
    .done {
      color: #64748b;
      text-decoration: line-through;
    }
  `,
})
export class Todos {
  private readonly api = inject(TodoApiService);
  protected readonly todos = signal<Todo[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  constructor() {
    this.load();
  }

  protected create(title: string, event: SubmitEvent): void {
    event.preventDefault();
    const value = title.trim();
    if (!value) return;
    this.api.create(value).subscribe({
      next: (todo) => this.todos.update((items) => [todo, ...items]),
      error: () => this.fail('No se pudo crear la tarea. Confirma que Docker está iniciado.'),
    });
  }

  protected toggle(todo: Todo): void {
    this.api.toggle(todo).subscribe({
      next: (updated) =>
        this.todos.update((items) =>
          items.map((item) => (item.id === updated.id ? updated : item)),
        ),
      error: () => this.fail('No se pudo actualizar la tarea.'),
    });
  }
  protected remove(id: number): void {
    this.api.remove(id).subscribe({
      next: () => this.todos.update((items) => items.filter((todo) => todo.id !== id)),
      error: () => this.fail('No se pudo eliminar la tarea.'),
    });
  }
  private load(): void {
    this.api.list().subscribe({
      next: (todos) => {
        this.todos.set(todos);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.fail('No se pudo conectar con la API. Ejecuta docker compose up --build.');
      },
    });
  }
  private fail(message: string): void {
    this.error.set(message);
  }
}
