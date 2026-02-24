# Design Document: Quiz App Refactoring (Phase 1)

## Overview

Phase 1 của Quiz App refactoring tập trung vào việc cải thiện authentication flow, token management, và frontend architecture. Thiết kế này giải quyết các vấn đề cốt lõi về cấu trúc code, bảo mật, và user experience.

### Key Design Goals

1. **Proper Authentication Architecture**: Tách biệt rõ ràng authentication logic khỏi user management
2. **Secure Token Management**: Implement JWT + Refresh Token flow với automatic token refresh
3. **Scalable Pagination**: Hỗ trợ phân trang cho danh sách tests và results
4. **Robust Frontend**: Centralized error handling, loading states, và protected routes
5. **Developer Experience**: API documentation với Swagger/OpenAPI
6. **Enhanced Search**: Category filtering và text search cho tests

### Technology Stack

**Backend:**

- Spring Boot 3.5.4
- Spring Security với JWT
- Spring Data JPA
- PostgreSQL
- Swagger/SpringDoc OpenAPI 3.0

**Frontend:**

- React 19
- Axios (thay thế fetch API)
- React Router v6
- TailwindCSS

## Architecture

### Backend Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Controllers Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │AuthController│  │UserController│  │TestController│  │
│  │  /api/auth   │  │  /api/users  │  │  /api/test   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼─────────┐
│         │      Services Layer                 │         │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌───────▼──────┐  │
│  │  AuthService │  │ UserService  │  │ TestService  │  │
│  │              │  │              │  │              │  │
│  │ - login      │  │ - getProfile │  │ - getTests   │  │
│  │ - signup     │  │ - update     │  │ - submitTest │  │
│  │ - refresh    │  │              │  │ - getResults │  │
│  │ - logout     │  │              │  │              │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼─────────┐
│         │    Repository Layer                 │         │
│  ┌──────▼──────────┐  ┌───▼──────────┐  ┌────▼──────┐  │
│  │RefreshTokenRepo │  │  UserRepo    │  │  TestRepo │  │
│  └─────────────────┘  └──────────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   PostgreSQL DB  │
                    └──────────────────┘
```

### Security Flow

```
┌──────────┐                                    ┌──────────┐
│  Client  │                                    │  Server  │
└────┬─────┘                                    └────┬─────┘
     │                                                │
     │  1. POST /api/auth/login                      │
     │  { email, password }                          │
     ├──────────────────────────────────────────────>│
     │                                                │
     │                                          ┌─────▼─────┐
     │                                          │ Validate  │
     │                                          │ Password  │
     │                                          └─────┬─────┘
     │                                                │
     │                                          ┌─────▼─────┐
     │                                          │ Generate  │
     │                                          │ JWT + RT  │
     │                                          └─────┬─────┘
     │                                                │
     │  2. Response:                                  │
     │  { accessToken, refreshToken, user }           │
     │<──────────────────────────────────────────────┤
     │                                                │
┌────▼─────┐                                         │
│  Store:  │                                         │
│ JWT: mem │                                         │
│ RT: cookie                                         │
└────┬─────┘                                         │
     │                                                │
     │  3. GET /api/test                             │
     │  Authorization: Bearer <JWT>                  │
     ├──────────────────────────────────────────────>│
     │                                                │
     │                                          ┌─────▼─────┐
     │                                          │ Validate  │
     │                                          │    JWT    │
     │                                          └─────┬─────┘
     │                                                │
     │  4. Response: { tests }                       │
     │<──────────────────────────────────────────────┤
     │                                                │
     │  ... JWT expires after 15 min ...             │
     │                                                │
     │  5. GET /api/test (JWT expired)               │
     │  Authorization: Bearer <expired JWT>          │
     ├──────────────────────────────────────────────>│
     │                                                │
     │  6. 401 Unauthorized                          │
     │<──────────────────────────────────────────────┤
     │                                                │
┌────▼─────┐                                         │
│ Axios    │                                         │
│Intercept │                                         │
└────┬─────┘                                         │
     │                                                │
     │  7. POST /api/auth/refresh                    │
     │  { refreshToken }                             │
     ├──────────────────────────────────────────────>│
     │                                                │
     │                                          ┌─────▼─────┐
     │                                          │ Validate  │
     │                                          │    RT     │
     │                                          └─────┬─────┘
     │                                                │
     │                                          ┌─────▼─────┐
     │                                          │ Generate  │
     │                                          │New JWT+RT │
     │                                          └─────┬─────┘
     │                                                │
     │  8. Response:                                  │
     │  { accessToken, refreshToken }                │
     │<──────────────────────────────────────────────┤
     │                                                │
