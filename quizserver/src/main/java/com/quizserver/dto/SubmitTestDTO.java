package com.quizserver.dto;

import com.quizserver.entities.Question;
import com.quizserver.entities.QuestionResponse;
import lombok.Data;

import java.util.List;

@Data
public class SubmitTestDTO {

    private Long testId;

    private Long userId;

    private List<QuestionResponse> responses;
}
