import 'dotenv';
import express from 'express';
import cors from "cors"
import Config from "./config/config.ts"
import DB from './config/db.ts';

const app = express();
const port = Config.port;

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3000'],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowHeader: ["Content-Type", "Authorization"],
  credentials: true
}
app.use(cors(corsOptions));
app.options('/api', cors(corsOptions));
app.disable('x-powred-by');
app.use(express.json());
DB.getInstance();

app.use((err: any, res: express.Response) => {
  console.error(err);
  const status: number = err.status || 500;
  res.status(status).json({ message: err })
})
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
})
