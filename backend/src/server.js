import express from "express";
import cors from "cors";

import routes from "./routes/routes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use(errorMiddleware);

const PORT = 5000;

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});