package com.example.parking_management.selenium;

import java.time.Duration;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

/**
 * Base para pruebas E2E de interfaz con Selenium.
 *
 * Se activan únicamente cuando existe la variable de entorno SELENIUM_BASE_URL,
 * porque hoy el proyecto aún no tiene frontend (frontend/ vacío según AGENTS.md).
 * Uso futuro: levantar backend + frontend y ejecutar
 * SELENIUM_BASE_URL=http://localhost:5173 ./mvnw test
 */
public abstract class UiTestBase {

    protected WebDriver driver;
    protected String baseUrl;

    @BeforeEach
    void setUpDriver() {
        baseUrl = System.getenv().getOrDefault("SELENIUM_BASE_URL", "http://localhost:8080");
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(15));
    }

    @AfterEach
    void tearDownDriver() {
        if (driver != null) {
            driver.quit();
        }
    }
}
