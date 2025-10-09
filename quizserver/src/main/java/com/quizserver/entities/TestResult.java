package com.quizserver.entities;

import com.quizserver.dto.TestResultDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import com.quizserver.entities.Test;

@Entity
@Data
public class TestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int totalQuestions;

    private int correctAnswers;

    private double percentage;

    @ManyToOne
    @JoinColumn(name = "test_id")
    @ToString.Exclude
    private Test test;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;

    public TestResultDTO getDto() {
        TestResultDTO dto = new TestResultDTO();

        dto.setId(id);
        dto.setTotalQuestions(totalQuestions);
        dto.setCorrectAnswers(correctAnswers);
        dto.setPercentage(percentage);
        dto.setTestName(test != null ? test.getTitle() : null);
        dto.setUserName(user != null ? user.getName() : null);

        return dto;
    }
}
