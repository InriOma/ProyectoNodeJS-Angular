import { Service, signal } from '@angular/core';

@Service()
export class StudyNotesService {
  readonly notes = signal(['Las dependencias se piden con inject().']);

  add(note: string): void {
    this.notes.update(notes => [...notes, note]);
  }
}
