FROM openjdk:19-jdk-slim-buster
EXPOSE 9001
COPY target/device-monitoring-0.0.1-SNAPSHOT.jar /app2.jar
ENTRYPOINT ["java", "-jar", "/app2.jar"]
