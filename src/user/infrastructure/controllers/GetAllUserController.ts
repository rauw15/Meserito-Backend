import { Request, Response } from "express";
import { GetAllUserUseCase } from "../../application/GetAllUsersUseCase";
import { TokenService } from "../TokenService";

export class GetAllUserController {
  constructor(readonly getAllUserUseCase: GetAllUserUseCase) {}

  async run(req: Request, res: Response) {
    // Middleware manual para validar token y rol
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ status: 'error', error: 'Token requerido' });
    }
    const token = authHeader.split(' ')[1];
    const payload = TokenService.verifyToken(token);
    if (!payload) {
      return res.status(401).send({ status: 'error', error: 'Token inválido' });
    }
    // Permitir tanto 'admin' como 'administrador' como rol válido
    if (payload.role !== 'admin' && payload.role !== 'administrador') {
      return res.status(403).send({ status: 'error', error: 'No autorizado' });
    }
    try {
      const users = await this.getAllUserUseCase.run();
      if (users) {
        res.status(200).send(users);
      } else {
        res.status(200).send([]);
      }
    } catch (error) {
      res.status(500).send({
        status: "error",
        error: "Ocurrió un error al obtener usuarios",
        msn: error,
      });
    }
  }
}