┌────▼─────┐                                         │
│ Update   │                                         │
│  tokens  │                                         │
└────┬─────┘                                         │
     │                                                │
     │  9. Retry GET /api/test                       │
     │  Authorization: Bearer <new JWT>              │
     ├──────────────────────────────────────────────>│
     │                                                │
     │  10. Response: { tests }                      │
     │<──────────────────────────────────────────────┤
     │                                                │
```

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      App Component                       │
│                    (Error Boundary)                      │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   AuthProvider                           │
│  - user state                                            │
│  - JWT token (memory)                                    │
│  - login/logout functions                                │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   Router                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │Public Routes │  │Protected Rts │  │              │  │
│  │              │  │              │  │              │  │
│  │ - Login      │  │ - TestList   │  │              │  │
│  │ - Register   │  │ - TakeTest   │  │              │  │
│  │ - Home       │  │ - Results    │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   API Client (Axios)                     │
│  - Request interceptor (add JWT)                         │
│  - Response interceptor (handle 401, refresh token)      │
│  - Centralized error handling                            │
└─────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Backend Components

#### 1. AuthController

**Responsibility**: Handle authentication endpoints

**Endpoints**:

```java
POST   /api/auth/signup      - Register new user
POST   /api/auth/login       - Login user
POST   /api/auth/refresh     - Refresh JWT token
POST   /api/auth/logout      - Logout user (invalidate refresh token)
```

**Key Methods**:

```java
public class AuthController {

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request);

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request);

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@Valid @RequestBody RefreshRequest request);

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody LogoutRequest request);
}
```

#### 2. AuthService

**Responsibility**: Business logic for authentication

**Interface**:

```java
public interface AuthService {
    AuthResponse signup(SignupRequest request);
    AuthResponse login(LoginRequest request);
    TokenResponse refreshToken(String refreshToken);
    void logout(String refreshToken);
}
```

**Implementation Details**:

- Validate credentials using Spring Security's AuthenticationManager
- Generate JWT access token (15 min expiry)
- Generate refresh token (7 days expiry)
- Store refresh token in database with user association
- On refresh: validate refresh token, generate new JWT + new refresh token
- On logout: delete refresh token from database

#### 3. UserController

**Responsibility**: User profile management (moved from auth endpoints)

**Endpoints**:

```java
GET    /api/users/profile    - Get current user profile
PUT    /api/users/profile    - Update user profile
```

#### 4. TestController

**Responsibility**: Test management with pagination and search

**Updated Endpoints**:

```java
GET    /api/test?page=0&size=10&category=math&search=algebra
       - Get paginated tests with optional filters

GET    /api/test/{id}
       - Get test details with questions

POST   /api/test/submit-test
       - Submit test answers

GET    /api/test/test-results?page=0&size=10
       - Get paginated test results for current user
```

#### 5. RefreshTokenService

**Responsibility**: Manage refresh tokens lifecycle

**Interface**:

```java
public interface RefreshTokenService {
    RefreshToken createRefreshToken(User user);
    RefreshToken verifyRefreshToken(String token);
    void deleteByToken(String token);
    void deleteByUser(User user);
}
```

### Frontend Components

#### 1. AuthContext (Enhanced)

**Responsibility**: Manage authentication state and tokens

```typescript
interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateToken: (token: string) => void;
}
```

**Key Changes**:

- Store JWT in memory (state variable)
- Store refresh token in httpOnly cookie (set by backend)
- Provide updateToken method for axios interceptor

#### 2. ProtectedRoute Component

**Responsibility**: Wrap protected routes and redirect if not authenticated

```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

#### 3. ErrorBoundary Component

**Responsibility**: Catch React errors and display fallback UI

