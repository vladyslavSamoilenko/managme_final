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

@Document("tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    private String id;

    private String title;
    private String description;
    @Field(targetType = FieldType.STRING)
    private Priority priority;


    private String storyId;
    private String timeToDo;
    @Field(targetType = FieldType.STRING)
    private State state;
    private LocalDate createdAt;
    private LocalDate startedAt;
    private LocalDate finishedAt;

    private String userId;
}
