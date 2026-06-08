# Этап 1: Сборка проекта (Java + Frontend)
FROM maven:3.9.6-amazoncorretto-8 AS build
WORKDIR /app

# Копируем абсолютно все файлы проекта в контейнер сборки
COPY . .

# Запускаем сборку Maven. Плагин теперь найдет папку frontend
RUN mvn clean package -DskipTests

# Этап 2: Минимальный контейнер для запуска готового .jar
FROM eclipse-temurin:8-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-Xms128m", "-Xmx300m", "-XX:+UseSerialGC", "-Xss256k", "-jar", "app.jar", "--server.port=8082"]
