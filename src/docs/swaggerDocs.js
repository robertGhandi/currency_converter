const swaggerJSDoc = {
    openapi: "3.0.0",
    info: {
        title: "Currency Converter API",
        version: "1.0.0",
        description: "API for currency conversion, current rates, historical exchange rates, and favorite currency pairs",
    },
    servers: [
        {
            url: "http://localhost:3000/",
            description: "Local development server",
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    security: [{ BearerAuth: [] }],
    paths: {
        "/api/v1/auth/signup": {
            post: {
                summary: "User Signup",
                description: "Registers a new user",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", example: "user@example.com" },
                                    first_name: { type: "string", example: "John" },
                                    last_name: { type: "string", example: "Doe" },
                                    password: { type: "string", example: "StrongPassword123" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: "User created successfully" },
                    400: { description: "Missing or invalid fields" },
                    409: { description: "User already exists" },
                    500: { description: "Internal server error" },
                },
            },
        },
        "/api/v1/auth/signin": {
            post: {
                summary: "User Signin",
                description: "Authenticates a user",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", example: "user@example.com" },
                                    password: { type: "string", example: "StrongPassword123" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: "Signin successful" },
                    400: { description: "Missing or invalid fields" },
                    401: { description: "Unauthorized: Invalid credentials" },
                    403: { description: "Forbidden" },
                    500: { description: "Internal server error" },
                },
            },
        },
        "/api/v1/currency/convert": {
            post: {
                summary: "Convert currency",
                description: "Converts an amount from one currency to another.",
                tags: ["Currency"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    base: { type: "string", example: "USD" },
                                    target: { type: "string", example: "EUR" },
                                    amount: { type: "number", example: 100 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: "Currency conversion successful" },
                    400: { description: "Missing required fields" },
                    500: { description: "Internal server error" },
                },
            },
        },
        "/api/v1/currency/historical": {
            post: {
                summary: "Get historical exchange rates",
                description: "Fetches historical exchange rates for a given time range.",
                tags: ["Currency"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    base: { type: "string", example: "USD" },
                                    target: { type: "string", example: "EUR" },
                                    start_date: { type: "string", example: "2024-03-01" },
                                    end_date: { type: "string", example: "2024-03-07" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: "Historical exchange rate fetched successfully" },
                    400: { description: "Missing required fields" },
                    500: { description: "Internal server error" },
                },
            },
        },
        "/api/v1/currency/current-rate": {
            get: {
                summary: "Get current exchange rate",
                description: "Fetches the current exchange rate between two currencies.",
                tags: ["Currency"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    base: { type: "string", example: "USD" },
                                    target: { type: "string", example: "EUR" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: "Successfully fetched exchange rate" },
                    400: { description: "Missing required fields" },
                    500: { description: "Internal server error" },
                },
            },
        },
        "/api/v1/currency/favorite": {
            post: {
                summary: "Save favorite currency pairs",
                description: "Saves favorite currency pairs",
                tags: ["Currency"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    base: { type: "string", example: "USD" },
                                    target: { type: "string", example: "EUR" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: "Successfully saved currency pairs" },
                    400: { description: "Missing required fields" },
                    500: { description: "Internal server error" },
                },
            },
        },
        "/api/v1/currency/favorite": {
            get: {
                summary: "Retrieve favorite currency pairs",
                description: "Fetch favorite currency pairs",
                tags: ["Currency"],
                security: [{ BearerAuth: [] }],
                
                responses: {
                    200: { description: "Successfully saved currency pairs" },
                    400: { description: "Missing required fields" },
                    500: { description: "Internal server error" },
                },
            },
        },
    },
};

export default swaggerJSDoc;
