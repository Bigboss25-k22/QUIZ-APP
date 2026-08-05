package com.quiz.api.quiz.application;

import com.quiz.api.quiz.application.port.out.QuizPersistencePort;
import com.quiz.api.quiz.domain.AnswerSelection;
import com.quiz.api.quiz.domain.Question;
import com.quiz.api.quiz.domain.Quiz;
import com.quiz.api.quiz.domain.QuizResult;
import com.quiz.api.shared.pagination.PageResult;
import com.quiz.api.shared.exception.BadRequestException;
import com.quiz.api.shared.exception.ResourceNotFoundException;
import com.quiz.api.user.application.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizService {
    private final QuizPersistencePort quizzes;
    private final UserService users;

    @Transactional
    public Quiz create(String title, String description, Long time, String category) {
        return quizzes.saveQuiz(new Quiz(null, title, description, time, category, List.of()));
    }

    @Transactional
    public Question addQuestion(Long quizId, String questionText, String optionA, String optionB, String optionC,
                                String optionD, String correctOption) {
        findQuiz(quizId);
        return quizzes.saveQuestion(new Question(null, quizId, questionText, optionA, optionB, optionC, optionD, correctOption));
    }

    @Transactional(readOnly = true)
    public PageResult<Quiz> findPage(int page, int size, String category, String search) {
        if (page < 0) throw new BadRequestException("Page number cannot be negative");
        if (size < 0) throw new BadRequestException("Page size cannot be negative");
        return quizzes.findQuizzes(page, size == 0 ? 10 : size, category, search);
    }

    @Transactional(readOnly = true)
    public QuizDetails findDetails(Long id) {
        Quiz quiz = findQuiz(id);
        return new QuizDetails(quiz, quiz.getQuestions());
    }

    @Transactional
    public QuizResult submit(Long quizId, Long userId, List<AnswerSelection> answers) {
        Quiz quiz = findQuiz(quizId);
        users.getById(userId);
        int correctAnswers = 0;
        for (AnswerSelection answer : answers) {
            Question question = quizzes.findQuestionById(answer.questionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + answer.questionId()));
            if (!quizId.equals(question.getQuizId())) {
                throw new BadRequestException("Question does not belong to the submitted quiz");
            }
            if (normalize(question.getCorrectOption()).equals(normalize(answer.selectedOption()))) correctAnswers++;
        }
        int totalQuestions = quiz.getQuestions().size();
        double percentage = totalQuestions == 0 ? 0 : (double) correctAnswers / totalQuestions * 100;
        return quizzes.saveResult(new QuizResult(null, quizId, userId, totalQuestions, correctAnswers, percentage, null, null));
    }

    @Transactional(readOnly = true)
    public List<QuizResult> findAllResults() { return quizzes.findAllResults(); }

    @Transactional(readOnly = true)
    public List<QuizResult> findResultsByUserId(Long userId) { return quizzes.findResultsByUserId(userId); }

    private Quiz findQuiz(Long id) {
        return quizzes.findQuizById(id).orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
    }

    private String normalize(String value) {
        if (value == null) return "";
        String normalized = value.trim().toUpperCase();
        return normalized.matches("[ABCD]") ? normalized : "";
    }
}
