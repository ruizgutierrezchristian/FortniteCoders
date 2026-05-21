package com.gamevault.controller;

import com.gamevault.model.Desarrolladora;
import com.gamevault.service.DesarrolladoraService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para el recurso Desarrolladora.
 * Endpoints base: /api/desarrolladoras
 */
@RestController
@RequestMapping("/api/desarrolladoras")
@CrossOrigin(origins = "*")
public class DesarrolladoraController {

    @Autowired
    private DesarrolladoraService desarrolladoraService;

    /**
     * GET /api/desarrolladoras
     * Lista todas las desarrolladoras (con sus videojuegos).
     */
    @GetMapping
    public ResponseEntity<List<Desarrolladora>> getAll(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String pais) {

        if (nombre != null) {
            return ResponseEntity.ok(desarrolladoraService.buscarPorNombre(nombre));
        }
        if (pais != null) {
            return ResponseEntity.ok(desarrolladoraService.findByPais(pais));
        }
        return ResponseEntity.ok(desarrolladoraService.findAll());
    }

    /**
     * GET /api/desarrolladoras/{id}
     * Obtiene una desarrolladora por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Desarrolladora> getById(@PathVariable Long id) {
        return desarrolladoraService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/desarrolladoras
     * Crea una nueva desarrolladora.
     */
    @PostMapping
    public ResponseEntity<Desarrolladora> create(@Valid @RequestBody Desarrolladora desarrolladora) {
        Desarrolladora creada = desarrolladoraService.save(desarrolladora);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    /**
     * PUT /api/desarrolladoras/{id}
     * Actualiza una desarrolladora existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Desarrolladora> update(@PathVariable Long id,
                                                  @Valid @RequestBody Desarrolladora datos) {
        return desarrolladoraService.update(id, datos)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/desarrolladoras/{id}
     * Elimina una desarrolladora (y sus videojuegos en cascada).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        if (desarrolladoraService.delete(id)) {
            return ResponseEntity.ok(Map.of("mensaje", "Desarrolladora eliminada correctamente"));
        }
        return ResponseEntity.notFound().build();
    }
}
