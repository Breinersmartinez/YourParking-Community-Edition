package com.example.parking_management.selenium;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;

/**
 * Prueba de humo E2E: carga la página principal y verifica que responda.
 * Omitida por defecto hasta que exista frontend desplegado (ver UiTestBase).
 */
@EnabledIfEnvironmentVariable(named = "SELENIUM_BASE_URL", matches = ".+")
class SmokeUiTest extends UiTestBase {

    @Test
    void laAplicacionCarga() {
        driver.get(baseUrl);
        assertNotNull(driver.getPageSource(), "La aplicación debe devolver contenido HTML");
    }
}
