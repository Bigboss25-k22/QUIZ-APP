package com.quiz.api.quiz.api.dto;

import lombok.Data;

@Data
public class QuestionResponse {

    private Long questionId;

    private String selectedOption;
}
