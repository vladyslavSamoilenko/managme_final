package com.backend.mapper;

import com.backend.dto.TaskDTO;
import com.backend.model.Task;
import com.backend.model.constance.Priority;
import com.backend.model.constance.State;

import java.time.LocalDate;

public class TaskMapper {
    public static TaskDTO toDTO(Task task) {
        return new TaskDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getPriority().name().toLowerCase(),
                task.getStoryId(),
                task.getTimeToDo(),
                task.getState().name().toLowerCase(),
                task.getCreatedAt() != null ? task.getCreatedAt().toString() : null,
                task.getStartedAt() != null ? task.getStartedAt().toString() : null,
                task.getFinishedAt() != null ? task.getFinishedAt().toString() : null,
                task.getUserId() != null ? task.getUserId() : null
        );
    }

    public static Task fromDTO(TaskDTO dto) {
        return new Task(
                dto.getId(),
                dto.getTitle(),
                dto.getDescription(),
                Priority.valueOf(dto.getPriority().toUpperCase()),
                dto.getStoryId(),
                dto.getTimeToDo(),
                State.valueOf(dto.getState().toUpperCase()),
                dto.getCreatedAt() != null ? LocalDate.parse(dto.getCreatedAt()) : null,
                dto.getStartedAt() != null ? LocalDate.parse(dto.getStartedAt()) : null,
                dto.getFinishedAt() != null ? LocalDate.parse(dto.getFinishedAt()) : null,
                dto.getUserId() != null ? dto.getUserId() : null
        );
    }
}
