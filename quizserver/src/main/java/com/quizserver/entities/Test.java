package com.quizserver.entities;

import com.quizserver.dto.TestDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import com.quizserver.entities.Question;

import java.util.List;

@Data
@Entity
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private Long time;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Question> questions;

    public TestDTO getDto() {
        TestDTO dto = new TestDTO();

        dto.setId(id);
        dto.setTitle(title);
        dto.setDescription(description);
        dto.setTime(time);

        return dto;
    }
}
