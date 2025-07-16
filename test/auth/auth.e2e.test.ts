import request from 'supertest';
import app from '../../src/server'; // Jest y ts-jest manejarán la importación correctamente
import UserModel from '../../src/user/domain/User'; // Asumiendo que User.ts tiene un `export default`

// Elimina los tipos explícitos de variable para evitar errores de sintaxis en JS
let adminToken;
let meseroToken;
let createdUserId;

const adminCredentials = {
  id: 1,
  name: 'Admin',
  email: 'admin@example.com',
  password: 'adminPassword',
  role: 'admin',
};

const meseroCredentials = {
  id: 2,
  name: 'Mesero',
  email: 'mesero@example.com',
  password: 'meseroPassword',
  role: 'user',
};

describe('Pruebas de autenticación y usuarios', () => {
  beforeAll(async () => {
    await UserModel.deleteMany({});
    await request(app).post('/users/create').send(adminCredentials);
    await request(app).post('/users/create').send(meseroCredentials);

    // Login para obtener tokens
    const adminRes = await request(app).post('/users/login').send({
      email: adminCredentials.email,
      password: adminCredentials.password,
    });
    adminToken = adminRes.body.data.token;

    const meseroRes = await request(app).post('/users/login').send({
      email: meseroCredentials.email,
      password: meseroCredentials.password,
    });
    meseroToken = meseroRes.body.data.token;
  });

  describe('POST /users/login', () => {
    it('Inicio de sesión exitoso con credenciales válidas (rol administrador)', async () => {
      const res = await request(app).post('/users/login').send({
        email: adminCredentials.email,
        password: adminCredentials.password,
      });
      expect(res.status).toBe(200);
      expect(res.body.data.role).toBe('admin');
      expect(res.body.data.token).toBeDefined();
    });

    it('Inicio de sesión exitoso con credenciales válidas (rol mesero)', async () => {
      const res = await request(app).post('/users/login').send({
        email: meseroCredentials.email,
        password: meseroCredentials.password,
      });
      expect(res.status).toBe(200);
      expect(res.body.data.role).toBe('user');
      expect(res.body.data.token).toBeDefined();
    });

    it('Intento de inicio de sesión con contraseña incorrecta', async () => {
      const res = await request(app).post('/users/login').send({
        email: adminCredentials.email,
        password: 'wrongPassword',
      });
      expect(res.status).toBe(401);
    });

    it('Intento de inicio de sesión con un email que no existe', async () => {
      const res = await request(app).post('/users/login').send({
        email: 'noexiste@example.com',
        password: 'anyPassword',
      });
      expect(res.status).toBe(401);
    });

    it('Intento de inicio de sesión con campos vacíos', async () => {
      const res = await request(app).post('/users/login').send({
        email: '',
        password: '',
      });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /users/get', () => {
    it('Obtener la lista de todos los usuarios (requiere token de administrador)', async () => {
      const res = await request(app)
        .get('/users/get')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('Intento de obtener la lista de usuarios sin token', async () => {
      const res = await request(app).get('/users/get');
      expect(res.status).toBe(401);
    });

    it('Intento de obtener la lista de usuarios con token de rol "mesero"', async () => {
      const res = await request(app)
        .get('/users/get')
        .set('Authorization', `Bearer ${meseroToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe('POST /users/create', () => {
    it('Creación de un nuevo usuario exitosamente (requiere token de admin)', async () => {
      const newUser = {
        id: 3,
        name: 'Nuevo Usuario',
        email: 'nuevo@example.com',
        password: 'nuevoPassword',
      };
      const res = await request(app)
        .post('/users/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser);
      expect(res.status).toBe(201);
      expect(res.body.data.email).toBe(newUser.email);
      createdUserId = res.body.data.id;
    });

    it('Intento de crear un usuario con un email que ya existe', async () => {
      const res = await request(app)
        .post('/users/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          id: 4,
          name: 'Duplicado',
          email: 'nuevo@example.com',
          password: 'otraPassword',
        });
      expect(res.status).toBe(400);
    });

    it('Intento de crear un usuario con datos inválidos', async () => {
      const res = await request(app)
        .post('/users/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          id: 5,
          name: '',
          email: 'invalido@example.com',
          password: '123',
          role: 'superadmin',
        });
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /users/update/:id', () => {
    it('Actualizar la información de un usuario existente (requiere token de admin)', async () => {
      const res = await request(app)
        .put(`/users/update/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Usuario Actualizado', email: 'actualizado@example.com' });
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Usuario Actualizado');
    });
  });

  describe('DELETE /users/delete/:id', () => {
    it('Eliminar un usuario (requiere token de admin)', async () => {
      const res = await request(app)
        .delete(`/users/delete/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(204);
    });
  });
});