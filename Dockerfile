# Этап 1: Сборка проекта с помощью Maven и Java 8
FROM maven:3.8.8-openjdk-8-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Этап 2: Запуск готового jar в минимальном образе
FROM eclipse-temurin:8-jre-alpine
WORKDIR /app
# Копируем собранный jar-файл из предыдущего шага сборки
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-Xms128m", "-Xmx300m", "-XX:+UseSerialGC", "-Xss256k", "-jar", "app.jar", "--server.port=8082"]

