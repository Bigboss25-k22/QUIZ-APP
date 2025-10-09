package com.quizserver.repository;

import com.quizserver.dto.TestResultDTO;
import com.quizserver.entities.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestResultReponsitory extends JpaRepository<TestResult, Long> {

    List<TestResult> findAllByUserId(Long userId);
}
