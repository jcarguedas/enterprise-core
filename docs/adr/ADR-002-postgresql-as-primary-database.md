# ADR-002: PostgreSQL como base de datos principal

- Estado: Aceptado
- Fecha: 2026-08-05
- Decisores: Jean Carlos Arguedas
- Proyecto: Enterprise Core

---

## Contexto

Enterprise Core requiere un sistema de gestión de bases de datos robusto, escalable y ampliamente utilizado en aplicaciones empresariales modernas. Además del desarrollo del producto, el proyecto busca fortalecer habilidades alineadas con el mercado laboral internacional.

---

## Decisión

PostgreSQL será el motor de base de datos principal de Enterprise Core.

MySQL continuará utilizándose únicamente para proyectos heredados o cuando un cliente lo requiera.

---

## Justificación

- Alta adopción en empresas SaaS y plataformas empresariales.
- Excelente integración con Laravel.
- Mayor alineación con vacantes internacionales.
- Soporte para características avanzadas como JSON, CTE, Window Functions y consultas complejas.
- Arquitectura preparada para crecimiento futuro.

---

## Consecuencias positivas

- Mayor experiencia en PostgreSQL.
- Arquitectura preparada para proyectos empresariales.
- Mejor posicionamiento profesional.

---

## Consecuencias negativas

- Curva de aprendizaje inicial.
- Diferencias sintácticas respecto a MySQL.

---

## Alternativas consideradas

- MySQL
- MariaDB
- SQL Server