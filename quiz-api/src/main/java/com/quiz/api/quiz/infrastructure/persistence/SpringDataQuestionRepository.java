package com.quiz.api.quiz.infrastructure.persistence;

import com.quiz.api.quiz.infrastructure.persistence.entity.QuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

interface SpringDataQuestionRepository extends JpaRepository<QuestionEntity, Long> {
}
