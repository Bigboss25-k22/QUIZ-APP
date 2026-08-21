package com.quiz.api.quiz.api;

import com.quiz.api.quiz.api.dto.PageResponse;
import com.quiz.api.quiz.api.dto.QuestionDTO;
import com.quiz.api.quiz.api.dto.SubmitTestDTO;
import com.quiz.api.quiz.api.dto.TestDTO;
import com.quiz.api.quiz.api.dto.TestDetailsDTO;
import com.quiz.api.quiz.api.dto.TestResultDTO;
import com.quiz.api.quiz.application.QuizService;
import com.quiz.api.quiz.domain.AnswerSelection;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class QuizController {
    private final QuizService quizService;

    @PostMapping("/create")
    public ResponseEntity<TestDTO> create(@RequestBody TestDTO request) {
        return ResponseEntity.ok(QuizApiMapper.toDto(quizService.create(request.getTitle(), request.getDescription(), request.getTime(), request.getCategory())));
    }

    @PostMapping("/question")
    public ResponseEntity<QuestionDTO> addQuestion(@RequestBody QuestionDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(QuizApiMapper.toDto(quizService.addQuestion(request.getId(), request.getQuestionText(),
                request.getOptionA(), request.getOptionB(), request.getOptionC(), request.getOptionD(), request.getCorrectOption())));
    }

    @GetMapping
    public ResponseEntity<PageResponse<TestDTO>> findPage(@RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size,
                                                           @RequestParam(required = false) String category,
                                                           @RequestParam(required = false) String search) {
        return ResponseEntity.ok(QuizApiMapper.toPageResponse(quizService.findPage(page, size, category, search)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestDetailsDTO> findDetails(@PathVariable Long id) {
        return ResponseEntity.ok(QuizApiMapper.toDto(quizService.findDetails(id)));
    }

    @PostMapping("/submit-test")
    public ResponseEntity<TestResultDTO> submit(@RequestBody SubmitTestDTO request) {
        List<AnswerSelection> answers = request.getResponses().stream()
                .map(answer -> new AnswerSelection(answer.getQuestionId(), answer.getSelectedOption())).toList();
        return ResponseEntity.ok(QuizApiMapper.toDto(quizService.submit(request.getTestId(), request.getUserId(), answers)));
    }

    @GetMapping("/test-results")
    public ResponseEntity<List<TestResultDTO>> findAllResults() {
        return ResponseEntity.ok(quizService.findAllResults().stream().map(QuizApiMapper::toDto).toList());
    }

    @GetMapping("/test-results/{userId}")
    public ResponseEntity<List<TestResultDTO>> findResultsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(quizService.findResultsByUserId(userId).stream().map(QuizApiMapper::toDto).toList());
    }
}
