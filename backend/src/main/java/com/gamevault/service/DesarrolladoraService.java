package com.gamevault.service;

import com.gamevault.model.Desarrolladora;
import com.gamevault.repository.DesarrolladoraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para la lógica de negocio de Desarrolladora.
 */
@Service
@Transactional
public class DesarrolladoraService {

    @Autowired
    private DesarrolladoraRepository desarrolladoraRepository;

    /** Obtiene todas las desarrolladoras. */
    @Transactional(readOnly = true)
    public List<Desarrolladora> findAll() {
        return desarrolladoraRepository.findAllWithVideojuegos();
    }

    /** Busca una desarrolladora por ID. */
    @Transactional(readOnly = true)
    public Optional<Desarrolladora> findById(Long id) {
        return desarrolladoraRepository.findById(id);
    }

    /** Guarda o actualiza una desarrolladora. */
    public Desarrolladora save(Desarrolladora desarrolladora) {
        return desarrolladoraRepository.save(desarrolladora);
    }

    /** Actualiza una desarrolladora existente. */
    public Optional<Desarrolladora> update(Long id, Desarrolladora datos) {
        return desarrolladoraRepository.findById(id).map(d -> {
            d.setNombre(datos.getNombre());
            d.setPais(datos.getPais());
            d.setAnioFundacion(datos.getAnioFundacion());
            d.setDescripcion(datos.getDescripcion());
            return desarrolladoraRepository.save(d);
        });
    }

    /** Elimina una desarrolladora por ID. */
    public boolean delete(Long id) {
        if (desarrolladoraRepository.existsById(id)) {
            desarrolladoraRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /** Busca por nombre (contiene). */
    @Transactional(readOnly = true)
    public List<Desarrolladora> buscarPorNombre(String nombre) {
        return desarrolladoraRepository.findByNombreContainingIgnoreCase(nombre);
    }

    /** Busca por país. */
    @Transactional(readOnly = true)
    public List<Desarrolladora> findByPais(String pais) {
        return desarrolladoraRepository.findByPaisIgnoreCase(pais);
    }
}
