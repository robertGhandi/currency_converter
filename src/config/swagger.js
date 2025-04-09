import swaggerUi from "swagger-ui-express";
import swaggerDocs from "../docs/swaggerDocs.js";

const swaggerSetup = (app) => {
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default swaggerSetup;
