package com.quizserver.services.test;

import com.quizserver.dto.*;
import com.quizserver.entities.QuestionResponse;
import com.quizserver.entities.Test;
import com.quizserver.entities.Question;
import com.quizserver.entities.TestResult;

import com.quizserver.entities.User;
import com.quizserver.repository.QuestionRepository;
import com.quizserver.repository.TestRepository;
import com.quizserver.repository.TestResultReponsitory;
import com.quizserver.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

import java.util.List;
import java.util.Optional;

@Service
public class TestServiceImpl implements TestService {

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private TestResultReponsitory testResultReponsitory;

    @Autowired
    private UserRepository userRepository;

    public TestDTO createTest(TestDTO testDTO) {
        Test test = new Test();

        test.setTitle(testDTO.getTitle());
        test.setDescription(testDTO.getDescription());
        test.setTime(testDTO.getTime());

        return testRepository.save(test).getDto();
    }

    public QuestionDTO addQuestionToTest(QuestionDTO dto) {
        Optional<Test> testOpt = testRepository.findById(dto.getId());
        if (testOpt.isPresent()) {
            Question question = new Question();

            question.setQuestionText(dto.getQuestionText());
            question.setOptionA(dto.getOptionA());
            question.setOptionB(dto.getOptionB());
            question.setOptionC(dto.getOptionC());
            question.setOptionD(dto.getOptionD());
            question.setCorrectOption(dto.getCorrectOption());
            question.setTest(testOpt.get());
            return questionRepository.save(question).getDto();
        }

        throw new EntityNotFoundException("Test not found");
    }

    public List<TestDTO> getAllTests() {
        return testRepository.findAll().stream()
                .peek(test -> test.setTime(test.getQuestions().size() * test.getTime()))
                .toList()
                .stream().map(Test::getDto).collect(Collectors.toList());
    }

    @Override
    public PageResponse<TestDTO> getTests(int page, int size, String category, String search) {
        // Validate page and size parameters
        if (page < 0) {
            throw new IllegalArgumentException("Page number cannot be negative");
        }
        if (size < 0) {
            throw new IllegalArgumentException("Page size cannot be negative");
        }

        // Default values
        if (size == 0) {
            size = 10;
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Test> testPage;

        // Apply filters based on provided parameters
        if (category != null && !category.isEmpty() && search != null && !search.isEmpty()) {
            testPage = testRepository.findByCategoryAndTitleContainingIgnoreCase(category, search, pageable);
        } else if (category != null && !category.isEmpty()) {
            testPage = testRepository.findByCategory(category, pageable);
        } else if (search != null && !search.isEmpty()) {
            testPage = testRepository.findByTitleContainingIgnoreCase(search, pageable);
        } else {
            testPage = testRepository.findAll(pageable);
        }

        // Convert to PageResponse
        PageResponse<TestDTO> response = new PageResponse<>();
        response.setContent(testPage.getContent().stream()
                .peek(test -> test.setTime(test.getQuestions().size() * test.getTime()))
                .map(Test::getDto)
                .collect(Collectors.toList()));
        response.setCurrentPage(testPage.getNumber());
        response.setPageSize(testPage.getSize());
        response.setTotalElements(testPage.getTotalElements());
        response.setTotalPages(testPage.getTotalPages());
        response.setLast(testPage.isLast());

        return response;
    }

    public TestDetailsDTO getAllQuestionsByTest(Long id) {
        Optional<Test> optionalTest = testRepository.findById(id);
        TestDetailsDTO testDetailsDTO = new TestDetailsDTO();

        if (optionalTest.isPresent()) {
            TestDTO testDTO = optionalTest.get().getDto();
            testDTO.setTime(optionalTest.get().getQuestions().size() * optionalTest.get().getTime());

            testDetailsDTO.setTestDTO(testDTO);
            testDetailsDTO.setQuestions(
                    optionalTest.get().getQuestions().stream().map(Question::getDto).collect(Collectors.toList()));
            return testDetailsDTO;
        }

        return testDetailsDTO;
    }

    public TestResultDTO submitTest(SubmitTestDTO request) {
        Test test = testRepository.findById(request.getTestId())
                .orElseThrow(() -> new EntityNotFoundException("Test not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        int correctAnswers = 0;

        for (QuestionResponse response : request.getResponses()) {
            Question question = questionRepository.findById(response.getQuestionId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Question not found with ID: " + response.getQuestionId()));

            String correct = normalizeToLetter(question.getCorrectOption());
            String selected = normalizeToLetter(response.getSelectedOption());

            if (correct != null && correct.equals(selected)) {
                correctAnswers++;
            }
        }

        int totalQuestions = test.getQuestions().size();
        double percentage = (double) correctAnswers / totalQuestions * 100;

        TestResult testResult = new TestResult();
        testResult.setTest(test);
        testResult.setUser(user);
        testResult.setTotalQuestions(totalQuestions);
        testResult.setCorrectAnswers(correctAnswers);
        testResult.setPercentage(percentage);

        return testResultReponsitory.save(testResult).getDto();
    }

    private String normalizeToLetter(String value) {
        if (value == null)
            return null;
        String v = value.trim().toUpperCase();
        if (v.equals("A") || v.equals("B") || v.equals("C") || v.equals("D")) {
            return v;
        }
        return null;
    }

    public List<TestResultDTO> getAllTestResults() {
        return testResultReponsitory.findAll().stream()
                .map(TestResult::getDto)
                .collect(Collectors.toList());
    }

    public List<TestResultDTO> getAllTestResultsByUser(Long userId) {
        return testResultReponsitory.findAllByUserId(userId).stream()
                .map(TestResult::getDto)
                .collect(Collectors.toList());
    }
}
