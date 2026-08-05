package com.quiz.api.quiz.infrastructure.persistence;

import com.quiz.api.quiz.infrastructure.persistence.entity.QuizResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

interface SpringDataQuizResultRepository extends JpaRepository<QuizResultEntity, Long> {
    List<QuizResultEntity> findAllByUserId(Long userId);
}
