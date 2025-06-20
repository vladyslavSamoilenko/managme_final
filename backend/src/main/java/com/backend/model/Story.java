package com.backend.model;

import com.backend.model.constance.Priority;
import com.backend.model.constance.State;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.time.LocalDate;

@Document("stories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Story {
    @Id
    private Integer id;
    private String title;
    private Priority priority;
    private String description;

    @DBRef(lazy = true)
    private Project project;
    @Field(targetType = FieldType.STRING)
    private State state;
    private LocalDate localDate;
    private Integer userId;
}
