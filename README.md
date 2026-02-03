# Proyecto Arquitectura de Software - Sistema de Publicaciones

## Descripción

Sistema de microservicios para gestión de autores y publicaciones, compuesto por:

- **Authors Service**: Microservicio en Laravel para gestión de autores
- **Publications Service**: Microservicio en Spring Boot para gestión de publicaciones  
- **Frontend**: Aplicación React para interfaz de usuario
- **Bases de Datos**: MySQL para persistencia de datos

##  Despliegue con Docker

### Prerrequisitos

- Docker (versión 20.10 o superior)
- Docker Compose (versión 2.0 o superior)
- Puertos disponibles: 3000, 3306, 3307, 5050, 8000

### Estructura del Proyecto

```
Proyecto ARQ SW/
├── docker-compose.yml          # Orquestación principal
├── .env                       # Variables de entorno
├── nginx/
│   └── authors.conf          # Configuración Nginx para Authors Service
├── Frontend/
│   └── publications/
│       └── Dockerfile        # Container del frontend React
├── Backend/
│   ├── Authors-microservice/
│   │   └── Dockerfile        # Container del servicio de autores
│   └── Micorservicio_Publicaciones/
│       └── Dockerfile        # Container del servicio de publicaciones
└── README.md
```

### Servicios y Puertos

| Servicio | Puerto Host | Puerto Container | Descripción |
|----------|-------------|------------------|-------------|
| Frontend | 3000 | 80 | Interfaz web React |
| Authors Service | 8000 | 80 | API REST autores (Laravel) |
| Publications Service | 5050 | 5050 | API REST publicaciones (Spring Boot) |
| DB Authors | 3306 | 3306 | Base de datos MySQL - Autores |
| DB Publications | 3307 | 3306 | Base de datos MySQL - Publicaciones |

### Redes Docker

- **app-network**: Comunicación entre servicios de aplicación
- **db-network**: Comunicación con bases de datos

### Volúmenes Persistentes

- **db_authors_data**: Datos de la base de autores
- **db_publications_data**: Datos de la base de publicaciones

##  Instrucciones de Despliegue

### 1. Clonar y Preparar el Proyecto

```bash
# Navegar al directorio del proyecto
cd "C:\Users\HP\Proyecto ARQ SW"

# Verificar que existen todos los archivos necesarios
dir docker-compose.yml
dir .env
```

### 2. Configurar Variables de Entorno

El archivo `.env` ya está configurado con valores por defecto. Puedes modificar las credenciales si lo deseas:

```env
# Bases de Datos
DB_AUTHORS_ROOT_PASSWORD=root123
DB_AUTHORS_DATABASE=authors_service
DB_AUTHORS_USERNAME=authors_user
DB_AUTHORS_PASSWORD=authors_password123

DB_PUBLICATIONS_ROOT_PASSWORD=root123
DB_PUBLICATIONS_DATABASE=publications_db
DB_PUBLICATIONS_USERNAME=publications_user
DB_PUBLICATIONS_PASSWORD=publications_password123
```

### 3. Ejecutar el Despliegue

```bash
# Construir y levantar todos los servicios
docker-compose up --build

# Para ejecutar en segundo plano
docker-compose up --build -d
```

### 4. Verificar el Despliegue

Espera a que todos los servicios estén listos (puede tomar 2-3 minutos en el primer despliegue).

```bash
# Verificar estado de los servicios
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f publications-service
```

### 5. Acceder a la Aplicación

Una vez todos los servicios estén en estado "healthy":

- **Frontend**: http://localhost:3000
- **Authors API**: http://localhost:8000/api/authors
- **Publications API**: http://localhost:5050/publications

##  Health Checks

Todos los servicios incluyen health checks automáticos:

- **Authors Service**: Verifica estado de migraciones de Laravel
- **Publications Service**: Endpoint `/actuator/health` de Spring Boot
- **Bases de Datos**: Comando `mysqladmin ping`
- **Frontend**: Verificación HTTP básica

##  Comandos Útiles

### Gestión de Servicios

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: elimina datos)
docker-compose down -v

# Reconstruir un servicio específico
docker-compose build authors-service
docker-compose up -d authors-service

# Reiniciar un servicio
docker-compose restart publications-service
```

### Debugging y Monitoreo

```bash
# Ejecutar comando en contenedor
docker-compose exec authors-service php artisan migrate:status
docker-compose exec publications-service curl http://localhost:5050/actuator/health

# Ver logs de bases de datos
docker-compose logs db-authors
docker-compose logs db-publications

# Conectar a base de datos
docker-compose exec db-authors mysql -u authors_user -p authors_service
```

### Escalabilidad

```bash
# Escalar servicios (ejemplo: 3 instancias del frontend)
docker-compose up -d --scale frontend=3

# Ver recursos utilizados
docker stats
```

##  Troubleshooting

### Problemas Comunes

1. **Puerto ocupado**: Verificar que los puertos 3000, 3306, 3307, 5050, 8000 estén libres
2. **Servicios no healthy**: Revisar logs con `docker-compose logs [servicio]`
3. **Error de conexión DB**: Verificar que las bases de datos estén en estado "healthy" antes que los servicios

### Logs Importantes

```bash
# Ver logs de inicio de bases de datos
docker-compose logs db-authors | grep "ready for connections"

# Ver logs de aplicaciones
docker-compose logs authors-service | tail -50
docker-compose logs publications-service | tail -50
```

### Reinicio Limpio

```bash
# Parar todo y limpiar
docker-compose down -v
docker system prune -f

# Volver a levantar
docker-compose up --build
```

##  Notas de Desarrollo

- Los servicios están configurados para **auto-restart** en caso de fallo
- Las bases de datos usan volúmenes persistentes para conservar datos
- El frontend incluye proxy automático para las APIs
- Todos los servicios incluyen configuraciones de producción optimizadas

##  Seguridad

- Variables de entorno para credenciales sensibles
- Redes Docker aisladas para diferentes capas
- Headers de seguridad configurados en Nginx
- Bases de datos no expuestas directamente (solo a través de servicios)

---

**Autor**: Proyecto Arquitectura de Software  
**Fecha**: Febrero 2026
