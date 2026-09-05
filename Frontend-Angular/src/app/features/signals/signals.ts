import { Component, computed, signal } from '@angular/core';
@Component({
  template: `<p class="eyebrow">01 · Estado local</p>
    <h1>Signals: estado que Angular rastrea</h1>
    <p class="lead">
      Como <code>useState</code>, pero se lee llamando a la señal y se actualiza con
      <code>set</code> o <code>update</code>.
    </p>
    <section class="lab">
      <h2>Contador reactivo</h2>
      <p class="number" aria-live="polite">{{ count() }}</p>
      <div class="actions">
        <button type="button" (click)="count.update((value) => value - 1)">−1</button
        ><button type="button" (click)="count.set(0)">Reiniciar</button
        ><button type="button" (click)="count.update((value) => value + 1)">+1</button>
      </div>
      <p>Estado derivado con <code>computed()</code>: {{ parity() }}.</p>
    </section>
    <section class="comparison">
      <h2>Comparación rápida</h2>
      <p><strong>React:</strong> <code>const [count, setCount] = useState(0)</code></p>
      <p><strong>Vue:</strong> <code>const count = ref(0)</code></p>
      <p>
        <strong>Angular:</strong> <code>const count = signal(0)</code>; lectura:
        <code>count()</code>.
      </p>
    </section>`,
})
export class Signals {
  protected readonly count = signal(0);
  protected readonly parity = computed(() => (this.count() % 2 === 0 ? 'es par' : 'es impar'));
}
