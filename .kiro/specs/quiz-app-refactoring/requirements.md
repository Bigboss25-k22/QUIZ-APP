# Requirements Document: Quiz App Refactoring (Phase 1)

## Introduction

Dự án Quiz App hiện tại là một ứng dụng trắc nghiệm online với backend Spring Boot và frontend React. Phase 1 của refactoring tập trung vào việc cải thiện authentication flow, token management, pagination, frontend architecture, API documentation, và search functionality. Đây là những vấn đề cốt lõi cần được giải quyết trước để tạo nền tảng vững chắc cho các phase tiếp theo.

## Glossary

- **System**: Toàn bộ ứng dụng Quiz App bao gồm backend và frontend
- **Backend**: Spring Boot REST API server
- **Frontend**: React single-page application
- **Auth_Service**: Service xử lý authentication và authorization
- **User_Service**: Service quản lý thông tin người dùng
- **Test_Service**: Service quản lý tests/quizzes
- **Admin_Panel**: Giao diện quản trị cho admin users
- **JWT_Token**: JSON Web Token dùng cho authentication
- **Refresh_Token**: Token dùng để làm mới JWT token
- **Protected_Route**: Route yêu cầu authentication
- **RBAC**: Role-Based Access Control
- **DTO**: Data Transfer Object
- **Entity**: JPA entity class
- **API_Client**: Frontend HTTP client để gọi backend APIs
- **Validation**: Kiểm tra tính hợp lệ của dữ liệu đầu vào
- **Exception_Handler**: Component xử lý exceptions tập trung
- **Audit_Fields**: Các trường timestamp (createdAt, updatedAt) trong entities
- **Pagination**: Phân trang dữ liệu
- **Rate_Limiting**: Giới hạn số lượng requests trong khoảng thời gian

## Requirements

### Requirement 1: Backend Authentication Structure Reorganization

**User Story:** Là một developer, tôi muốn cấu trúc authentication được tổ chức đúng đắn, để code dễ bảo trì và mở rộng.

#### Acceptance Criteria

1. THE Backend SHALL move all authentication endpoints from UserController to AuthController
2. THE AuthController SHALL handle login, signup, logout, and token refresh endpoints at /api/auth
3. THE UserController SHALL only handle user profile management endpoints at /api/users
4. WHEN authentication logic is moved, THE System SHALL maintain backward compatibility with existing frontend code
5. THE Backend SHALL remove all unused imports and dependencies from controllers

### Requirement 2: JWT and Refresh Token Implementation

**User Story:** Là một user, tôi muốn session của mình được duy trì an toàn và tự động làm mới, để không phải đăng nhập lại thường xuyên.

#### Acceptance Criteria

1. WHEN a user logs in successfully, THE Auth_Service SHALL generate both JWT access token and refresh token
2. THE JWT_Token SHALL have expiry time of 15 minutes
3. THE Refresh_Token SHALL have expiry time of 7 days
4. WHEN JWT token expires, THE Frontend SHALL automatically use refresh token to obtain new JWT token
5. WHEN refresh token is used, THE Auth_Service SHALL generate new JWT token and new refresh token
6. WHEN user logs out, THE Auth_Service SHALL invalidate the refresh token in database
7. THE RefreshToken entity SHALL be properly utilized with user relationship and expiry tracking

### Requirement 8: Pagination Implementation

**User Story:** Là một user, tôi muốn danh sách tests và results được phân trang, để tải trang nhanh hơn khi có nhiều dữ liệu.

#### Acceptance Criteria

1. THE Backend SHALL implement pagination for GET /api/tests endpoint
2. THE Backend SHALL implement pagination for GET /api/admin/results endpoint
3. WHEN pagination is requested, THE System SHALL accept page and size query parameters
4. THE Backend SHALL return page metadata including totalElements, totalPages, currentPage, and pageSize
5. THE Backend SHALL default to page 0 and size 10 when parameters are not provided
6. THE Backend SHALL validate page and size parameters are non-negative integers

### Requirement 9: Frontend Architecture Improvements

**User Story:** Là một frontend developer, tôi muốn cấu trúc frontend được tổ chức tốt hơn, để dễ maintain và scale.

#### Acceptance Criteria

1. THE Frontend SHALL implement centralized error handling in API client
2. WHEN API call fails, THE API_Client SHALL handle common HTTP errors (401, 403, 404, 500) consistently
3. THE Frontend SHALL implement error boundary components to catch React errors
4. THE Frontend SHALL implement loading states consistently across all pages
5. THE AuthContext SHALL manage both user data and JWT tokens
6. THE Frontend SHALL store JWT token in memory and refresh token in httpOnly cookie or secure storage
7. THE Frontend SHALL implement protected route wrapper component
8. WHEN unauthenticated user accesses protected route, THE System SHALL redirect to login page

### Requirement 10: Token Management in Frontend

**User Story:** Là một user, tôi muốn authentication tokens được quản lý an toàn, để tài khoản của tôi không bị đánh cắp.

#### Acceptance Criteria

1. THE Frontend SHALL include JWT token in Authorization header for all authenticated requests
2. WHEN JWT token expires (401 response), THE Frontend SHALL automatically call refresh token endpoint
3. WHEN refresh succeeds, THE Frontend SHALL retry the original failed request with new token
4. WHEN refresh fails, THE Frontend SHALL logout user and redirect to login page
5. THE Frontend SHALL implement axios interceptors for automatic token refresh
6. THE Frontend SHALL not store JWT token in localStorage
7. WHEN user closes browser, THE System SHALL maintain session if refresh token is valid

### Requirement 11: API Documentation

**User Story:** Là một developer, tôi muốn có API documentation tự động, để dễ dàng hiểu và sử dụng các endpoints.

#### Acceptance Criteria

1. THE Backend SHALL integrate Swagger/OpenAPI 3.0
2. THE Backend SHALL expose API documentation at /swagger-ui.html
3. THE Backend SHALL document all endpoints with descriptions, parameters, and response schemas
4. THE Backend SHALL document authentication requirements for protected endpoints
5. THE Backend SHALL include example requests and responses in documentation
6. THE Backend SHALL group endpoints by controller tags (Auth, User, Test, Admin)

### Requirement 13: Test Categories and Search

**User Story:** Là một user, tôi muốn tìm kiếm và lọc tests theo category, để dễ dàng tìm tests phù hợp.

#### Acceptance Criteria

1. THE Backend SHALL add category field to Test entity
2. THE Backend SHALL provide GET /api/tests endpoint with category filter parameter
3. THE Backend SHALL provide GET /api/tests endpoint with search query parameter for test title
4. WHEN category filter is applied, THE System SHALL return only tests in that category
5. WHEN search query is provided, THE System SHALL return tests with title containing the query (case-insensitive)
6. THE Backend SHALL support combining category filter and search query
