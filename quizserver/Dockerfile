# Stage 1: Build ứng dụng bằng Maven
FROM maven:3.8.8-openjdk-17 AS builder
WORKDIR /workspace

# Copy file cấu hình Maven để cache dependencies
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copy source code
COPY src ./src

# Build project (tạo file jar trong target/)
RUN mvn -B package -DskipTests

# Stage 2: Runtime với JDK nhẹ
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy file jar từ stage build
COPY --from=builder /workspace/target/*.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS=""

# Chạy app
ENTRYPOINT ["java","-jar","/app/app.jar"]
