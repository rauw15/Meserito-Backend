import { Request, Response } from "express";
import { UpdateUserUseCase } from "../../application/UpdateUserUseCase";

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async run(req: Request, res: Response) {
    const { id } = req.params; 
    const { name, email } = req.body;

    try {
      const updatedUser = await this.updateUserUseCase.run(Number(id), name, email);
      
      if (updatedUser) {
        res.status(200).send({
          status: "success",
          data: updatedUser,
        });
      } else {
        res.status(404).send({
          status: "error",
          data: "Usuario no encontrado",
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send({
        status: "error",
        data: "Ocurrió un error al actualizar el usuario",
        msn: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
