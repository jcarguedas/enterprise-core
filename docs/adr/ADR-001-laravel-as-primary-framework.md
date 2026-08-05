# ADR-001: Laravel como framework principal

- Estado: Aceptado
- Fecha: 2026-08-05
- Decisores: Jean Carlos Arguedas
- Proyecto: Enterprise Core

## Contexto

Enterprise Core requiere un framework backend moderno, ampliamente adoptado y alineado con la experiencia previa del desarrollador y con las vacantes objetivo.

## Decisión

Se utilizará Laravel como framework backend principal.

## Justificación

- Aprovecha más de diez años de experiencia previa en PHP.
- Tiene alta demanda en vacantes PHP nacionales e internacionales.
- Incluye herramientas maduras para autenticación, migraciones, colas, eventos y pruebas.
- Permite integrar componentes de Symfony cuando sea necesario.

## Consecuencias positivas

- Menor curva de aprendizaje.
- Mayor velocidad inicial de desarrollo.
- Mejor alineación con el mercado laboral.

## Consecuencias negativas o riesgos

- Posible dependencia de convenciones específicas de Laravel.
- Será necesario aprender su ecosistema y mejores prácticas.

## Alternativas consideradas

- Symfony
- CodeIgniter
- Desarrollo PHP sin framework