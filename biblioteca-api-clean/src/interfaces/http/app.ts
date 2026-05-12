import express, { NextFunction, Request, Response } from "express";
import { AppError } from "../../core/errors";
import { router } from "./routes";

export const app = express();

app.use(express.json());
app.use(router);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    if (error.message.startsWith("{")) {
      res.status(error.statusCode).json(JSON.parse(error.message) as unknown);
      return;
    }

    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  res.status(500).json({ error: "Internal Server Error" });
});
