package com.backend.mapper;

import com.backend.dto.StoryDTO;
import com.backend.model.Story;
import com.backend.model.constance.Priority;
import com.backend.model.constance.State;

import java.time.LocalDate;

public class StoryMapper {
    public static StoryDTO toDTO(Story story) {
        return new StoryDTO(
                story.getId(),
                story.getTitle(),
                story.getDescription(),
                story.getPriority().name().toLowerCase(),
                story.getProjectId(),
                story.getCreatedDate().toString(),
                story.getState().name().toLowerCase(),
                story.getUserId()
        );
    }

    public static Story fromDTO(StoryDTO dto) {
        return new Story(
                dto.getId(),
                dto.getTitle(),
                Priority.valueOf(dto.getPriority().toUpperCase()),
                dto.getDescription(),
                dto.getProjectId(),
                State.valueOf(dto.getState().toUpperCase()),
                LocalDate.parse(dto.getCreatedDate()),
                dto.getUserId()
        );
    }
}
