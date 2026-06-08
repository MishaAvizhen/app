FROM eclipse-temurin:8-jre-alpine
COPY app.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-Xms128m", "-Xmx300m", "-XX:+UseSerialGC", "-Xss256k", "-jar", "app.jar", "--server.port=8082"]
