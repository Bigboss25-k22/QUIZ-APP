package com.quizserver.exception;

import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    // 404 - Resource Not Found
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex, WebRequest request) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                System.currentTimeMillis(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // 401 - Unauthorized
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex, WebRequest request) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                ex.getMessage(),
                System.currentTimeMillis(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    // 400 - Bad Request
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex, WebRequest request) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                System.currentTimeMillis(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // 500 - Internal Server Error
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex, WebRequest request) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Something went wrong: " + ex.getMessage(),
                System.currentTimeMillis(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
