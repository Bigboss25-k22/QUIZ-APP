# Quiz Server - Spring Boot Backend

RESTful API backend cho ứng dụng Quiz App, được xây dựng với Spring Boot, Spring Security, và JWT authentication.

## Tech Stack

- **Spring Boot** 3.5.4
- **Spring Security** với JWT authentication
- **Spring Data JPA** với Hibernate
- **PostgreSQL** database
- **SpringDoc OpenAPI 3.0** (Swagger UI)
- **Lombok** để giảm boilerplate code
- **Bean Validation** cho input validation
- **jqwik** cho property-based testing

## Features

### Authentication & Security

- JWT access tokens (15 phút expiry)
- Refresh tokens (7 ngày expiry) với database storage
- BCrypt password hashing
- Role-based access control (USER, ADMIN)
- Secure endpoints với Spring Security

### Test Management

- CRUD operations cho tests và questions
- Pagination và filtering
- Category-based organization
- Search by title (case-insensitive)
- Automatic scoring system

### API Documentation

- Complete Swagger/OpenAPI documentation
- Interactive API testing với Swagger UI
- Request/response schemas
- Security requirements documentation

## Prerequisites

- Java 17 hoặc cao hơn
- Maven 3.6+
- PostgreSQL 12+

## Setup Instructions

### 1. Database Setup

Tạo PostgreSQL database:

```sql
CREATE DATABASE quizdb;
```

### 2. Environment Configuration

Tạo file `.env` trong thư mục `quizserver`:

```env
# Application
SPRING_APPLICATION_NAME=quizserver
SERVER_PORT=8082

# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/quizdb
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver

# JPA/Hibernate
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=true
SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
JWT_SECRET=your_secret_key_here_minimum_256_bits_for_production
ACCESS_TOKEN_EXPIRATION=900000
REFRESH_TOKEN_EXPIRATION=604800000
```

Hoặc cập nhật `src/main/resources/application.properties`:

```properties
spring.application.name=${SPRING_APPLICATION_NAME:quizserver}
server.port=${SERVER_PORT:8082}

# Database
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.datasource.driver-class-name=${SPRING_DATASOURCE_DRIVER_CLASS_NAME}

# JPA
spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:update}
spring.jpa.show-sql=${SPRING_JPA_SHOW_SQL:true}

# JWT
jwt.secret=${JWT_SECRET}
jwt.access.expiration=${ACCESS_TOKEN_EXPIRATION:900000}
jwt.refresh.expiration=${REFRESH_TOKEN_EXPIRATION:604800000}
```

### 3. Build & Run

```bash
# Build project
./mvnw clean install

# Run application
./mvnw spring-boot:run

# Hoặc với profile cụ thể
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Server sẽ chạy tại: `http://localhost:8082`

### 4. Access Swagger UI

Mở browser và truy cập:

```
http://localhost:8082/swagger-ui.html
```

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint            | Description                          | Auth Required |
| ------ | ------------------- | ------------------------------------ | ------------- |
| POST   | `/api/auth/signup`  | Đăng ký user mới                     | No            |
| POST   | `/api/auth/login`   | Đăng nhập                            | No            |
| POST   | `/api/auth/refresh` | Refresh access token                 | No            |
| POST   | `/api/auth/logout`  | Đăng xuất (invalidate refresh token) | No            |

### User Profile (`/api/users`)

| Method | Endpoint             | Description                 | Auth Required |
| ------ | -------------------- | --------------------------- | ------------- |
| GET    | `/api/users/profile` | Lấy thông tin user hiện tại | Yes           |
| PUT    | `/api/users/profile` | Cập nhật profile            | Yes           |

### Tests (`/api/test`)

| Method | Endpoint                          | Description                         | Auth Required |
| ------ | --------------------------------- | ----------------------------------- | ------------- |
| GET    | `/api/test`                       | Lấy danh sách tests (có pagination) | Yes           |
| GET    | `/api/test/{id}`                  | Lấy chi tiết test với questions     | Yes           |
| POST   | `/api/test/create`                | Tạo test mới                        | Yes           |
| POST   | `/api/test/question`              | Thêm question vào test              | Yes           |
| POST   | `/api/test/submit-test`           | Submit bài test                     | Yes           |
| GET    | `/api/test/test-results`          | Lấy tất cả kết quả                  | Yes           |
| GET    | `/api/test/test-results/{userId}` | Lấy kết quả theo user               | Yes           |

