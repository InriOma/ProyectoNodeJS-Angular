import { Component, computed, inject, signal } from '@angular/core';
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
        <input #input placeholder="Ej. Probar POST /api/todos" />
        <button type="submit">Crear tarea</button>
      </form>

      <!-- Tabs -->
      <div class="tabs">
        <button [class.active]="activeTab() === 'all'" (click)="activeTab.set('all')">
          Todas ({{ todos().length }})
        </button>
        <button [class.active]="activeTab() === 'pending'" (click)="activeTab.set('pending')">
          Pendientes ({{ pendingCount() }})
        </button>
        <button [class.active]="activeTab() === 'completed'" (click)="activeTab.set('completed')">
          Completadas ({{ completedCount() }})
        </button>
      </div>

      <!-- Estados -->
      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
      @if (loading()) {
        <p>Cargando tareas…</p>
      } @else if (!filteredTodos().length) {
        <p class="empty">
          @if (activeTab() === 'pending') {
            No hay tareas pendientes.
          } @else if (activeTab() === 'completed') {
            No hay tareas completadas.
          } @else {
            No hay tareas.
          }
        </p>
      } @else {
        <!-- Usa filteredTodos() en vez de todos() -->
        <ul>
          @for (todo of filteredTodos(); track todo.id) {
            <li>
              <label>
                <input type="checkbox" [checked]="todo.completed" (change)="toggle(todo)" />
                <span [class.done]="todo.completed">{{ todo.title }}</span>
              </label>
              <button (click)="remove(todo.id)">Eliminar</button>
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
    .tabs {
      display: flex;
      gap: 0.5rem;
      border-bottom: 2px solid #e2e8f0;
      margin: 1rem 0;
    }
    .tabs button {
      padding: 0.5rem 1rem;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      color: #64748b;
      font-size: 0.9rem;
    }
    .tabs button:hover {
      color: #3b82f6;
    }
    .tabs button.active {
      color: #3b82f6;
      border-bottom-color: #3b82f6;
      font-weight: 600;
    }
    .empty {
      text-align: center;
      padding: 2rem;
      color: #94a3b8;
      font-style: italic;
    }
    .error {
      color: #ef4444;
      padding: 1rem;
      background: #fef2f2;
      border-radius: 0.5rem;
    }
  `,
})
export class Todos {
  private readonly api = inject(TodoApiService);
  protected readonly todos = signal<Todo[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  // Estado del tab activo
  protected readonly activeTab = signal<'all' | 'pending' | 'completed'>('all');

  // Tareas filtradas según el tab (computed reactivo)
  protected readonly filteredTodos = computed(() => {
    const tab = this.activeTab();
    if (tab === 'pending') return this.todos().filter((t) => !t.completed);
    if (tab === 'completed') return this.todos().filter((t) => t.completed);
    return this.todos();
  });

  // Contadores para los tabs
  protected readonly pendingCount = computed(() => this.todos().filter((t) => !t.completed).length);

  protected readonly completedCount = computed(
    () => this.todos().filter((t) => t.completed).length,
  );

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
