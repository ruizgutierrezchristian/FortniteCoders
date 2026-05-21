package com.gamevault.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

/**
 * Entidad Videojuego.
 * Relación N:1 con Desarrolladora (muchos videojuegos pertenecen a una desarrolladora).
 */
@Entity
@Table(name = "videojuegos")
public class Videojuego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 150, message = "El título no puede superar 150 caracteres")
    @Column(nullable = false, length = 150)
    private String titulo;

    @Size(max = 50)
    @Column(length = 50)
    private String genero;

    @Column(name = "anio_lanzamiento")
    private Integer anioLanzamiento;

    @DecimalMin(value = "0.0", message = "La puntuación mínima es 0")
    @DecimalMax(value = "10.0", message = "La puntuación máxima es 10")
    private Double puntuacion;

    @Size(max = 255)
    private String plataformas;

    @Size(max = 500)
    private String descripcion;

    // Relación N:1 — muchos videojuegos pertenecen a una desarrolladora
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "desarrolladora_id", nullable = false)
    @JsonBackReference
    private Desarrolladora desarrolladora;

    // ---- Constructores ----

    public Videojuego() {}

    public Videojuego(String titulo, String genero, Integer anioLanzamiento,
                      Double puntuacion, String plataformas, String descripcion,
                      Desarrolladora desarrolladora) {
        this.titulo = titulo;
        this.genero = genero;
        this.anioLanzamiento = anioLanzamiento;
        this.puntuacion = puntuacion;
        this.plataformas = plataformas;
        this.descripcion = descripcion;
        this.desarrolladora = desarrolladora;
    }

    // ---- Getters y Setters ----

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public Integer getAnioLanzamiento() { return anioLanzamiento; }
    public void setAnioLanzamiento(Integer anioLanzamiento) { this.anioLanzamiento = anioLanzamiento; }

    public Double getPuntuacion() { return puntuacion; }
    public void setPuntuacion(Double puntuacion) { this.puntuacion = puntuacion; }

    public String getPlataformas() { return plataformas; }
    public void setPlataformas(String plataformas) { this.plataformas = plataformas; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Desarrolladora getDesarrolladora() { return desarrolladora; }
    public void setDesarrolladora(Desarrolladora desarrolladora) { this.desarrolladora = desarrolladora; }

    // Campo virtual para la serialización JSON (devuelve el id de la desarrolladora)
    @Transient
    public Long getDesarrolladoraId() {
        return desarrolladora != null ? desarrolladora.getId() : null;
    }

    @Transient
    public String getDesarrolladoraNombre() {
        return desarrolladora != null ? desarrolladora.getNombre() : null;
    }

    @Override
    public String toString() {
        return "Videojuego{id=" + id + ", titulo='" + titulo + "', genero='" + genero + "'}";
    }
}