```typescript
class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console or monitoring service
    console.error('React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

#### 4. API Client (Axios)

**Responsibility**: Centralized HTTP client with interceptors

```typescript
// Request interceptor: Add JWT to headers
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken(); // from AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle 401 and refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { accessToken } = await refreshTokenAPI();
        updateToken(accessToken); // update in AuthContext
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        logout(); // logout and redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
```

#### 5. useApi Hook (Enhanced)

**Responsibility**: Provide consistent loading and error states

```typescript
function useApi<T>(apiFunction: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}
```

## Data Models

### Backend Entities

#### User Entity (Updated)

```java
@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @ToString.Exclude
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private RefreshToken refreshToken;
}
```

#### RefreshToken Entity (Updated)

```java
@Entity
@Data
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Instant expiryDate;

    @Column(nullable = false)
    private Instant createdAt;
}
```

#### Test Entity (Updated)

```java
@Entity
@Data
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Long time; // in minutes

    @Column(nullable = false)
    private String category; // NEW: for filtering

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL)
    private List<Question> questions;
}
```

### DTOs

#### AuthResponse DTO

```java
@Data
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private UserDTO user;
}
```

#### TokenResponse DTO

```java
@Data
public class TokenResponse {
    private String accessToken;
    private String refreshToken;
}
```

#### SignupRequest DTO

```java
@Data
public class SignupRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Name is required")
    private String name;
}
```

#### LoginRequest DTO

```java
@Data
public class LoginRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
```

#### PageResponse DTO (Generic)

```java
@Data
public class PageResponse<T> {
    private List<T> content;
    private int currentPage;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;
}
```

#### TestDTO (Updated)

```java
@Data
public class TestDTO {
    private Long id;
    private String title;
    private String description;
    private Long time;
    private String category; // NEW
}
```

### Frontend Types

```typescript
interface User {
  id: number;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface PageResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

interface Test {
  id: number;
  title: string;
  description: string;
  time: number;
  category: string;
}
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Login generates both tokens

_For any_ valid user credentials, when login is successful, the response should contain both a non-empty JWT access token and a non-empty refresh token.

**Validates: Requirements 2.1**

### Property 2: JWT token expiry is 15 minutes

_For any_ generated JWT access token, the expiry time extracted from the token should be exactly 15 minutes (900 seconds) from the issued time.

**Validates: Requirements 2.2**

### Property 3: Refresh token expiry is 7 days

_For any_ generated refresh token stored in database, the expiryDate field should be exactly 7 days (604800 seconds) from the createdAt time.

**Validates: Requirements 2.3**

### Property 4: Refresh token generates new tokens

_For any_ valid refresh token, when used to refresh, the response should contain both a new JWT access token and a new refresh token, and both should be different from the original tokens.

**Validates: Requirements 2.5**

### Property 5: Logout invalidates refresh token

_For any_ user with an active refresh token, after logout, querying the database for that refresh token should return null or the token should be marked as invalid.

**Validates: Requirements 2.6**

### Property 6: Pagination accepts valid parameters

_For any_ non-negative integer values for page and size parameters, the GET /api/tests endpoint should accept them and return a valid paginated response without error.

**Validates: Requirements 8.3**

### Property 7: Pagination response contains required metadata

_For any_ paginated request to GET /api/tests, the response should contain all required fields: content (array), currentPage, pageSize, totalElements, totalPages, and last (boolean).

**Validates: Requirements 8.4**

### Property 8: Pagination rejects negative parameters

_For any_ negative integer value for page or size parameter, the system should return HTTP 400 Bad Request with a validation error message.

**Validates: Requirements 8.6**

### Property 9: API client handles HTTP errors consistently

_For any_ API call that returns HTTP error codes 401, 403, 404, or 500, the API client should handle them through the centralized error handler and provide consistent error objects with status code and message.

**Validates: Requirements 9.2**

### Property 10: Unauthenticated access redirects to login

_For any_ protected route, when accessed by an unauthenticated user (no valid JWT token), the system should redirect to the /login page.

**Validates: Requirements 9.8**

### Property 11: Authenticated requests include JWT header

_For any_ API request made through the authenticated API client, the request headers should include an Authorization header with format "Bearer <token>".

**Validates: Requirements 10.1**

### Property 12: Automatic token refresh and retry flow

_For any_ authenticated API request that receives a 401 response due to expired JWT, the system should automatically call the refresh token endpoint, obtain new tokens, update the stored token, and retry the original request with the new JWT token.

**Validates: Requirements 10.2, 10.3**

### Property 13: Failed refresh triggers logout

_For any_ token refresh attempt that fails (refresh token expired or invalid), the system should logout the user (clear auth state) and redirect to the login page.

**Validates: Requirements 10.4**

### Property 14: Session persistence with valid refresh token

_For any_ user session where the refresh token is still valid, after closing and reopening the browser, if the refresh token is available, the system should be able to restore the session by obtaining a new JWT token.

**Validates: Requirements 10.7**

### Property 15: Protected endpoints documented with auth requirements

_For any_ endpoint that requires authentication (protected by JWT), the Swagger documentation should indicate the security requirement (e.g., "bearerAuth" or "JWT").

**Validates: Requirements 11.4**

### Property 16: Category filter returns matching tests

_For any_ category filter value, all tests returned by GET /api/tests?category=X should have their category field equal to X.

**Validates: Requirements 13.4**

### Property 17: Search query returns matching tests

_For any_ search query string, all tests returned by GET /api/tests?search=Y should have titles that contain Y (case-insensitive match).

**Validates: Requirements 13.5**

### Property 18: Combined filters return tests matching both criteria

_For any_ combination of category filter and search query, all tests returned by GET /api/tests?category=X&search=Y should have category equal to X AND title containing Y (case-insensitive).

**Validates: Requirements 13.6**

## Error Handling

### Backend Error Handling

**GlobalExceptionHandler** will handle:

1. **ValidationException** (400 Bad Request)
   - Triggered by @Valid annotation failures
   - Returns field-specific error messages
2. **UnauthorizedException** (401 Unauthorized)
   - Invalid credentials
   - Expired or invalid JWT token
   - Missing authentication
3. **ForbiddenException** (403 Forbidden)
   - User lacks required role/permissions
4. **ResourceNotFoundException** (404 Not Found)
   - Test, User, or other entity not found
5. **BadRequestException** (400 Bad Request)
   - Invalid refresh token
   - Malformed request data
6. **InternalServerError** (500 Internal Server Error)
   - Unexpected exceptions
   - Database errors

**Error Response Format**:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/auth/signup",
  "errors": [
    {
      "field": "email",
      "message": "Email must be valid"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### Frontend Error Handling

**Axios Interceptor Error Handler**:

```typescript
const errorHandler = (error: AxiosError) => {
  const status = error.response?.status;

  switch (status) {
    case 401:
      // Handled by refresh token interceptor
      break;

    case 403:
      showNotification(
        "You do not have permission to access this resource",
        "error",
      );
      break;

    case 404:
      showNotification("Resource not found", "error");
      break;

    case 500:
      showNotification("Server error. Please try again later", "error");
      break;

    default:
      const message = error.response?.data?.message || "An error occurred";
      showNotification(message, "error");
  }

  return Promise.reject(error);
};
```

**Error Boundary**:

- Catches React component errors
- Displays user-friendly error page
- Logs error details for debugging
- Provides "Reload" button to recover

## Testing Strategy

### Dual Testing Approach

This project will use both unit tests and property-based tests as complementary testing strategies:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Together, they provide comprehensive coverage where unit tests catch concrete bugs and property tests verify general correctness.

### Backend Testing

**Framework**: JUnit 5 + Mockito + Spring Boot Test

**Unit Tests**:

- AuthService: Test specific login/signup scenarios
- RefreshTokenService: Test token creation and validation
- TestService: Test pagination with specific page numbers
- Error handling: Test specific error conditions

**Property-Based Tests**:

- Use **jqwik** library for property-based testing in Java
- Minimum 100 iterations per property test
- Each test tagged with: `@Tag("Feature: quiz-app-refactoring, Property N: <property_text>")`

**Example Property Test**:

```java
@Property
@Tag("Feature: quiz-app-refactoring, Property 2: JWT token expiry is 15 minutes")
void jwtTokenExpiryIs15Minutes(@ForAll("validUsers") User user) {
    String token = jwtUtil.generateAccessToken(user);
    Claims claims = jwtUtil.extractClaims(token);

    long issuedAt = claims.getIssuedAt().getTime();
    long expiry = claims.getExpiration().getTime();
    long diffInSeconds = (expiry - issuedAt) / 1000;

    assertThat(diffInSeconds).isEqualTo(900); // 15 minutes
}
```

### Frontend Testing

**Framework**: Vitest + React Testing Library

**Unit Tests**:

- AuthContext: Test login/logout functions
- ProtectedRoute: Test redirect behavior
- API client: Test specific error scenarios
- Components: Test rendering and user interactions

**Property-Based Tests**:

- Use **fast-check** library for property-based testing in TypeScript
- Minimum 100 iterations per property test
- Each test tagged with comment: `// Feature: quiz-app-refactoring, Property N: <property_text>`

**Example Property Test**:

```typescript
// Feature: quiz-app-refactoring, Property 11: Authenticated requests include JWT header
test("authenticated requests include JWT header", () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 20 }), // arbitrary JWT token
      fc.string(), // arbitrary API path
      (token, path) => {
        const config = addAuthHeader({ url: path }, token);
        expect(config.headers.Authorization).toBe(`Bearer ${token}`);
      },
    ),
    { numRuns: 100 },
  );
});
```

### Integration Tests

**Backend**:

- Test complete auth flow: signup → login → access protected endpoint → refresh → logout
- Test pagination with database
- Test search and filter with actual data

**Frontend**:

- Test complete user journey: login → view tests → take test → view results
- Test token refresh flow with mock API
- Test error boundary with intentional errors

### Test Coverage Goals

- Backend service layer: Minimum 70% code coverage
- Frontend critical paths: Minimum 60% code coverage
- All correctness properties: 100% implemented as property tests

## API Documentation

### Swagger/OpenAPI Configuration

**Dependencies** (pom.xml):

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

**Configuration**:

```java
@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Quiz App API")
                .version("1.0")
                .description("Quiz application REST API documentation"))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            .components(new Components()
                .addSecuritySchemes("bearerAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
    }
}
```

**Controller Documentation Example**:

```java
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController {

    @Operation(
        summary = "User login",
        description = "Authenticate user and return JWT tokens"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful",
            content = @Content(schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "401", description = "Invalid credentials",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
        @Valid @RequestBody LoginRequest request
    ) {
        // implementation
    }
}
```

**Access**: http://localhost:8080/swagger-ui.html

### API Endpoints Summary

**Authentication** (`/api/auth`):

- `POST /signup` - Register new user
- `POST /login` - Login user
- `POST /refresh` - Refresh JWT token
- `POST /logout` - Logout user

**User Profile** (`/api/users`):

- `GET /profile` - Get current user profile (requires auth)
- `PUT /profile` - Update user profile (requires auth)

**Tests** (`/api/test`):

- `GET /` - Get paginated tests with optional filters (requires auth)
- `GET /{id}` - Get test details with questions (requires auth)
- `POST /submit-test` - Submit test answers (requires auth)
- `GET /test-results` - Get user's test results paginated (requires auth)

## Implementation Notes

### Migration Strategy

1. **Phase 1: Backend Auth Restructure**
   - Create AuthService and move logic from UserService
   - Create new AuthController endpoints
   - Keep old UserController endpoints temporarily for backward compatibility
   - Update frontend to use new endpoints
   - Remove old endpoints after frontend migration

2. **Phase 2: Token Management**
   - Implement RefreshTokenService
   - Update login to return both tokens
   - Add refresh endpoint
   - Add logout endpoint

3. **Phase 3: Frontend Token Management**
   - Install axios
   - Create axios instance with interceptors
   - Update AuthContext to manage tokens
   - Implement automatic token refresh
   - Test token refresh flow

4. **Phase 4: Pagination & Search**
   - Add category field to Test entity (database migration)
   - Update TestRepository with pagination and search methods
   - Update TestController endpoints
   - Update frontend to use pagination

5. **Phase 5: Documentation & Testing**
   - Add Swagger dependencies and configuration
   - Document all endpoints
   - Write property-based tests
   - Write unit tests

### Database Migration

**Add category to Test table**:

```sql
ALTER TABLE test ADD COLUMN category VARCHAR(255) NOT NULL DEFAULT 'General';
```

### Security Considerations

1. **JWT Secret**: Use strong random secret (minimum 256 bits)
2. **Refresh Token**: Store securely in database, use UUID for token value
3. **Password**: Already using BCrypt, ensure strength 12
4. **CORS**: Configure allowed origins in production (not "\*")
5. **HTTPS**: Enforce HTTPS in production for token transmission
6. **HttpOnly Cookies**: Consider using httpOnly cookies for refresh token instead of response body

### Performance Considerations

1. **Pagination**: Default page size of 10 prevents large data transfers
2. **Database Indexing**: Add index on Test.category for faster filtering
3. **JWT Validation**: Cache user details to avoid database lookup on every request
4. **Refresh Token Cleanup**: Implement scheduled job to delete expired refresh tokens

### Future Enhancements (Out of Scope for Phase 1)

- Role-based access control (ADMIN role)
- Admin panel for test management
- Input validation with detailed error messages
- Rate limiting
- Account lockout mechanism
- Audit fields (createdAt, updatedAt) on all entities
- Logging strategy
- Configuration management with profiles
