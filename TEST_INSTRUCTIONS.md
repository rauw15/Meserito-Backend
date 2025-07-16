# Instrucciones para Ejecutar Pruebas

## Pruebas de Autenticación y Gestión de Usuarios

### Opción 1: Ejecución Automática (Recomendada)

```bash
# Desde la carpeta Meserito-Backend
python run_tests.py
```

Este comando:
1. Instala dependencias si es necesario
2. Inicia el servidor automáticamente
3. Configura la base de datos de pruebas
4. Ejecuta todas las pruebas
5. Detiene el servidor al finalizar

### Opción 2: Ejecución Manual

#### Paso 1: Iniciar el servidor
```bash
cd Meserito-Backend
npm start
```

#### Paso 2: En otra terminal, configurar la base de datos
```bash
cd Meserito-Backend
python test/setup_test_db.py
```

#### Paso 3: Ejecutar las pruebas
```bash
cd Meserito-Backend
pytest test/ -v
```

### Opción 3: Usando npm scripts

```bash
cd Meserito-Backend
npm run test:python
```

## Pruebas Incluidas

### Módulo 1: Autenticación y Gestión de Usuarios (12 Pruebas)

1. **POST /users/login**: Inicio de sesión exitoso con credenciales válidas (rol administrador)
2. **POST /users/login**: Inicio de sesión exitoso con credenciales válidas (rol mesero)
3. **POST /users/login**: Intento de inicio de sesión con contraseña incorrecta
4. **POST /users/login**: Intento de inicio de sesión con un email que no existe
5. **POST /users/login**: Intento de inicio de sesión con campos vacíos
6. **GET /users/get**: Obtener la lista de todos los usuarios (requiere token de administrador)
7. **GET /users/get**: Intento de obtener la lista de usuarios sin token
8. **GET /users/get**: Intento de obtener la lista de usuarios con token de rol "mesero"
9. **POST /users/create**: Creación de un nuevo usuario exitosamente
10. **POST /users/create**: Intento de crear un usuario con un email que ya existe
11. **POST /users/create**: Intento de crear un usuario con datos inválidos
12. **PUT /users/update/{id}**: Actualizar la información de un usuario existente
13. **DELETE /users/delete/{id}**: Eliminar un usuario

## Restricción de acceso a endpoints de productos

A partir de la versión actual, los siguientes endpoints solo pueden ser accedidos por usuarios con rol de administrador ('admin' o 'administrador'):

- POST `/products/create`
- PUT `/products/update/:id`
- DELETE `/products/delete/:id`

Si un usuario no autenticado o sin privilegios de administrador intenta acceder, recibirá un error 401 (no autenticado) o 403 (prohibido).

Las pruebas automáticas incluyen casos para verificar que solo los administradores pueden realizar estas acciones.

## Solución de Problemas

### Error: "Connection refused"
- Asegúrate de que el servidor esté ejecutándose en el puerto 30000
- Verifica que MongoDB esté conectado

### Error: "Module not found"
- Ejecuta `npm install` para instalar dependencias

### Error: "Database connection failed"
- Verifica que MongoDB esté ejecutándose
- Revisa la configuración de conexión en `src/database/database.ts`

## Configuración del Entorno

### Requisitos
- Node.js 16+
- Python 3.7+
- MongoDB
- npm o yarn

### Dependencias Python
```bash
pip install pytest requests
```

### Dependencias Node.js
```bash
npm install
``` 