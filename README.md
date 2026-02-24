# Quiz App - Phase 1 Refactoring

A full-stack quiz application with Spring Boot backend and React frontend, featuring JWT authentication, pagination, and search functionality.

## Features

### Phase 1 (Completed)

- ✅ JWT + Refresh Token authentication
- ✅ Automatic token refresh with axios interceptors
- ✅ Protected routes with authentication
- ✅ Pagination for tests and results
- ✅ Category filtering and search
- ✅ Swagger/OpenAPI documentation
- ✅ Error boundary for React errors
- ✅ Session persistence across browser sessions

## Tech Stack

### Backend

- Spring Boot 3.5.4
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Swagger/SpringDoc OpenAPI 3.0

### Frontend

- React 19
- Axios for HTTP requests
- React Router v6
- TailwindCSS
- Vite

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user (returns access token + refresh token)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user (invalidate refresh token)

### User Profile (`/api/users`)

- `GET /api/users/profile` - Get current user profile (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)

### Tests (`/api/test`)

- `GET /api/test?page=0&size=10&category=Math&search=algebra` - Get paginated tests with filters (requires auth)
- `GET /api/test/{id}` - Get test details with questions (requires auth)
- `POST /api/test/submit-test` - Submit test answers (requires auth)
- `GET /api/test/test-results` - Get all test results (requires auth)
- `GET /api/test/test-results/{userId}` - Get test results by user (requires auth)

### Pagination Parameters

- `page` (default: 0) - Page number (0-indexed)
- `size` (default: 10) - Number of items per page
- `category` (optional) - Filter by test category
- `search` (optional) - Search by test title (case-insensitive)

### Response Format for Paginated Endpoints

```json
{
  "content": [...],
  "currentPage": 0,
  "pageSize": 10,
  "totalElements": 50,
  "totalPages": 5,
  "last": false
}
```

## Setup Instructions

### Backend Setup

1. **Prerequisites**
   - Java 17 or higher
   - PostgreSQL database
   - Maven

2. **Environment Variables**
   Create a `.env` file in the `quizserver` directory:

   ```env
   SPRING_APPLICATION_NAME=quizserver
   SERVER_PORT=8082

   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/quizdb
   SPRING_DATASOURCE_USERNAME=your_username
   SPRING_DATASOURCE_PASSWORD=your_password
   SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver

   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   SPRING_JPA_SHOW_SQL=true

   # JWT Configuration
   JWT_SECRET=your_secret_key_here_minimum_256_bits
   ACCESS_TOKEN_EXPIRATION=900000  # 15 minutes
   REFRESH_TOKEN_EXPIRATION=604800000  # 7 days
   ```

3. **Database Migration**
   The application uses Hibernate's `ddl-auto=update` to automatically create/update tables.

   For manual migration, run:

   ```sql
   ALTER TABLE test ADD COLUMN IF NOT EXISTS category VARCHAR(255) NOT NULL DEFAULT 'General';
   CREATE INDEX IF NOT EXISTS idx_test_category ON test(category);
   ```

4. **Run Backend**

   ```bash
   cd quizserver
   ./mvnw spring-boot:run
   ```

5. **Access Swagger Documentation**
   Open browser: http://localhost:8082/swagger-ui.html

### Frontend Setup

1. **Prerequisites**
   - Node.js 16 or higher
   - npm or yarn

2. **Install Dependencies**

   ```bash
   cd quiz-app
   npm install
   ```

3. **Environment Variables**
   The frontend is configured to connect to `http://localhost:8082` by default.

   To change the API URL, update `quiz-app/src/lib/axiosInstance.js`:

   ```javascript
   const axiosInstance = axios.create({
     baseURL: "http://your-api-url",
     // ...
   });
   ```

4. **Run Frontend**

   ```bash
   npm run dev
   ```

   Open browser: http://localhost:5173

## Authentication Flow

1. **Login**
   - User submits email and password
   - Backend validates credentials
   - Returns `accessToken` (15 min expiry) and `refreshToken` (7 days expiry)
   - Frontend stores `accessToken` in memory and `refreshToken` in localStorage

2. **Authenticated Requests**
   - Axios interceptor automatically adds `Authorization: Bearer <accessToken>` header
   - If token is valid, request proceeds normally

3. **Token Refresh**
   - When `accessToken` expires, API returns 401
   - Axios interceptor catches 401 error
   - Automatically calls `/api/auth/refresh` with `refreshToken`
   - Receives new `accessToken` and `refreshToken`
   - Retries original request with new token

4. **Logout**
   - User clicks logout
   - Frontend calls `/api/auth/logout` to invalidate refresh token
   - Clears all tokens and redirects to login

5. **Session Persistence**
   - On app load, if `refreshToken` exists but no `accessToken`
   - Automatically calls `/api/auth/refresh` to restore session
   - Fetches user profile and restores authentication state

## Project Structure

```
quiz-app/
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.jsx       # React error boundary
│   │   ├── ProtectedRoute.jsx      # Route protection wrapper
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.jsx         # Authentication state management
│   ├── lib/
│   │   ├── axiosInstance.js        # Axios with interceptors
│   │   └── api/
│   │       ├── auth.js             # Auth API functions
│   │       └── quiz.js             # Quiz API functions
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── TestListPage.jsx        # With pagination & filters
│   │   └── ...
│   └── App.jsx

quizserver/
├── src/main/java/com/quizserver/
│   ├── controller/
│   │   ├── AuthController.java     # Auth endpoints
│   │   ├── UserController.java     # User profile endpoints
│   │   └── TestController.java     # Test endpoints with pagination
│   ├── services/
│   │   ├── auth/
│   │   │   ├── AuthService.java
│   │   │   └── RefreshTokenService.java
│   │   └── test/
│   │       └── TestService.java
│   ├── dto/
│   │   ├── AuthResponse.java
│   │   ├── TokenResponse.java
│   │   ├── PageResponse.java       # Generic pagination DTO
│   │   └── ...
│   ├── entities/
│   │   ├── User.java
│   │   ├── Test.java               # With category field
│   │   ├── RefreshToken.java
│   │   └── ...
│   └── repository/
│       ├── TestRepository.java     # With pagination methods
│       └── ...
└── src/main/resources/
    ├── application.properties
    └── db/migration/
        └── V1__add_category_to_test.sql
```

## Testing

### Backend Tests

```bash
cd quizserver
./mvnw test
```

### Frontend Tests

```bash
cd quiz-app
npm test
```

## Security Considerations

1. **JWT Secret**: Use a strong random secret (minimum 256 bits) in production
2. **HTTPS**: Always use HTTPS in production for secure token transmission
3. **CORS**: Configure specific allowed origins instead of "\*" in production
4. **Refresh Token**: Stored in localStorage (consider httpOnly cookies for enhanced security)
5. **Password**: Hashed with BCrypt (strength 12)

## Future Enhancements (Phase 2+)

- Role-based access control (ADMIN role)
- Admin panel for test management
- Rate limiting
- Account lockout mechanism
- Audit fields (createdAt, updatedAt)
- Email verification
- Password reset functionality
- Test analytics and statistics

## License

MIT

## Contributors

- Backend: Spring Boot Team
- Frontend: React Team
