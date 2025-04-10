# Currency Conversion API

## Overview
The Currency Conversion API is a RESTful service that provides real-time and historical exchange rates, batch currency conversion, and user-specific favorite currency pairs. Built with **Express.js**, **PostgreSQL**, and **Prisma ORM**, it integrates with an external currency beacon service for accurate exchange rates.

## Features
- **Real-time currency conversion**
- **Historical exchange rate lookup**
- **Batch currency conversion**
- **Favorite currency pair management**
- **Authentication using Supabase**
- **Swagger API documentation**
- **Logging with Winston**
- **Comprehensive unit tests using vitest and supertest**

## Technologies Used
- **Backend Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Supabase
- **API Documentation:** Swagger
- **Testing Framework:** vitest
- **Logging:** Winston

## Project Structure
```
/project-root
  ├── /src
  │   ├── /config
  │   │   ├── prismaClient.js
  │   │   ├── swagger.js
  │   │   ├── supabase.js
  |   |   
  │   ├── /controllers
  |   |   ├── authController.js
  |   |   ├── currency.controller.js
  |   |
  │   ├── /middleware
  │   │   ├── authenticateSupabase.js
  │   │   ├── rateLimiter.js
  |   |
  │   ├── /docs
  │   │   ├── swaggerDocs.js
  │   │
  │   ├── /utils
  │   │   ├── logger.js
  │   │   ├── currencyCodes.js
  |   |   ├── currencyName.js
  |   |
  │   ├── /routes
  │   │   ├── authRoutes.js
  │   │   ├── currency.route.js
  │   │
  │   ├── /services
  │   │   ├── currencyBeacon.service.js
  │   │
  │   ├── /validators
  │   │   ├── auth.validator.js
  │   │   ├── currency.validator.js
  │   │
  │   ├── /tests
  │   │   ├── convertCurrency.test.js
  │   │   ├── currentCurrency.test.js
  │   │   ├── historicalExchangeRate.test.js
  |   |
  │   ├── index.js
  |   |
  ├── /prisma                # Prisma migrations and schema
  ├── /logs
  │   ├── app.log            # Log file
  │   ├── error.log
  ├── .env
  ├── .gitignore
  ├── package.json
  ├── package-lock.json
  ├── README.
  ├── vercel.json

```

## Installation

### Prerequisites
- Node.js (>=16)
- PostgreSQL database

### Steps
1. **Clone the repository**
   ```sh
   git clone https://github.com/robertGhandi/currency_converter.git
   cd currency_conversion
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file and add the following:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/currencydb
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   CURRENCY_API_KEY=your_currency_api_key
   ```

4. **Run database migrations**
   ```sh
   npx prisma migrate dev
   ```

5. **Start the server**
   ```sh
   npm start
   ```

## API Endpoints

### Authentication
| Method | Endpoint               | Description       |
|--------|------------------------|-------------------|
| POST   | `/api/v1/auth/signin`  | User login        |
| POST   | `/api/v1/auth/signup`  | User registration |

### Currency Conversion
| Method | Endpoint                         | Description                         |
|--------|----------------------------------|-------------------------------------|
| POST   | `/api/v1/currency/convert`       | Convert currency in real-time       |
| POST   | `/api/v1/currency/historical`    | Fetch historical exchange rates     |
| GET    | `/api/v1/currency/current-rate`  | Get current exchange rate           |
| POST   | `/api/v1/currency/batch-convert` | Perform batch currency conversions  |

### Favorite Currency Pairs
| Method | Endpoint                     | Description                        |
|--------|------------------------------|------------------------------------|
| POST   | `/api/v1/currency/favorite`  | Save a favorite currency pair      |
| GET    | `/api/v1/currency/favorite`  | Retrieve saved favorite pairs      |

## Running Tests
To run unit tests:
```sh
npm test
```

## API Documentation
Swagger API docs can be accessed at:
```
http://localhost:3000/api-docs
```

## Deployment
The API can be deployed on **Vercel** or **Railway**.

For Vercel:
```sh
vercel deploy
```

For Railway:
```sh
railway up
```

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m "Added new feature"`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request

## License
This project is licensed under the MIT License.

