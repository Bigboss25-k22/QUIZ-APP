package com.quiz.api.quiz.api.dto;

import com.quiz.api.quiz.api.dto.QuestionResponse;
import lombok.Data;

import java.util.List;

@Data
public class SubmitTestDTO {

    private Long testId;

    private Long userId;

    private List<QuestionResponse> responses;
}
