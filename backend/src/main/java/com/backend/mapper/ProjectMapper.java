package com.backend.mapper;

import com.backend.dto.ProjectDTO;
import com.backend.model.Project;

public class ProjectMapper {
    public static ProjectDTO toDTO(Project project) {
        return new ProjectDTO(
                project.getId(),
                project.getTitle(),
                project.getDescription()
        );
    }

    public static Project fromDTO(ProjectDTO dto) {
        return new Project(
                dto.getId(),
                dto.getTitle(),
                dto.getDescription()
        );
    }
}
