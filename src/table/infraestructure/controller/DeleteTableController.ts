import { Request, Response } from "express";
import { DeleteTableUseCase } from "../../application/DeleteTableUseCase";

export class DeleteTableController {
  constructor(private readonly deleteTableUseCase: DeleteTableUseCase) {}

  async run(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const result = await this.deleteTableUseCase.run(id);
      if (result) {
        res.status(200).send({
          status: "success",
          message: "Table deleted successfully",
        });
      } else {
        res.status(400).send({
          status: "error",
          message: "Failed to delete table",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({
          status: "error",
          message: "Error deleting table",
          error: error.message,
        });
      } else {
        res.status(500).send({
          status: "error",
          message: "An unknown error occurred",
        });
      }
    }
  }
}
