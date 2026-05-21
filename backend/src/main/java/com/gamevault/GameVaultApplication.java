package com.gamevault;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada de la aplicación GameVault.
 *
 * Para iniciar el backend:
 *   cd backend
 *   mvn spring-boot:run
 *
 * La API estará disponible en: http://localhost:8080/api
 * Consola H2:                  http://localhost:8080/h2-console
 */
@SpringBootApplication
public class GameVaultApplication {

    public static void main(String[] args) {
        SpringApplication.run(GameVaultApplication.class, args);
    }
}
