package com.quizserver.services.test;

import com.quizserver.dto.*;

import java.util.List;

public interface TestService {

    TestDTO createTest(TestDTO testDTO);

    QuestionDTO addQuestionToTest(QuestionDTO dto);

    List<TestDTO> getAllTests();

    PageResponse<TestDTO> getTests(int page, int size, String category, String search);

    TestDetailsDTO getAllQuestionsByTest(Long id);

    TestResultDTO submitTest(SubmitTestDTO request);

    List<TestResultDTO> getAllTestResults();

    List<TestResultDTO> getAllTestResultsByUser(Long userId);
}