### Query Parameters cho Pagination

- `page` (default: 0) - Số trang (0-indexed)
- `size` (default: 10) - Số items mỗi trang
- `category` (optional) - Lọc theo category
- `search` (optional) - Tìm kiếm theo title

**Example:**

```
GET /api/test?page=0&size=10&category=Math&search=algebra
```

## Request/Response Examples

### Signup Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Login Response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

### Paginated Response

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

## Testing

### Run All Tests

```bash
./mvnw test
```

### Run Specific Test Class

```bash
./mvnw test -Dtest=AuthServiceTest
```

### Run with Coverage

```bash
./mvnw test jacoco:report
```

## Database Schema

### Main Tables

- `users` - User accounts
- `refresh_token` - Refresh token storage
- `test` - Quiz tests với category field
- `question` - Test questions
- `question_response` - User answers
- `test_result` - Test results với scoring

## Security Configuration

### CORS

Hiện tại cho phép tất cả origins (`*`). Trong production, cấu hình specific origins:

```java
@CrossOrigin(origins = "https://yourdomain.com")
```

### JWT Secret

Sử dụng secret key mạnh (minimum 256 bits) trong production. Generate bằng:

```bash
openssl rand -base64 32
```

### Password Hashing

BCrypt với strength 12 (default của Spring Security).

## Project Structure

```
quizserver/
├── src/main/java/com/quizserver/
│   ├── config/
│   │   ├── JwtFilter.java
│   │   ├── SecurityConfig.java
│   │   └── OpenApiConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   └── TestController.java
│   ├── dto/
│   │   ├── AuthResponse.java
│   │   ├── TokenResponse.java
│   │   ├── PageResponse.java
│   │   └── ...
│   ├── entities/
│   │   ├── User.java
│   │   ├── RefreshToken.java
│   │   ├── Test.java
│   │   └── ...
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── RefreshTokenRepository.java
│   │   └── ...
│   ├── services/
│   │   ├── auth/
│   │   │   ├── AuthService.java
│   │   │   ├── JwtUtil.java
│   │   │   └── RefreshTokenService.java
│   │   ├── test/
│   │   │   └── TestService.java
│   │   └── user/
│   │       └── UserService.java
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   └── ...
│   └── QuizserverApplication.java
└── src/main/resources/
    ├── application.properties
    ├── application-dev.properties
    └── db/migration/
        └── V1__add_category_to_test.sql
```

## Troubleshooting

### Database Connection Issues

```bash
# Kiểm tra PostgreSQL đang chạy
sudo systemctl status postgresql

# Kiểm tra connection
psql -U your_username -d quizdb
```

### Port Already in Use

```bash
# Tìm process đang dùng port 8082
lsof -i :8082

# Kill process
kill -9 <PID>
```

### JWT Token Issues

- Đảm bảo `JWT_SECRET` có độ dài đủ (minimum 256 bits)
- Kiểm tra token expiration settings
- Verify clock synchronization giữa client và server

## Development

### Hot Reload

Spring Boot DevTools đã được cấu hình. Code changes sẽ tự động reload.

### Database Migrations

Sử dụng Hibernate `ddl-auto=update` cho development. Trong production, sử dụng Flyway hoặc Liquibase.

### Adding New Endpoints

1. Tạo DTO trong `dto/`
2. Tạo entity trong `entities/`
3. Tạo repository trong `repository/`
4. Implement service trong `services/`
5. Tạo controller trong `controller/`
6. Thêm Swagger annotations

## Production Deployment

### Checklist

- [ ] Đổi `JWT_SECRET` thành random secure key
- [ ] Cấu hình specific CORS origins
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate`
- [ ] Enable HTTPS
- [ ] Configure database connection pooling
- [ ] Set up logging và monitoring
- [ ] Configure rate limiting
- [ ] Enable database backups

### Build Production JAR

```bash
./mvnw clean package -DskipTests
java -jar target/quizserver-0.0.1-SNAPSHOT.jar
```

### Docker Deployment

```bash
docker build -t quizserver .
docker run -p 8082:8082 --env-file .env quizserver
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License

## Support

Để được hỗ trợ, vui lòng:

- Mở issue trên GitHub
- Kiểm tra Swagger documentation tại `/swagger-ui.html`
- Xem logs trong console hoặc log files
