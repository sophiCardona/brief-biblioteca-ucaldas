import dotenv from "dotenv";
import { app } from "./interfaces/http/app";
import { service } from "./interfaces/http/routes";

dotenv.config();

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API corriendo en http://localhost:${port}`);
});

service.refreshLoanStatusesDaily();
setInterval(() => {
  try {
    service.refreshLoanStatusesDaily();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[Scheduler] Error actualizando préstamos:", error);
  }
}, 24 * 60 * 60 * 1000);
