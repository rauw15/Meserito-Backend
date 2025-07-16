import { Request, Response } from "express";
import { CreateUserUseCase } from "../../application/CreateUserUseCase";
import bcrypt from 'bcrypt';

const saltosBcrypt: number = parseInt(process.env.SALTOS_BCRYPT || '4');

export class CreateUserController {
  constructor(readonly createUserUseCase: CreateUserUseCase) {}

  async run(req: Request, res: Response) {
    const data = req.body;
    if (!data.name || !data.email || !data.password) {
      return res.status(400).send({ error: "Faltan campos obligatorios" });
    }
    try {
      // Verificar si el email ya existe
      const existing = await this.createUserUseCase.getRepository().findByEmail(data.email);
      if (existing) {
        return res.status(400).send({ error: "El email ya existe" });
      }
      const hashedPassword: string = await bcrypt.hash(data.password, saltosBcrypt);
      // Permitir rol enviado si es válido
      const validRoles = ['admin', 'user', 'administrador', 'mesero'];
      let role = 'user';
      if (data.role && validRoles.includes(data.role)) {
        role = data.role;
      }
      // Si no se envía rol, pero el email es admin@example.com, asignar admin
      if (!data.role && data.email === "admin@example.com") {
        role = 'administrador';
      }
      // Generar ID automático si no se proporciona
      let userId = data.id;
      if (!userId) {
        userId = Date.now();
      }
      const user = await this.createUserUseCase.run(
        Number(userId),
        data.name,
        hashedPassword,
        data.email,
        role
      );
      if (user) {
        return res.status(201).send({
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: user.role
        });
      } else {
        return res.status(400).send({ error: "No fue posible agregar el usuario" });
      }
    } catch (error) {
      return res.status(500).send({ error: "Ocurrió un error al crear el usuario" });
    }
  }
}
