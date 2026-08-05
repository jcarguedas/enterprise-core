# ADR-004: XAMPP únicamente para proyectos heredados

- Estado: Aceptado
- Fecha: 2026-08-05
- Decisores: Jean Carlos Arguedas
- Proyecto: Enterprise Core

---

## Contexto

El desarrollador mantiene proyectos antiguos que utilizan PHP 7.x y Apache mediante XAMPP.

---

## Decisión

XAMPP no será utilizado para Enterprise Core.

Se conservará únicamente para mantenimiento de proyectos heredados.

---

## Justificación

- PHP 7.2 está fuera de soporte.
- Laravel moderno requiere versiones recientes.
- Herd ofrece un entorno más limpio y actualizado.

---

## Consecuencias positivas

- Separación entre proyectos modernos y heredados.
- Menor riesgo de conflictos entre versiones.

---

## Consecuencias negativas

- Será necesario mantener dos entornos durante un tiempo.

---

## Alternativas consideradas

- Continuar usando XAMPP.