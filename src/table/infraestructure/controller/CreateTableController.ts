import { Request, Response } from "express";
import { CreateTableUseCase } from "../../application/CreateTableUseCase";

export class CreateTableController {
  constructor(private readonly createTableUseCase: CreateTableUseCase) {}

  async run(req: Request, res: Response) {
    const { id, color, status, numberOfClients } = req.body;

    try {
      const table = await this.createTableUseCase.run(id, color, status, numberOfClients);
      if (table) {
        res.status(201).send({
          status: "success",
          data: table,
        });
      } else {
        res.status(400).send({
          status: "error",
          message: "Failed to create table",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({
          status: "error",
          message: "Error creating table",
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
