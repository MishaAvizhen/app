# Переключаемся на Java 17, где TLS 1.3 и все современные шифры работают из коробки
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Копируем готовый app.jar из корня вашего репозитория GitHub
COPY app.jar app.jar

EXPOSE 8082

# Запуск с вашими оптимизациями памяти (флаги TLS-протоколов на Java 17 больше не нужны)
ENTRYPOINT ["java", "-Xms128m", "-Xmx300m", "-XX:+UseSerialGC", "-Xss256k", "-jar", "app.jar", "--server.port=8082"]
