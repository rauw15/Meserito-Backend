import { Request, Response } from "express";
import { LoginUserUseCase } from "../../application/LoginUserUseCase";
import bcrypt from 'bcrypt';
import { TokenService } from "../TokenService";

export class LoginUserController {
  constructor(private readonly loginUserUseCase: LoginUserUseCase) {}

  async run(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await this.loginUserUseCase.run(email, password);
      if (user) {
        // Verificar la contraseña usando bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).send({
            status: "error",
            message: "Invalid credentials",
          });
        }

        // Generar el token JWT incluyendo el rol del usuario
        const token = TokenService.generateToken({ id: user.id, email: user.email, role: user.role });

        console.log(`Generated Token: ${token}`);

        res.status(200).send({
          status: "success",
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token,
          },
        });
      } else {
        res.status(401).send({
          status: "error",
          message: "Invalid credentials",
        });
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).send({
        status: "error",
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
