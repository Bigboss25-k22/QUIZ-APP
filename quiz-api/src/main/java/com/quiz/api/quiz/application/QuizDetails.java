package com.quiz.api.quiz.application;

import com.quiz.api.quiz.domain.Question;
import com.quiz.api.quiz.domain.Quiz;

import java.util.List;

public record QuizDetails(Quiz quiz, List<Question> questions) {
}
