FROM openjdk:19-jdk-slim-buster
EXPOSE 9000
COPY target/device-simulator-0.0.1-SNAPSHOT.jar /app2.jar
ENTRYPOINT ["java", "-jar", "/app2.jar"]
