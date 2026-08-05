package com.quiz.api.quiz.infrastructure.persistence.entity;

import com.quiz.api.user.infrastructure.persistence.entity.UserEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "test_result")
@Getter
@Setter
public class QuizResultEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int totalQuestions;
    private int correctAnswers;
    private double percentage;
    @ManyToOne
    @JoinColumn(name = "test_id")
    private QuizEntity quiz;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;
}
