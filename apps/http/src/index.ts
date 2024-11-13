import express from "express";
import { router } from "./routes/v1";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json())

app.use("/api/v1", router)

app.listen(3001, () => console.log('Server running on port 3001'));
