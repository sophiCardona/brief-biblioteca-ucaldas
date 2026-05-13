import dotenv from "dotenv";
import { app } from "./interfaces/http/app";

dotenv.config();

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API corriendo en http://localhost:${port}`);
});
