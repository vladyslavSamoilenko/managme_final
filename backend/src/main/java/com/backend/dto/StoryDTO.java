package com.backend.dto;

import com.backend.model.constance.Priority;
import com.backend.model.constance.State;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoryDTO {
    private String id;
    private String title;
    private String description;
    private String priority; // 'low' | 'medium' | 'high'
    private String projectId;
    private String createdDate;
    private String state; // 'todo' | 'doing' | 'done'
    private String userId;
}
