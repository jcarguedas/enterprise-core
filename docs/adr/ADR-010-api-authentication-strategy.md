# ADR-010: Estrategia de autenticación API

- Estado: Aceptado
- Fecha: 2026-08-07
- Decisores: Jean Carlos Arguedas
- Proyecto: Enterprise Core

## Contexto

Enterprise Core será una plataforma modular compuesta por servicios internos que se comunicarán mediante APIs REST.

Enterprise Auth Service será responsable de autenticar usuarios, emitir credenciales y validar acceso a recursos protegidos dentro del ecosistema.

El sistema necesita una estrategia de autenticación que permita:

- Autenticación desacoplada para APIs.
- Integración futura con aplicaciones web, móviles y otros servicios.
- Control de permisos mediante RBAC.
- Trazabilidad de sesiones y tokens.
- Evolución futura hacia escenarios empresariales más complejos.

## Opciones consideradas

### Laravel Sanctum

Laravel Sanctum permite autenticar SPAs mediante cookies de sesión y también manejar API tokens para clientes externos o aplicaciones móviles. Laravel documenta que las rutas protegidas pueden usar el guard `auth:sanctum`. :contentReference[oaicite:0]{index=0}

Ventajas:

- Integración simple con Laravel.
- Menor complejidad inicial.
- Adecuado para APIs propias y aplicaciones first-party.
- Compatible con tokens personales.
- Buena opción para iniciar sin implementar OAuth2 completo.

Desventajas:

- No implementa un servidor OAuth2 completo.
- Puede requerir decisiones adicionales si la arquitectura crece hacia terceros, clientes externos o autorización delegada.

### Laravel Passport

Laravel Passport provee una implementación completa de servidor OAuth2 para Laravel. La documentación oficial indica que asume familiaridad con OAuth2. :contentReference[oaicite:1]{index=1}

Ventajas:

- Solución más robusta para OAuth2.
- Mejor opción si Enterprise Core expone APIs a clientes externos o terceros.
- Soporta escenarios empresariales más avanzados.

Desventajas:

- Mayor complejidad inicial.
- Introduce conceptos OAuth2 antes de que el producto los necesite.
- Puede ser innecesario para Sprint 1.

### JWT personalizado

Implementar JWT directamente permitiría control total sobre estructura de tokens, expiración, refresh tokens y claims.

Ventajas:

- Máximo control arquitectónico.
- Encaja bien con microservicios.
- Permite definir claims propios del ecosistema Enterprise Core.

Desventajas:

- Mayor responsabilidad de seguridad.
- Más código propio que mantener.
- Mayor riesgo de errores si se implementa demasiado pronto.

## Decisión

Enterprise Core adoptará una estrategia progresiva.

Para la fase inicial de Enterprise Auth Service se utilizará una estrategia basada en tokens API con Laravel Sanctum, complementada con el modelo RBAC propio del dominio.

La autorización fina no dependerá únicamente del paquete de autenticación, sino de las reglas internas del dominio:

- User::hasRole()
- User::hasPermission()
- Role::hasPermission()

OAuth2 con Laravel Passport se mantiene como opción futura si Enterprise Core requiere autorización delegada, clientes externos o integración formal con terceros.

## Justificación

Laravel Sanctum permite avanzar rápidamente con autenticación API en Laravel sin introducir la complejidad completa de OAuth2 desde el inicio.

Enterprise Core todavía está en una etapa temprana. La prioridad es construir una base funcional, testeable y segura para login, logout, protección de rutas y permisos internos.

La estrategia conserva flexibilidad porque el modelo RBAC está desacoplado del proveedor de autenticación.

## Consecuencias positivas

- Menor complejidad inicial.
- Avance más rápido del Auth Service.
- Integración natural con Laravel.
- Permite proteger endpoints REST desde fases tempranas.
- Mantiene RBAC como lógica propia del dominio.
- Facilita pruebas automatizadas.

## Consecuencias negativas o riesgos

- Si en el futuro se requiere OAuth2 formal, habrá que migrar o complementar la estrategia.
- La gestión de refresh tokens y expiración deberá diseñarse cuidadosamente.
- Se debe evitar acoplar la lógica de permisos exclusivamente a Sanctum.
- Será necesario documentar claramente los contratos de autenticación.

## Reglas de implementación

- Enterprise Auth Service será la autoridad de autenticación.
- Los endpoints protegidos deberán requerir token válido.
- Los permisos se evaluarán usando el modelo RBAC propio.
- Las acciones sensibles deberán registrar auditoría.
- Las credenciales nunca deberán exponerse en logs, commits ni respuestas API.
- El archivo `.env` no debe ser versionado.
- La estrategia podrá evolucionar hacia Passport/OAuth2 si el producto lo requiere.

## Estado futuro

Esta decisión podrá ser revisada cuando Enterprise Core necesite:

- Integración con terceros.
- OAuth2 formal.
- Single Sign-On.
- OpenID Connect.
- Clientes externos administrados.
- Autorización delegada.
