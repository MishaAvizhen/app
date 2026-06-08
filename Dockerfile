# Этап 1: Сборка проекта с помощью стабильного Maven на Java 8
FROM maven:3.9.6-amazoncorretto-8 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Этап 2: Запуск готового jar в минимальном JRE образе
FROM eclipse-temurin:8-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-Xms128m", "-Xmx300m", "-XX:+UseSerialGC", "-Xss256k", "-jar", "app.jar", "--server.port=8082"]
