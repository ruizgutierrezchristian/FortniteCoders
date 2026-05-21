package com.gamevault.repository;

import com.gamevault.model.Videojuego;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VideojuegoRepository extends JpaRepository<Videojuego, Long> {

    @Query("SELECT v FROM Videojuego v WHERE v.desarrolladora.id = :id")
    List<Videojuego> findByDesarrolladoraId(@Param("id") Long id);

    List<Videojuego> findByGeneroIgnoreCase(String genero);

    List<Videojuego> findByTituloContainingIgnoreCase(String texto);

    List<Videojuego> findByAnioLanzamiento(Integer anio);

    List<Videojuego> findByPuntuacionGreaterThanEqual(Double puntuacion);

    List<Videojuego> findAllByOrderByPuntuacionDesc();

    @Query("SELECT DISTINCT v.genero FROM Videojuego v WHERE v.genero IS NOT NULL ORDER BY v.genero")
    List<String> findDistinctGeneros();

    @Query("SELECT v FROM Videojuego v WHERE " +
           "LOWER(v.titulo) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(v.genero) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Videojuego> buscarPorTexto(@Param("q") String query);
}
