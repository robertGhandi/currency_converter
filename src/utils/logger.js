import winston from "winston";
import { v4 as uuid } from "uuid";

const logFormat = winston.format.printf(
	({ timestamp, level, message, ...meta }) => {
		const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
		return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaString}`;
	}
);

const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json(),
		logFormat
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: "currency_converter/logs/app.log",
		}),
		new winston.transports.File({
			filename: "currency_converter/logs/error.log",
			level: "error",
		}),
	],
});

// Request logging middleware
export const requestLogger = (req, res, next) => {
	const requestId = uuid();
	req.requestId = requestId;

	logger.info("Incoming Request", {
		requestId,
		method: req.method,
		path: req.originalUrl || req.path,
		ip: req.ip,
		userAgent: req.get("User-Agent"),
	});

	next();
};

export default logger;
