package com.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    private Integer id;
    private String title;
    private String description;
}
