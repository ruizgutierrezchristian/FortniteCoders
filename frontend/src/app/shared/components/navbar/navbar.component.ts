// src/app/shared/components/navbar/navbar.component.ts

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header>
      <div class="header-inner">
        <a class="logo" routerLink="/">GAMEVAULT <span>biblioteca</span></a>
        <nav>
          <a class="nav-btn" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Inicio</a>
          <a class="nav-btn" routerLink="/videojuegos" routerLinkActive="active">Videojuegos</a>
          <a class="nav-btn" routerLink="/desarrolladoras" routerLinkActive="active">Desarrolladoras</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(10,10,15,.9);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
    }
    .header-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 22px;
      letter-spacing: 2px;
      color: var(--text);
      text-decoration: none;
    }
    .logo span {
      font-size: 14px;
      color: var(--accent2);
      letter-spacing: 3px;
      margin-left: 4px;
    }
    nav { display: flex; gap: 4px; }
    .nav-btn {
      padding: 8px 16px;
      border-radius: 8px;
      color: var(--muted);
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: all .2s;
    }
    .nav-btn:hover { color: var(--text); background: var(--card); }
    .nav-btn.active { color: var(--accent2); background: rgba(124,58,237,.12); }
  `]
})
export class NavbarComponent {}
