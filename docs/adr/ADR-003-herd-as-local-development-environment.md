# ADR-003: Laravel Herd como entorno principal de desarrollo

- Estado: Aceptado
- Fecha: 2026-08-05
- Decisores: Jean Carlos Arguedas
- Proyecto: Enterprise Core

---

## Contexto

Se requiere un entorno moderno para desarrollar aplicaciones Laravel utilizando versiones recientes de PHP sin depender de configuraciones heredadas.

---

## Decisión

Laravel Herd será el entorno oficial de desarrollo para Enterprise Core.

---

## Justificación

- Administración sencilla de versiones de PHP.
- Integración con Composer.
- Integración con Node mediante NVM.
- Configuración mínima.
- Cercano a entornos modernos utilizados por empresas.

---

## Consecuencias positivas

- Menor tiempo de configuración.
- Entorno limpio.
- Fácil actualización de herramientas.

---

## Consecuencias negativas

- Dependencia de una herramienta específica.
- Algunas funcionalidades avanzadas requieren Herd Pro (no necesarias actualmente).

---

## Alternativas consideradas

- XAMPP
- Laragon
- Docker