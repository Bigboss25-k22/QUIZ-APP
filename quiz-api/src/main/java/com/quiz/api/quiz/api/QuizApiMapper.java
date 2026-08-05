package com.quiz.api.quiz.api;

import com.quiz.api.quiz.api.dto.PageResponse;
import com.quiz.api.quiz.api.dto.QuestionDTO;
import com.quiz.api.quiz.api.dto.TestDTO;
import com.quiz.api.quiz.api.dto.TestDetailsDTO;
import com.quiz.api.quiz.api.dto.TestResultDTO;
import com.quiz.api.quiz.application.QuizDetails;
import com.quiz.api.quiz.domain.Question;
import com.quiz.api.quiz.domain.Quiz;
import com.quiz.api.quiz.domain.QuizResult;
import com.quiz.api.shared.pagination.PageResult;

import java.util.List;

final class QuizApiMapper {
    private QuizApiMapper() { }

    static TestDTO toDto(Quiz quiz) {
        TestDTO dto = new TestDTO();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        dto.setTime(quiz.getTime());
        dto.setCategory(quiz.getCategory());
        return dto;
    }

    static QuestionDTO toDto(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setQuestionText(question.getQuestionText());
        dto.setOptionA(question.getOptionA());
        dto.setOptionB(question.getOptionB());
        dto.setOptionC(question.getOptionC());
        dto.setOptionD(question.getOptionD());
        dto.setCorrectOption(question.getCorrectOption());
        return dto;
    }

    static TestResultDTO toDto(QuizResult result) {
        TestResultDTO dto = new TestResultDTO();
        dto.setId(result.getId());
        dto.setTotalQuestions(result.getTotalQuestions());
        dto.setCorrectAnswers(result.getCorrectAnswers());
        dto.setPercentage(result.getPercentage());
        dto.setTestName(result.getQuizTitle());
        dto.setUserName(result.getUserName());
        return dto;
    }

    static TestDetailsDTO toDto(QuizDetails details) {
        TestDetailsDTO dto = new TestDetailsDTO();
        dto.setTestDTO(toDto(details.quiz()));
        dto.setQuestions(details.questions().stream().map(QuizApiMapper::toDto).toList());
        return dto;
    }

    static PageResponse<TestDTO> toPageResponse(PageResult<Quiz> page) {
        PageResponse<TestDTO> dto = new PageResponse<>();
        dto.setContent(page.content().stream().map(QuizApiMapper::toDto).toList());
        dto.setCurrentPage(page.page());
        dto.setPageSize(page.size());
        dto.setTotalElements(page.totalElements());
        dto.setTotalPages(page.totalPages());
        dto.setLast(page.last());
        return dto;
    }
}
