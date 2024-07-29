import { Request, Response } from "express";
import { DeleteUserUseCase } from "../../application/DeleteUserUseCase";

export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  async run(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const success = await this.deleteUserUseCase.run(Number(id));
      
      if (success) {
        res.status(204).send(); 
      } else {
        res.status(404).send({
          status: "error",
          data: "Usuario no encontrado",
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send({
        status: "error",
        data: "Ocurrió un error al eliminar el usuario",
        msn: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
