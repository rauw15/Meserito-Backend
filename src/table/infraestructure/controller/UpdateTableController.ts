import { Request, Response } from "express";
import { UpdateTableUseCase } from "../../application/UpdateTableUseCase";

export class UpdateTableController {
  constructor(private readonly updateTableUseCase: UpdateTableUseCase) {}

  async run(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    const data = req.body;

    try {
      const updatedTable = await this.updateTableUseCase.run(id, data);
      if (updatedTable) {
        res.status(200).send({
          status: "success",
          data: updatedTable,
        });
      } else {
        res.status(400).send({
          status: "error",
          message: "Failed to update table",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({
          status: "error",
          message: "Error updating table",
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
