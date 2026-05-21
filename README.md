# GameVault — Proyecto FP Dual

Aplicación web full stack para gestionar una biblioteca de videojuegos.

## Estructura del proyecto

```
GameVault/
├── frontend/   → Angular 21 (Standalone Components, Signals, Formularios Reactivos)
└── backend/    → Spring Boot + H2 en memoria
```

## Cómo ejecutar

### Backend

```bash
cd backend
mvn spring-boot:run
```

API disponible en `http://localhost:8080/api`

### Frontend

```bash
cd frontend
npm install
npm start
```

App disponible en `http://localhost:4200`

## Modelo de datos (relación 1:N)

- **Desarrolladora** tiene muchos **Videojuegos**
- Una desarrolladora: nombre, país, año fundación, descripción
- Un videojuego: título, género, año, puntuación, plataformas, descripción, desarrolladoraId
