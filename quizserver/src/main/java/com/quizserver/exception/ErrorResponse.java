package com.quizserver.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private int status; // HTTP status code
    private String message; // Error message
    private long timestamp; // Time of the error occurrence
    private String path; // Request path that caused the error
}
