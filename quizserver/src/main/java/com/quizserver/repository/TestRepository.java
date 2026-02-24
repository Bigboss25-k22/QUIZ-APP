package com.quizserver.repository;

import com.quizserver.entities.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {

    Page<Test> findByCategory(String category, Pageable pageable);

    Page<Test> findByTitleContainingIgnoreCase(String search, Pageable pageable);

    Page<Test> findByCategoryAndTitleContainingIgnoreCase(String category, String search, Pageable pageable);
}
