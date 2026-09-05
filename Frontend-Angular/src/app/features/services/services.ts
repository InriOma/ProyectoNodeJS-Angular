import { Component, inject } from '@angular/core';
import { StudyNotesService } from './study-notes.service';
@Component({
  template: `<p class="eyebrow">04 · Arquitectura</p>
    <h1>Servicios e inyección de dependencias</h1>
    <p class="lead">
      Un servicio concentra una responsabilidad y Angular lo proporciona donde se necesita. No hace
      falta pasar props por varios niveles.
    </p>
    <section class="lab">
      <h2>Notas compartidas</h2>
      <div class="input-row">
        <input
          #note
          placeholder="Ej. Router usa rutas declarativas"
          (keyup.enter)="add(note.value); note.value = ''"
        /><button type="button" (click)="add(note.value); note.value = ''">Guardar nota</button>
      </div>
      <ul>
        @for (note of notes.notes(); track note) {
          <li>{{ note }}</li>
        }
      </ul>
    </section>
    <p class="comparison">
      <strong>React:</strong> context, hooks o una librería de estado.
      <strong>Vue:</strong> composables/Pinia. <strong>Angular:</strong> clase de servicio +
      <code>inject(StudyNotesService)</code>.
    </p>`,
})
export class Services {
  protected readonly notes = inject(StudyNotesService);
  protected add(value: string): void {
    const note = value.trim();
    if (note) this.notes.add(note);
  }
}
