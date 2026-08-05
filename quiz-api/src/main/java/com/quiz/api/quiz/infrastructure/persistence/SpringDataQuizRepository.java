package com.quiz.api.quiz.infrastructure.persistence;

import com.quiz.api.quiz.infrastructure.persistence.entity.QuizEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

interface SpringDataQuizRepository extends JpaRepository<QuizEntity, Long> {
    Page<QuizEntity> findByCategory(String category, Pageable pageable);
    Page<QuizEntity> findByTitleContainingIgnoreCase(String search, Pageable pageable);
    Page<QuizEntity> findByCategoryAndTitleContainingIgnoreCase(String category, String search, Pageable pageable);
}
