package com.quiz.api.web;

public record ErrorResponse(int status, String message, long timestamp, String path) {
}
