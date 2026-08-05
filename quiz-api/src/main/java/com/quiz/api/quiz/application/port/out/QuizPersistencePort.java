package com.quiz.api.quiz.application.port.out;

import com.quiz.api.quiz.domain.Question;
import com.quiz.api.quiz.domain.Quiz;
import com.quiz.api.quiz.domain.QuizResult;
import com.quiz.api.shared.pagination.PageResult;

import java.util.List;
import java.util.Optional;

public interface QuizPersistencePort {
    Quiz saveQuiz(Quiz quiz);
    Optional<Quiz> findQuizById(Long id);
    PageResult<Quiz> findQuizzes(int page, int size, String category, String search);
    Question saveQuestion(Question question);
    Optional<Question> findQuestionById(Long id);
    QuizResult saveResult(QuizResult result);
    List<QuizResult> findAllResults();
    List<QuizResult> findResultsByUserId(Long userId);
}
