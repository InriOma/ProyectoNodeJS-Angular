import { Component, signal } from '@angular/core';
@Component({
  template: `<p class="eyebrow">02 · Vista declarativa</p>
    <h1>Plantillas, bindings y control flow</h1>
    <p class="lead">
      Eventos con <code>(evento)</code>, propiedades con <code>[propiedad]</code> e interpolación
      con llaves dobles.
    </p>
    <section class="lab">
      <label for="task">Nueva tarea</label>
      <div class="input-row">
        <input
          id="task"
          #taskInput
          (keyup.enter)="add(taskInput.value); taskInput.value = ''"
          placeholder="Ej. Repasar routing"
        /><button type="button" (click)="add(taskInput.value); taskInput.value = ''">
          Agregar
        </button>
      </div>
      @if (tasks().length) {
        <ul>
          @for (task of tasks(); track task) {
            <li>
              {{ task }}
              <button type="button" (click)="remove(task)" [attr.aria-label]="'Eliminar ' + task">
                Eliminar
              </button>
            </li>
          }
        </ul>
      } @else {
        <p class="empty">Sin tareas. Añade una para activar el &#64;for.</p>
      }
    </section>`,
})
export class Templates {
  protected readonly tasks = signal(['Leer la guía de componentes', 'Practicar signals']);
  protected add(value: string): void {
    const task = value.trim();
    if (task) this.tasks.update((tasks) => [...tasks, task]);
  }
  protected remove(task: string): void {
    this.tasks.update((tasks) => tasks.filter((item) => item !== task));
  }
}
