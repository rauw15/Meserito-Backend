import { Request, Response } from "express";
import { GetAllTablesUseCase } from "../../application/GetAllTablesUseCase";

export class GetAllTablesController {
  constructor(private readonly getAllTablesUseCase: GetAllTablesUseCase) {}

  async run(req: Request, res: Response) {
    try {
      const tables = await this.getAllTablesUseCase.run();
      if (tables) {
        res.status(200).send({
          status: "success",
          data: tables,
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "No tables found",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({
          status: "error",
          message: "Error fetching tables",
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
