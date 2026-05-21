package com.gamevault.config;

import com.gamevault.model.Desarrolladora;
import com.gamevault.model.Videojuego;
import com.gamevault.repository.DesarrolladoraRepository;
import com.gamevault.repository.VideojuegoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Carga datos de prueba al iniciar la aplicación.
 * Solo se ejecuta si la base de datos está vacía.
 */
@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private DesarrolladoraRepository desarrolladoraRepo;

    @Autowired
    private VideojuegoRepository videojuegoRepo;

    @Override
    public void run(String... args) {
        if (desarrolladoraRepo.count() > 0) return; // Ya hay datos

        // ---- Desarrolladoras ----
        Desarrolladora nintendo = desarrolladoraRepo.save(
            new Desarrolladora("Nintendo", "Japón", 1889,
                "Pionera del entretenimiento interactivo, creadora de Mario y Zelda."));

        Desarrolladora naughtyDog = desarrolladoraRepo.save(
            new Desarrolladora("Naughty Dog", "EE.UU.", 1984,
                "Conocida por sus narrativas cinematográficas y mundos detallados."));

        Desarrolladora cdProjekt = desarrolladoraRepo.save(
            new Desarrolladora("CD Projekt RED", "Polonia", 2002,
                "Creadora de The Witcher y Cyberpunk 2077."));

        Desarrolladora fromSoftware = desarrolladoraRepo.save(
            new Desarrolladora("FromSoftware", "Japón", 1986,
                "Especializada en RPGs de acción desafiantes: Dark Souls, Elden Ring."));

        Desarrolladora rockstar = desarrolladoraRepo.save(
            new Desarrolladora("Rockstar Games", "EE.UU.", 1998,
                "Autores de GTA y Red Dead Redemption."));

        // ---- Videojuegos de Nintendo ----
        videojuegoRepo.save(new Videojuego(
            "The Legend of Zelda: Breath of the Wild", "Aventura / RPG", 2017,
            9.7, "Switch, Wii U",
            "Un mundo abierto revolucionario donde la física y la creatividad son las reglas.", nintendo));

        videojuegoRepo.save(new Videojuego(
            "Super Mario Odyssey", "Plataformas", 2017,
            9.5, "Switch",
            "Mario viaja por mundos únicos capturando enemigos con su sombrero parlante.", nintendo));

        videojuegoRepo.save(new Videojuego(
            "Metroid Dread", "Metroidvania / Acción", 2021,
            8.8, "Switch",
            "Samus Aran regresa en un thriller de ciencia ficción lleno de tensión.", nintendo));

        // ---- Videojuegos de Naughty Dog ----
        videojuegoRepo.save(new Videojuego(
            "The Last of Us Part I", "Acción / Aventura", 2022,
            9.4, "PS5, PC",
            "Un viaje postapocalíptico que redefine la narración en los videojuegos.", naughtyDog));

        videojuegoRepo.save(new Videojuego(
            "Uncharted 4: A Thief's End", "Acción / Aventura", 2016,
            9.1, "PS4, PS5, PC",
            "La aventura final de Nathan Drake en busca de un tesoro pirata legendario.", naughtyDog));

        videojuegoRepo.save(new Videojuego(
            "The Last of Us Part II", "Acción / Aventura", 2020,
            9.0, "PS4, PS5",
            "Una historia cruda sobre el ciclo de la violencia y las consecuencias.", naughtyDog));

        // ---- Videojuegos de CD Projekt RED ----
        videojuegoRepo.save(new Videojuego(
            "The Witcher 3: Wild Hunt", "RPG", 2015,
            9.8, "PC, PS4, Switch, Xbox",
            "Considerado el mejor RPG de mundo abierto jamás creado. Geralt en su mejor forma.", cdProjekt));

        videojuegoRepo.save(new Videojuego(
            "Cyberpunk 2077", "RPG / Acción", 2020,
            8.5, "PC, PS5, Xbox Series",
            "Night City, un mundo futurista inmersivo con una historia magistral.", cdProjekt));

        // ---- Videojuegos de FromSoftware ----
        videojuegoRepo.save(new Videojuego(
            "Elden Ring", "RPG de Acción", 2022,
            9.6, "PC, PS4, PS5, Xbox",
            "El mundo abierto de FromSoftware creado junto a George R.R. Martin.", fromSoftware));

        videojuegoRepo.save(new Videojuego(
            "Dark Souls III", "RPG de Acción", 2016,
            9.2, "PC, PS4, Xbox One",
            "La cúspide de la trilogía Souls: diseño de niveles magistral y jefes épicos.", fromSoftware));

        videojuegoRepo.save(new Videojuego(
            "Sekiro: Shadows Die Twice", "Acción / Aventura", 2019,
            9.3, "PC, PS4, Xbox One",
            "Un shinobi en el Japón feudal. El combate más exigente y satisfactorio.", fromSoftware));

        // ---- Videojuegos de Rockstar ----
        videojuegoRepo.save(new Videojuego(
            "Red Dead Redemption 2", "Acción / Aventura", 2018,
            9.7, "PC, PS4, Xbox One",
            "La historia de Arthur Morgan en el ocaso del salvaje oeste. Obra maestra.", rockstar));

        videojuegoRepo.save(new Videojuego(
            "Grand Theft Auto V", "Acción / Aventura", 2013,
            9.5, "PC, PS3, PS4, PS5, Xbox",
            "Los Ángeles recreada con una narrativa de tres personajes y mundo vivo.", rockstar));

        System.out.println("✅ Datos de prueba cargados: 5 desarrolladoras, 13 videojuegos.");
    }
}
