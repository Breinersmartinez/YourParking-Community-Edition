package com.example.parking_management.shared.response;

import java.time.LocalDateTime;

public record ApiResponse<T>(
    boolean success,
    String message,
    T data,
    LocalDateTime timestamp,
    String errorCode
) {

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, "OK", data, LocalDateTime.now(), null);
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(true, message, data, LocalDateTime.now(), null);
    }

    public static <T> ApiResponse<T> error(String errorCode, String message) {
        return new ApiResponse<>(false, message, null, LocalDateTime.now(), errorCode);
    }
}
