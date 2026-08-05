package com.quiz.api.quiz.infrastructure.persistence;

import com.quiz.api.quiz.application.port.out.QuizPersistencePort;
import com.quiz.api.quiz.domain.Question;
import com.quiz.api.quiz.domain.Quiz;
import com.quiz.api.quiz.domain.QuizResult;
import com.quiz.api.quiz.infrastructure.persistence.entity.QuestionEntity;
import com.quiz.api.quiz.infrastructure.persistence.entity.QuizEntity;
import com.quiz.api.quiz.infrastructure.persistence.entity.QuizResultEntity;
import com.quiz.api.shared.pagination.PageResult;
import com.quiz.api.user.infrastructure.persistence.entity.UserEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class QuizPersistenceAdapter implements QuizPersistencePort {
    private final SpringDataQuizRepository quizRepository;
    private final SpringDataQuestionRepository questionRepository;
    private final SpringDataQuizResultRepository resultRepository;
    private final EntityManager entityManager;

    @Override
    public Quiz saveQuiz(Quiz quiz) { return toDomain(quizRepository.save(toEntity(quiz))); }

    @Override
    public Optional<Quiz> findQuizById(Long id) { return quizRepository.findById(id).map(this::toDomain); }

    @Override
    public PageResult<Quiz> findQuizzes(int page, int size, String category, String search) {
        Pageable pageable = PageRequest.of(page, size);
        boolean hasCategory = category != null && !category.isBlank();
        boolean hasSearch = search != null && !search.isBlank();
        Page<QuizEntity> result = hasCategory && hasSearch ? quizRepository.findByCategoryAndTitleContainingIgnoreCase(category, search, pageable)
                : hasCategory ? quizRepository.findByCategory(category, pageable)
                : hasSearch ? quizRepository.findByTitleContainingIgnoreCase(search, pageable)
                : quizRepository.findAll(pageable);
        return new PageResult<>(result.getContent().stream().map(this::toDomain).toList(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages(), result.isLast());
    }

    @Override
    public Question saveQuestion(Question question) { return toDomain(questionRepository.save(toEntity(question))); }

    @Override
    public Optional<Question> findQuestionById(Long id) { return questionRepository.findById(id).map(this::toDomain); }

    @Override
    public QuizResult saveResult(QuizResult result) { return toDomain(resultRepository.save(toEntity(result))); }

    @Override
    public List<QuizResult> findAllResults() { return resultRepository.findAll().stream().map(this::toDomain).toList(); }

    @Override
    public List<QuizResult> findResultsByUserId(Long userId) { return resultRepository.findAllByUserId(userId).stream().map(this::toDomain).toList(); }

    private Quiz toDomain(QuizEntity entity) {
        List<Question> questions = entity.getQuestions().stream().map(this::toDomain).toList();
        return new Quiz(entity.getId(), entity.getTitle(), entity.getDescription(), entity.getTime(), entity.getCategory(), questions);
    }

    private Question toDomain(QuestionEntity entity) {
        return new Question(entity.getId(), entity.getQuiz().getId(), entity.getQuestionText(), entity.getOptionA(), entity.getOptionB(),
                entity.getOptionC(), entity.getOptionD(), entity.getCorrectOption());
    }

    private QuizResult toDomain(QuizResultEntity entity) {
        return new QuizResult(entity.getId(), entity.getQuiz().getId(), entity.getUser().getId(), entity.getTotalQuestions(),
                entity.getCorrectAnswers(), entity.getPercentage(), entity.getQuiz().getTitle(), entity.getUser().getName());
    }

    private QuizEntity toEntity(Quiz quiz) {
        QuizEntity entity = new QuizEntity();
        entity.setId(quiz.getId());
        entity.setTitle(quiz.getTitle());
        entity.setDescription(quiz.getDescription());
        entity.setTime(quiz.getTime());
        entity.setCategory(quiz.getCategory());
        return entity;
    }

    private QuestionEntity toEntity(Question question) {
        QuestionEntity entity = new QuestionEntity();
        entity.setId(question.getId());
        entity.setQuiz(entityManager.getReference(QuizEntity.class, question.getQuizId()));
        entity.setQuestionText(question.getQuestionText());
        entity.setOptionA(question.getOptionA());
        entity.setOptionB(question.getOptionB());
        entity.setOptionC(question.getOptionC());
        entity.setOptionD(question.getOptionD());
        entity.setCorrectOption(question.getCorrectOption());
        return entity;
    }

    private QuizResultEntity toEntity(QuizResult result) {
        QuizResultEntity entity = new QuizResultEntity();
        entity.setId(result.getId());
        entity.setQuiz(entityManager.getReference(QuizEntity.class, result.getQuizId()));
        entity.setUser(entityManager.getReference(UserEntity.class, result.getUserId()));
        entity.setTotalQuestions(result.getTotalQuestions());
        entity.setCorrectAnswers(result.getCorrectAnswers());
        entity.setPercentage(result.getPercentage());
        return entity;
    }
}
