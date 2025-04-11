import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import authRoutes from "./routes/authRoutes.js";
import currencyRoutes from "./routes/currency.route.js";
import { prisma } from "./config/prismaClient.js";
import swaggerSetup from "./config/swagger.js";
import apiRateLimiter from "./middlewares/rateLimiter.js"
import { requestLogger } from "./utils/logger.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(apiRateLimiter);
app.use(requestLogger);
app.use(compression());


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/currency", currencyRoutes);

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500).json({
        status: "error",
        message: "something went wrong"
    })
})

swaggerSetup(app);

const connectToDatabase = async () => {
    try {
        await prisma.$connect();
        console.info("connected to database");

        app.listen(PORT, () => {
            console.info(`server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("error connecting to database", error.message);
        setTimeout(connectToDatabase, 5000)
        //process.exit(1);
    }
};

if (process.env.NODE_ENV !== "test") {
    connectToDatabase();
}
//connectToDatabase();
export default app;
