import { Request, Response } from "express";
import { CreateUserUseCase } from "../../application/CreateUserUseCase";
import bcrypt from 'bcrypt';
import { TokenService } from "../TokenService";

const saltosBcrypt: number = parseInt(process.env.SALTOS_BCRYPT || '4');

// Define el correo y la contraseña del administrador
const adminEmail = "admin@example.com";
const adminPassword = "adminPassword";

export class CreateUserController {
  constructor(readonly createUserUseCase: CreateUserUseCase) {}

  async run(req: Request, res: Response) {
    const data = req.body;
    const hashedPassword: string = await bcrypt.hash(data.password, saltosBcrypt);

    try {
      // Verifica si el correo coincide con el del administrador
      const isAdmin = data.email === adminEmail && data.password === adminPassword;
      const role = isAdmin ? 'admin' : 'user';  // Asigna el rol

      const user = await this.createUserUseCase.run(
        Number(data.id),
        data.name,
        hashedPassword,
        data.email,
        role  // Pasa el rol al caso de uso
      );

      if (user) {
        const token = TokenService.generateToken({ id: user.id, email: user.email, role: user.role });

        console.log(`Generated Token: ${token}`);

        res.status(201).send({
          status: "success",
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,  // Incluye el rol en la respuesta
            token: token
          },
        });
      } else {
        res.status(204).send({
          status: "error",
          data: "No fue posible agregar el usuario",
        });
      }
    } catch (error) {
      console.error('Error creating user:', error); 
      res.status(500).send({
        status: "error",
        data: "Ocurrió un error al crear el usuario",
        msn: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
