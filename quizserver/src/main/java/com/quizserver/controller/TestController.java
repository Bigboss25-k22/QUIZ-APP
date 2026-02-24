package com.quizserver.controller;

import com.quizserver.dto.*;
import com.quizserver.exception.BadRequestException;
import com.quizserver.services.test.TestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
@Tag(name = "Tests", description = "Test management endpoints for creating, retrieving, and submitting tests")
@SecurityRequirement(name = "bearerAuth")
public class TestController {

    @Autowired
    private TestService testService;

    @PostMapping("/create")
    @Operation(summary = "Create a new test", description = "Create a new test with title, description, and time limit")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> createTest(@RequestBody TestDTO testDTO) {
        try {
            return new ResponseEntity<>(testService.createTest(testDTO), HttpStatus.OK);
        } catch (Exception e) {
            throw new BadRequestException("Test not created, come again later");
        }
    }

    @PostMapping("/question")
    @Operation(summary = "Add question to test", description = "Add a new question with options and correct answer to an existing test")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Question added successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or test not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> addQuestionToTest(@RequestBody QuestionDTO dto) {
        try {
            return new ResponseEntity<>(testService.addQuestionToTest(dto), HttpStatus.CREATED);
        } catch (Exception e) {
            throw new BadRequestException("Question not added, come again later");
        }
    }

    @GetMapping
    @Operation(summary = "Get paginated tests", description = "Retrieve tests with pagination, optional category filter, and search by title")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tests retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid pagination parameters"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> getAllTests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        try {
            PageResponse<TestDTO> tests = testService.getTests(page, size, category, search);
            return new ResponseEntity<>(tests, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException(e.getMessage());
        } catch (Exception e) {
            throw new BadRequestException("Could not fetch tests, come again later");
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get test details with questions", description = "Retrieve a specific test with all its questions")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test details retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Test not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> getAllQuestions(@PathVariable Long id) {
        try {
            TestDetailsDTO tests = testService.getAllQuestionsByTest(id);
            return new ResponseEntity<>(tests, HttpStatus.OK);
        } catch (Exception e) {
            throw new BadRequestException("Could not fetch questions, come again later");
        }
    }

    @PostMapping("/submit-test")
    @Operation(summary = "Submit test answers", description = "Submit answers for a test and receive results with score")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test submitted successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid test or user data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> submitTest(@RequestBody SubmitTestDTO request) {
        try {
            TestResultDTO result = testService.submitTest(request);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            throw new BadRequestException("Could not submit test, come again later");
        }
    }

    @GetMapping("/test-results")
    @Operation(summary = "Get all test results", description = "Retrieve all test results for all users (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test results retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> getAllTestResults() {
        try {
            List<TestResultDTO> results = testService.getAllTestResults();
            return new ResponseEntity<>(results, HttpStatus.OK);
        } catch (Exception e) {
            throw new BadRequestException("Could not fetch test results, come again later");
        }
    }

    @GetMapping("/test-results/{userId}")
    @Operation(summary = "Get test results by user", description = "Retrieve all test results for a specific user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test results retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "User not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> getAllTestResult(@PathVariable Long userId) {
        try {
            List<TestResultDTO> results = testService.getAllTestResultsByUser(userId);
            return new ResponseEntity<>(results, HttpStatus.OK);
        } catch (Exception e) {
            throw new BadRequestException("Could not fetch test results, come again later");
        }
    }
}
