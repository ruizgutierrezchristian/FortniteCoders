package com.gamevault.service;

import com.gamevault.model.Videojuego;
import com.gamevault.model.Desarrolladora;
import com.gamevault.repository.VideojuegoRepository;
import com.gamevault.repository.DesarrolladoraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para la lógica de negocio de Videojuego.
 */
@Service
@Transactional
public class VideojuegoService {

    @Autowired
    private VideojuegoRepository videojuegoRepository;

    @Autowired
    private DesarrolladoraRepository desarrolladoraRepository;

    /** Obtiene todos los videojuegos. */
    @Transactional(readOnly = true)
    public List<Videojuego> findAll() {
        return videojuegoRepository.findAllByOrderByPuntuacionDesc();
    }

    /** Busca un videojuego por ID. */
    @Transactional(readOnly = true)
    public Optional<Videojuego> findById(Long id) {
        return videojuegoRepository.findById(id);
    }

    /** Crea un nuevo videojuego asociado a una desarrolladora. */
    public Optional<Videojuego> create(Videojuego videojuego, Long desarrolladoraId) {
        return desarrolladoraRepository.findById(desarrolladoraId).map(dev -> {
            videojuego.setDesarrolladora(dev);
            return videojuegoRepository.save(videojuego);
        });
    }

    /** Actualiza un videojuego existente. */
    public Optional<Videojuego> update(Long id, Videojuego datos, Long desarrolladoraId) {
        return videojuegoRepository.findById(id).map(v -> {
            v.setTitulo(datos.getTitulo());
            v.setGenero(datos.getGenero());
            v.setAnioLanzamiento(datos.getAnioLanzamiento());
            v.setPuntuacion(datos.getPuntuacion());
            v.setPlataformas(datos.getPlataformas());
            v.setDescripcion(datos.getDescripcion());

            if (desarrolladoraId != null) {
                desarrolladoraRepository.findById(desarrolladoraId)
                    .ifPresent(v::setDesarrolladora);
            }
            return videojuegoRepository.save(v);
        });
    }

    /** Elimina un videojuego por ID. */
    public boolean delete(Long id) {
        if (videojuegoRepository.existsById(id)) {
            videojuegoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /** Busca videojuegos de una desarrolladora específica. */
    @Transactional(readOnly = true)
    public List<Videojuego> findByDesarrolladora(Long desarrolladoraId) {
        return videojuegoRepository.findByDesarrolladoraId(desarrolladoraId);
    }

    /** Busca por texto en título o género. */
    @Transactional(readOnly = true)
    public List<Videojuego> buscar(String query) {
        return videojuegoRepository.buscarPorTexto(query);
    }

    /** Busca por género. */
    @Transactional(readOnly = true)
    public List<Videojuego> findByGenero(String genero) {
        return videojuegoRepository.findByGeneroIgnoreCase(genero);
    }

    /** Lista los géneros distintos. */
    @Transactional(readOnly = true)
    public List<String> getGeneros() {
        return videojuegoRepository.findDistinctGeneros();
    }
}
