FROM openjdk:17-jdk-slim
ARG JAR_File=target/parking_management-0.0.1-SNAPSHOT.jar
COPY ${JAR_File} app_parking_management.jar
EXPOSE 8080
ENTRYPOINT  ["java", "-jar", "app_parking_management.jar"]