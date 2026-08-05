package com.quiz.api.quiz.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizResult {
    private Long id;
    private Long quizId;
    private Long userId;
    private int totalQuestions;
    private int correctAnswers;
    private double percentage;
    private String quizTitle;
    private String userName;
}
