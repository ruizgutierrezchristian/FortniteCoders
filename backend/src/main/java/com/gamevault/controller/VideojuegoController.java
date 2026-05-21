package com.gamevault.controller;

import com.gamevault.model.Videojuego;
import com.gamevault.service.VideojuegoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para el recurso Videojuego.
 * Endpoints base: /api/videojuegos
 */
@RestController
@RequestMapping("/api/videojuegos")
@CrossOrigin(origins = "*")
public class VideojuegoController {

    @Autowired
    private VideojuegoService videojuegoService;

    /**
     * GET /api/videojuegos
     * Lista todos los videojuegos.
     * Parámetros opcionales: q (búsqueda), genero, desarrolladora
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String genero,
            @RequestParam(required = false) Long desarrolladora) {

        List<Videojuego> lista;

        if (q != null && !q.isBlank()) {
            lista = videojuegoService.buscar(q);
        } else if (genero != null) {
            lista = videojuegoService.findByGenero(genero);
        } else if (desarrolladora != null) {
            lista = videojuegoService.findByDesarrolladora(desarrolladora);
        } else {
            lista = videojuegoService.findAll();
        }

        return ResponseEntity.ok(lista.stream().map(this::toMap).toList());
    }

    /**
     * GET /api/videojuegos/{id}
     * Obtiene un videojuego por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        return videojuegoService.findById(id)
                .map(v -> ResponseEntity.ok(toMap(v)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/videojuegos/generos
     * Lista los géneros disponibles.
     */
    @GetMapping("/generos")
    public ResponseEntity<List<String>> getGeneros() {
        return ResponseEntity.ok(videojuegoService.getGeneros());
    }

    /**
     * POST /api/videojuegos
     * Crea un videojuego. El body debe incluir "desarrolladoraId".
     */
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Map<String, Object> body) {
        Videojuego v = fromMap(body);
        Long devId = getLong(body, "desarrolladoraId");
        if (devId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "desarrolladoraId es obligatorio"));
        }
        return videojuegoService.create(v, devId)
                .map(saved -> ResponseEntity.status(HttpStatus.CREATED).body((Object) toMap(saved)))
                .orElse(ResponseEntity.badRequest().body(Map.of("error", "Desarrolladora no encontrada")));
    }

    /**
     * PUT /api/videojuegos/{id}
     * Actualiza un videojuego existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                     @RequestBody Map<String, Object> body) {
        Videojuego v = fromMap(body);
        Long devId = getLong(body, "desarrolladoraId");
        return videojuegoService.update(id, v, devId)
                .map(saved -> ResponseEntity.ok((Object) toMap(saved)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/videojuegos/{id}
     * Elimina un videojuego por ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        if (videojuegoService.delete(id)) {
            return ResponseEntity.ok(Map.of("mensaje", "Videojuego eliminado correctamente"));
        }
        return ResponseEntity.notFound().build();
    }

    // ---- Helpers de conversión ----

    private Map<String, Object> toMap(Videojuego v) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", v.getId());
        m.put("titulo", v.getTitulo());
        m.put("genero", v.getGenero());
        m.put("anioLanzamiento", v.getAnioLanzamiento());
        m.put("puntuacion", v.getPuntuacion());
        m.put("plataformas", v.getPlataformas());
        m.put("descripcion", v.getDescripcion());
        m.put("desarrolladoraId", v.getDesarrolladoraId());
        m.put("desarrolladoraNombre", v.getDesarrolladoraNombre());
        return m;
    }

    private Videojuego fromMap(Map<String, Object> body) {
        Videojuego v = new Videojuego();
        v.setTitulo(getString(body, "titulo"));
        v.setGenero(getString(body, "genero"));
        v.setAnioLanzamiento(getInt(body, "anioLanzamiento"));
        v.setPuntuacion(getDouble(body, "puntuacion"));
        v.setPlataformas(getString(body, "plataformas"));
        v.setDescripcion(getString(body, "descripcion"));
        return v;
    }

    private String getString(Map<String, Object> m, String key) {
        Object val = m.get(key);
        return val != null ? val.toString() : null;
    }

    private Integer getInt(Map<String, Object> m, String key) {
        Object val = m.get(key);
        if (val == null) return null;
        if (val instanceof Integer i) return i;
        try { return Integer.parseInt(val.toString()); } catch (Exception e) { return null; }
    }

    private Double getDouble(Map<String, Object> m, String key) {
        Object val = m.get(key);
        if (val == null) return null;
        if (val instanceof Double d) return d;
        if (val instanceof Number n) return n.doubleValue();
        try { return Double.parseDouble(val.toString()); } catch (Exception e) { return null; }
    }

    private Long getLong(Map<String, Object> m, String key) {
        Object val = m.get(key);
        if (val == null) return null;
        if (val instanceof Long l) return l;
        if (val instanceof Integer i) return i.longValue();
        if (val instanceof Number n) return n.longValue();
        try { return Long.parseLong(val.toString()); } catch (Exception e) { return null; }
    }
}
