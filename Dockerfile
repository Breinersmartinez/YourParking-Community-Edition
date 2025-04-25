FROM openjdk:17-jdk-slim
ARG JAR_FILE=target/parking_management-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} parking-management-app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "parking-management-app.jar"]