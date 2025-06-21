package com.backend.dto;

import com.backend.model.constance.Priority;
import com.backend.model.constance.State;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {

    private String id;
    private String title;
    private String description;
    private String priority;
    private String storyId;
    private String timeToDo;
    private String state;
    private String createdAt;
    private String startedAt;
    private String finishedAt;
    private String userId;
}
