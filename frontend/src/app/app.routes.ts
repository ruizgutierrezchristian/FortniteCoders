// src/app/app.routes.ts

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'videojuegos',
    loadComponent: () => import('./pages/games/games.component').then(m => m.GamesComponent)
  },
  {
    path: 'desarrolladoras',
    loadComponent: () => import('./pages/developers/developers.component').then(m => m.DevelopersComponent)
  },
  { path: '**', redirectTo: '' }
];
