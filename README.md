# Quiz Application

A full-stack quiz application built with React (frontend) and Spring Boot (backend) that allows users to create, take, and review quizzes.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (registration, login, logout)
- JWT-based authentication with refresh tokens
- Create and manage quizzes
- Take quizzes with multiple choice questions
- View test results and performance statistics
- Responsive UI with dark/light theme toggle
- Protected routes for authenticated users
- Error handling and notifications
- RESTful API with OpenAPI/Swagger documentation

## Technology Stack

### Frontend

- React 19.1.0
- Vite 6.3.5
- React Router DOM 7.8.1
- Tailwind CSS 4.0.0
- Axios for HTTP requests
- Radix UI components
- Lucide React icons

### Backend

- Spring Boot 3.5.4
- Java 17
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT (JSON Web Tokens)
- SpringDoc OpenAPI (Swagger)
- Lombok
- Maven

### Testing

- Vitest (Frontend)
- JUnit 5 (Backend)
- Testing Library
- jqwik (Property-based testing)

## Project Structure

```
QUIZ-APP/
├── quiz-app/                 # React frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── app/             # App layout components
│   │   ├── assets/          # Images and icons
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities and API calls
│   │   ├── pages/           # Page components
│   │   └── test/            # Test files
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── quizserver/              # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/quizserver/
│   │       │   ├── config/     # Security and JWT configuration
│   │       │   ├── controller/ # REST controllers
│   │       │   ├── dto/        # Data transfer objects
│   │       │   ├── entities/   # JPA entities
│   │       │   ├── enums/      # Enumerations
│   │       │   ├── exception/  # Exception handling
│   │       │   ├── repository/ # JPA repositories
│   │       │   └── services/   # Business logic
│   │       └── resources/
│   │           ├── db/migration/ # Flyway migrations
│   │           └── application.properties
│   ├── Dockerfile
│   ├── .env
│   └── pom.xml
└── README.md
```

## Prerequisites

- Node.js 18+ (for frontend)
- Java 17+ (for backend)
- Maven 3.6+ (for backend)
- PostgreSQL 13+ (for database)
- Docker and Docker Compose (optional, for containerized deployment)

## Installation

### Frontend

1. Navigate to the frontend directory:

```bash
cd quiz-app
```

2. Install dependencies:

```bash
npm install
```

### Backend

1. Navigate to the backend directory:

```bash
cd quizserver
```

2. Install dependencies and build:

```bash
mvn clean install
```

## Configuration

### Database Configuration

1. Create a PostgreSQL database for the application.

2. Configure the database connection in `quizserver/.env`:

```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/quiz_db
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
```

### JWT Configuration

Configure JWT settings in `quizserver/.env`:

```properties
JWT_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRATION=900000  # 15 minutes
REFRESH_TOKEN_EXPIRATION=604800000  # 7 days
```

### Frontend API Configuration

Update the API base URL in `quiz-app/src/lib/axiosInstance.js` to point to your backend server.

## Running the Application

### Frontend

1. Navigate to the frontend directory:

```bash
cd quiz-app
```

2. Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend

1. Navigate to the backend directory:

```bash
cd quizserver
```

2. Run the application:

```bash
mvn spring-boot:run
```

The backend API will be available at `http://localhost:8082`

## Docker Deployment

### Using Docker Compose (Recommended)

1. Create a `docker-compose.yml` file in the root directory:

```yaml
version: "3.8"

services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: quiz_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./quizserver
    ports:
      - "8082:8082"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/quiz_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: password
    depends_on:
      - db

  frontend:
    build: ./quiz-app
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

2. Run the application:

```bash
docker-compose up -d
```

### Building Individual Docker Images

#### Frontend

```bash
cd quiz-app
docker build -t quiz-app .
```

#### Backend

```bash
cd quizserver
docker build -t quiz-server .
```

## API Documentation

Once the backend is running, you can access the Swagger UI at:
`http://localhost:8082/swagger-ui.html`

## Testing

### Frontend Tests

Run the frontend tests:

```bash
cd quiz-app
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

### Backend Tests

Run the backend tests:

```bash
cd quizserver
mvn test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
