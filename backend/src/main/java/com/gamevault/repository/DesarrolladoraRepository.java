package com.gamevault.repository;

import com.gamevault.model.Desarrolladora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA para la entidad Desarrolladora.
 * Spring Data genera automáticamente las implementaciones de los métodos.
 */
@Repository
public interface DesarrolladoraRepository extends JpaRepository<Desarrolladora, Long> {

    // Buscar por nombre (exacto, ignorando mayúsculas)
    Optional<Desarrolladora> findByNombreIgnoreCase(String nombre);

    // Buscar por país
    List<Desarrolladora> findByPaisIgnoreCase(String pais);

    // Buscar por año de fundación
    List<Desarrolladora> findByAnioFundacion(Integer anioFundacion);

    // Buscar desarrolladoras fundadas desde un año en adelante
    List<Desarrolladora> findByAnioFundacionGreaterThanEqual(Integer anio);

    // Buscar por nombre que contenga un texto (LIKE %texto%)
    List<Desarrolladora> findByNombreContainingIgnoreCase(String texto);

    // Contar cuántos juegos tiene cada desarrolladora
    @Query("SELECT d FROM Desarrolladora d LEFT JOIN FETCH d.videojuegos")
    List<Desarrolladora> findAllWithVideojuegos();
}
