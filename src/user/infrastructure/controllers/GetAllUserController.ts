import { Request, Response } from "express";
import { GetAllUserUseCase } from "../../application/GetAllUsersUseCase";

export class GetAllUserController {
  constructor(readonly getAllUserUseCase: GetAllUserUseCase) {}

  async run(req: Request, res: Response) {
    try {
      const users = await this.getAllUserUseCase.run();

      if (users) {
        res.status(200).send({
          status: "success",
          data: users.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email
          })),
        });
      } else {
        res.status(400).send({
          status: "error",
          msn: "Ocurrió algún problema al obtener usuarios",
        });
      }
    } catch (error) {
      res.status(500).send({
        status: "error",
        data: "Ocurrió un error al obtener usuarios",
        msn: error,
      });
    }
  }
}
