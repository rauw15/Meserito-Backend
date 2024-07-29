import { Request, Response } from "express";
import { SeparateBillUseCase } from "../../application/SeparateBillsUseCase";

export class SeparateBillController {
  constructor(private readonly separateBillUseCase: SeparateBillUseCase) {}

  async run(req: Request, res: Response) {
    const tableId: number = parseInt(req.params.id);

    try {
      const result = await this.separateBillUseCase.run(tableId);
      if (result) {
        res.status(200).send({
          status: "success",
          message: "Bill separated successfully",
        });
      } else {
        res.status(400).send({
          status: "error",
          message: "Failed to separate bill",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({
          status: "error",
          message: "Error separating bill",
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
