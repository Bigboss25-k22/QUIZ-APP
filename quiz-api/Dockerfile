# Stage 1: Build ứng dụng bằng Gradle
FROM gradle:8.14.3-jdk17 AS builder
WORKDIR /workspace

# Copy Gradle Wrapper và cấu hình build để cache dependencies
COPY gradlew ./
COPY gradle ./gradle
COPY settings.gradle build.gradle gradle.properties ./
RUN chmod +x gradlew && ./gradlew --no-daemon dependencies

# Copy source code
COPY src ./src

# Build project (tạo file jar trong build/libs/)
RUN ./gradlew --no-daemon bootJar -x test

# Stage 2: Runtime với JDK nhẹ
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy file jar từ stage build
COPY --from=builder /workspace/build/libs/*.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS=""

# Chạy app
ENTRYPOINT ["java","-jar","/app/app.jar"]
