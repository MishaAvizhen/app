FROM eclipse-temurin:8-jre-alpine
WORKDIR /app

# Просто копируем уже готовый app.jar из корня вашего репозитория GitHub
COPY app.jar app.jar

EXPOSE 8082

# Запуск с жестким ограничением памяти для стабильности на бесплатном тарифе
ENTRYPOINT ["java", "-Xms128m", "-Xmx300m", "-XX:+UseSerialGC", "-Xss256k", "-Dhttps.protocols=TLSv1.2,TLSv1.3", "-Djdk.tls.client.protocols=TLSv1.2,TLSv1.3", "-jar", "app.jar", "--server.port=8082"]

