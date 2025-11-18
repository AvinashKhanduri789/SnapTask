# === Stage 1: Build the application ===
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies (cache layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# === Stage 2: Run the application ===
FROM eclipse-temurin:25-jdk AS runner

WORKDIR /app
COPY --from=builder /app/target/snaptask-server-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 4000
ENTRYPOINT ["java", "-jar", "app.jar"]
