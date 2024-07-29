import { Request, Response } from "express";
import { AssignUserToTableUseCase } from "../../application/AssignUserToTableUseCase";

export class AssignUserToTableController {
  constructor(private readonly assignUserToTableUseCase: AssignUserToTableUseCase) {}

  async run(req: Request, res: Response) {
    const tableId: number = parseInt(req.params.id);
    const { userId, productIds } = req.body;

    try {
      const table = await this.assignUserToTableUseCase.run(tableId, userId, productIds);
      if (table) {
        res.status(200).send({
          status: "success",
          data: table,
        });
      } else {
        res.status(400).send({
          status: "error",
          message: "Failed to assign user to table",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({
          status: "error",
          message: "Error assigning user to table",
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
