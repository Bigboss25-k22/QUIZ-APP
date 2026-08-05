package com.quiz.api.quiz.api.dto;

import lombok.Data;
import java.util.List;

@Data
public class TestDetailsDTO {

    private TestDTO testDTO;

    private List<QuestionDTO> questions;

}
