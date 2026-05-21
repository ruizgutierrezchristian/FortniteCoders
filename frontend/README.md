# GameVault — Frontend Angular 21

Biblioteca de videojuegos desarrollada como proyecto final FP Dual.

## Tecnologías utilizadas

- **Frontend:** Angular 21 (Standalone Components)
- **Backend:** Spring Boot + H2 (en memoria)
- **Relación 1:N:** Desarrolladora → Videojuegos

---

## Estructura del proyecto

```
gamevault-angular/           ← Este repositorio (frontend Angular)
backend/                     ← Backend Spring Boot (carpeta original)

src/
└── app/
    ├── app.component.ts         # Componente raíz (Standalone)
    ├── app.config.ts            # Configuración de la app (providers)
    ├── app.routes.ts            # Rutas lazy-loaded
    ├── core/
    │   ├── models/
    │   │   ├── videojuego.model.ts
    │   │   └── desarrolladora.model.ts
    │   └── services/
    │       ├── videojuego.service.ts     ← Observables + HttpClient
    │       ├── desarrolladora.service.ts ← Observables + HttpClient
    │       └── toast.service.ts          ← Signal para notificaciones
    ├── pages/
    │   ├── home/           ← Página de inicio con estadísticas
    │   ├── games/          ← CRUD videojuegos + filtros reactivos
    │   └── developers/     ← CRUD desarrolladoras + búsqueda
    └── shared/components/
        ├── navbar/         ← Barra de navegación con RouterLink
        ├── toast/          ← Notificaciones (Signal)
        ├── modal-game/     ← Formulario reactivo videojuego
        └── modal-developer/← Formulario reactivo desarrolladora
```

---

## Requisitos cumplidos del enunciado

| Requisito                        | Implementación                                                     |
|----------------------------------|--------------------------------------------------------------------|
| ✅ Componentes StandAlone         | Todos los componentes usan `standalone: true`                     |
| ✅ Signals                        | `signal()`, `computed()` en todos los componentes y ToastService  |
| ✅ Formularios reactivos          | `ReactiveFormsModule` + `FormBuilder` en modales y filtros        |
| ✅ Llamadas a API REST            | `VideojuegoService` y `DesarrolladoraService` con `HttpClient`    |
| ✅ Observables en servicios       | Todos los métodos devuelven `Observable<T>`                       |
| ✅ Navegación / Rutas             | `app.routes.ts` con lazy loading, `RouterLink`, `RouterLinkActive`|

---

## Cómo ejecutar

### 1. Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

La API queda disponible en `http://localhost:8080/api`

### 2. Frontend (Angular 21)

Instalar dependencias:

```bash
cd gamevault-angular
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm start
# o
ng serve
```

Abrir en el navegador: `http://localhost:4200`

---

## Endpoints de la API (backend)

**Videojuegos:**
- `GET    /api/videojuegos`           — Listar todos
- `GET    /api/videojuegos/:id`       — Ver detalle
- `GET    /api/videojuegos/generos`   — Listar géneros disponibles
- `POST   /api/videojuegos`           — Crear nuevo
- `PUT    /api/videojuegos/:id`       — Actualizar
- `DELETE /api/videojuegos/:id`       — Eliminar

**Desarrolladoras:**
- `GET    /api/desarrolladoras`       — Listar todas (incluye videojuegos)
- `GET    /api/desarrolladoras/:id`   — Ver detalle
- `POST   /api/desarrolladoras`       — Crear nueva
- `PUT    /api/desarrolladoras/:id`   — Actualizar
- `DELETE /api/desarrolladoras/:id`   — Eliminar (en cascada)

---

## Datos de prueba precargados

El backend carga automáticamente al arrancar:
- **5 desarrolladoras:** Nintendo, Naughty Dog, CD Projekt RED, FromSoftware, Rockstar Games
- **13 videojuegos:** Zelda BotW, The Witcher 3, Elden Ring, RDR2, The Last of Us...

---

## Problemas encontrados durante el desarrollo

- **CORS:** El backend ya incluye `@CrossOrigin(origins = "*")` en los controllers, no es necesaria configuración adicional en Angular.
- **Serialización JSON:** El backend usa `@JsonManagedReference` / `@JsonBackReference` para evitar referencias circulares en la relación 1:N. El controller de Videojuego serializa manualmente (`toMap`) para incluir `desarrolladoraId` y `desarrolladoraNombre`.
- **`computed()` con formularios reactivos:** Los `computed()` signals de Angular no detectan automáticamente cambios en `FormGroup`. Se solucionó suscribiendo a `filterForm.valueChanges` para forzar la redetección.
- **Angular 21 standalone:** Con `standalone: true` no existe `AppModule`. Toda la configuración va en `app.config.ts` con `provideRouter()` y `provideHttpClient()`.
