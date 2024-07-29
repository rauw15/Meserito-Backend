import { Request, Response } from "express";
import { GetByIdTableUseCase } from "../../application/GetByIdTableUseCase";

export class GetByIdTableController {
  constructor(private readonly getByIdTableUseCase: GetByIdTableUseCase) {}

  async run(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const table = await this.getByIdTableUseCase.run(id);
      if (table) {
        res.status(200).send({
          status: "success",
          data: table,
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "Table not found",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({
          status: "error",
          message: "Error fetching table",
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
