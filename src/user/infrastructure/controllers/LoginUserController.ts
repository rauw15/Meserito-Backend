import { Request, Response } from "express";
import { LoginUserUseCase } from "../../application/LoginUserUseCase";
import bcrypt from 'bcrypt';
import { TokenService } from "../TokenService";

export class LoginUserController {
  constructor(private readonly loginUserUseCase: LoginUserUseCase) {}

  async run(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res.status(400).send({ error: "Email y contraseña requeridos" });
      }
      const user = await this.loginUserUseCase.run(email, password);
      if (user) {
        // Verificar la contraseña usando bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).send({ error: "Credenciales inválidas (contraseña)" });
        }
        // Generar el token JWT incluyendo el rol del usuario
        // Aceptar roles 'admin', 'user', 'administrador', 'mesero'
        let role = user.role;
        if (role === 'admin' || role === 'administrador') role = 'administrador';
        if (role === 'user' || role === 'mesero') role = 'mesero';
        const token = TokenService.generateToken({ id: user.id, email: user.email, role: user.role });
        return res.status(200).send({
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: role,
          },
        });
      } else {
        return res.status(401).send({ error: "Credenciales inválidas (usuario)" });
      }
    } catch (error) {
      return res.status(500).send({ error: "Internal Server Error", details: error });
    }
  }
}
