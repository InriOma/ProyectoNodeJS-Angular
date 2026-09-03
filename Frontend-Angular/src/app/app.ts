import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({ imports: [RouterOutlet, RouterLink, RouterLinkActive], selector: 'app-root', styleUrl: './app.css', templateUrl: './app.html' })
export class App {
  protected readonly menuOpen = signal(false);
  protected closeMenu(): void { this.menuOpen.set(false); }
}
