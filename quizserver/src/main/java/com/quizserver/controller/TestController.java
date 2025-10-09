package com.quizserver.controller;

import com.quizserver.dto.*;
import com.quizserver.entities.Test;
import com.quizserver.exception.BadRequestException;
import com.quizserver.repository.TestRepository;
import com.quizserver.services.test.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import com.quizserver.exception.BadRequestException;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*") // Allow all origins for CORS
public class TestController {

    @Autowired
    private TestService testService;

    @Autowired
    private TestRepository testRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createTest(@RequestBody TestDTO testDTO) {
        try {
            return new ResponseEntity<>(testService.createTest(testDTO), HttpStatus.OK);
        } catch (Exception e) {
            throw new BadRequestException("Test not created, come again later");
        }
    }

    @PostMapping("/question")
    public ResponseEntity<?> addQuestionToTest(@RequestBody QuestionDTO dto) {
        try {
            return new ResponseEntity<>(testService.addQuestionToTest(dto), HttpStatus.CREATED);
        } catch (Exception e) {
            throw new BadRequestException("Question not added, come again later");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllTests() {
        try {
            List<TestDTO> tests = testService.getAllTests();
            return new ResponseEntity<>(tests, HttpStatus.OK);
        } catch (Exception e) {
            throw new BadRequestException("Could not fetch tests, come again later");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAllQuestions(@PathVariable Long id) {
        try {
            TestDetailsDTO tests = testService.getAllQuestionsByTest(id);
            return new ResponseEntity<>(tests, HttpStatus.OK);
        } catch (Exception e) {
            throw new BadRequestException("Could not fetch questions, come again later");
        }
    }

    @PostMapping("/submit-test")
    public ResponseEntity<?> submitTest(@RequestBody SubmitTestDTO request) {
        try {
            TestResultDTO result = testService.submitTest(request);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            throw new BadRequestException("Could not submit test, come again later");
        }
    }

    @GetMapping("/test-results")
    public ResponseEntity<?> getAllTestResults() {
        try {
            List<TestResultDTO> results = testService.getAllTestResults();
            return new ResponseEntity<>(results, HttpStatus.OK);
        } catch (Exception e) {
            throw new BadRequestException("Could not fetch test results, come again later");
        }
    }

    @GetMapping("/test-results/{userId}")
    public ResponseEntity<?> getAllTestResult(@PathVariable Long userId) {
        try {
            List<TestResultDTO> results = testService.getAllTestResultsByUser(userId);
            return new ResponseEntity<>(results, HttpStatus.OK);
        } catch (Exception e) {
            throw new BadRequestException("Could not fetch test results, come again later");
        }
    }
}
