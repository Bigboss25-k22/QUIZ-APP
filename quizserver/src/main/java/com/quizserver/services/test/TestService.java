package com.quizserver.services.test;

import com.quizserver.dto.*;
import com.quizserver.entities.Test;

import java.util.List;

public interface TestService {

    TestDTO createTest(TestDTO testDTO);

    QuestionDTO addQuestionToTest(QuestionDTO dto);

    List<TestDTO> getAllTests();

    TestDetailsDTO getAllQuestionsByTest(Long id);

    TestResultDTO submitTest(SubmitTestDTO request);

    List<TestResultDTO> getAllTestResults();

    List<TestResultDTO> getAllTestResultsByUser(Long userId);
}
