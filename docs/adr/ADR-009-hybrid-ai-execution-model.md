# ADR-009: Modelo híbrido de ejecución con inteligencia artificial

- Estado: Aceptado
- Fecha: 2026-08-05
- Decisores: Jean Carlos Arguedas
- Proyecto: Enterprise Core

## Contexto

Enterprise Core busca ofrecer una experiencia conversacional rápida e inteligente sin convertir cada operación del sistema en una llamada costosa o lenta a un modelo externo.

## Decisión

La plataforma utilizará un modelo híbrido de ejecución.

Las operaciones deterministas, consultas y reglas empresariales se ejecutarán localmente mediante Laravel y PostgreSQL. Los modelos de inteligencia artificial se utilizarán únicamente para interpretar lenguaje natural, redactar explicaciones y resolver tareas donde aporten un valor claro.

## Principios

- La IA no será la fuente oficial de los datos empresariales.
- Las consultas operativas serán ejecutadas por servicios internos.
- Las acciones sensibles requerirán validación y confirmación humana.
- El sistema deberá continuar funcionando parcialmente si el proveedor de IA no está disponible.
- Se priorizarán velocidad, costo controlado y trazabilidad.

## Consecuencias positivas

- Menor latencia.
- Menor costo por operación.
- Mayor confiabilidad.
- Mejor control de permisos y seguridad.
- Posibilidad de cambiar de proveedor de IA.

## Consecuencias negativas o riesgos

- Será necesario construir un orquestador de acciones.
- La arquitectura inicial será más estructurada que la de un chatbot tradicional.
- Habrá que mantener separadas la interpretación del lenguaje y la lógica empresarial.

## Alternativas consideradas

- Enviar todas las solicitudes directamente a un modelo de IA.
- Utilizar únicamente menús y formularios tradicionales.
- Ejecutar un modelo local para todas las interacciones.