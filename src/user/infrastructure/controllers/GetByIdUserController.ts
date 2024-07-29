import { Request, Response } from "express";
import { GetByIdUserUseCase } from "../../application/GetByIdUserUseCase";

export class GetByIdUserController {
  constructor(readonly getByIdUserUseCase: GetByIdUserUseCase) {}

  async run(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const user = await this.getByIdUserUseCase.run(id);

      if (user) {
        res.status(200).send({
          status: "success",
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      } else {
        res.status(404).send({
          status: "error",
          msn: "Usuario no encontrado",
        });
      }
    } catch (error) {
      res.status(500).send({
        status: "error",
        data: "Ocurrió un error al obtener el usuario",
        msn: error,
      });
    }
  }
}
