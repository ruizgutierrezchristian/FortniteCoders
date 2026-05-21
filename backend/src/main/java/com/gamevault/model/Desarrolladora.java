package com.gamevault.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad Desarrolladora.
 * Relación 1:N con Videojuego (una desarrolladora tiene muchos videojuegos).
 */
@Entity
@Table(name = "desarrolladoras")
public class Desarrolladora {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    @Column(nullable = false, unique = true, length = 100)
    private String nombre;

    @Size(max = 50)
    @Column(length = 50)
    private String pais;

    @Column(name = "anio_fundacion")
    private Integer anioFundacion;

    @Size(max = 255)
    private String descripcion;

    // Relación 1:N — una desarrolladora tiene muchos videojuegos
    @OneToMany(mappedBy = "desarrolladora", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Videojuego> videojuegos = new ArrayList<>();

    // ---- Constructores ----

    public Desarrolladora() {}

    public Desarrolladora(String nombre, String pais, Integer anioFundacion, String descripcion) {
        this.nombre = nombre;
        this.pais = pais;
        this.anioFundacion = anioFundacion;
        this.descripcion = descripcion;
    }

    // ---- Getters y Setters ----

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getPais() { return pais; }
    public void setPais(String pais) { this.pais = pais; }

    public Integer getAnioFundacion() { return anioFundacion; }
    public void setAnioFundacion(Integer anioFundacion) { this.anioFundacion = anioFundacion; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public List<Videojuego> getVideojuegos() { return videojuegos; }
    public void setVideojuegos(List<Videojuego> videojuegos) { this.videojuegos = videojuegos; }

    @Override
    public String toString() {
        return "Desarrolladora{id=" + id + ", nombre='" + nombre + "', pais='" + pais + "'}";
    }
}
