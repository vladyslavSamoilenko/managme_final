package com.backend.controller;

import com.backend.dto.TaskDTO;
import com.backend.mapper.TaskMapper;
import com.backend.model.Task;
import com.backend.model.User;
import com.backend.model.constance.State;
import com.backend.repository.StoryRepository;
import com.backend.repository.TaskRepository;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.backend.model.constance.Priority;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StoryRepository storyRepository;

    @GetMapping
    public List<TaskDTO> findAllByStory(@RequestParam String storyId) {
        return taskRepository.findByStoryId(storyId)
                .stream()
                .map(TaskMapper::toDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getById(@PathVariable String id) {
        return taskRepository.findById(id)
                .map(TaskMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TaskDTO> create(@RequestBody TaskDTO dto) {
        if (!storyRepository.existsById(dto.getStoryId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Story not found");
        }
        if (dto.getUserId() != null && !userRepository.existsById(dto.getUserId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found");
        }

        Task task = TaskMapper.fromDTO(dto);
        task.setCreatedAt(LocalDate.parse(LocalDate.now().toString()));

        Task saved = taskRepository.save(task);
        return ResponseEntity.created(URI.create("/api/tasks/" + saved.getId()))
                .body(TaskMapper.toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> update(@PathVariable String id, @RequestBody TaskDTO dto) {
        return taskRepository.findById(id)
                .map(existing -> {
                    if (dto.getTitle() != null) existing.setTitle(dto.getTitle());
                    if (dto.getDescription() != null) existing.setDescription(dto.getDescription());
                    if (dto.getPriority() != null)
                        existing.setPriority(Priority.valueOf(dto.getPriority().toUpperCase()));
                    if (dto.getTimeToDo() != null)
                        existing.setTimeToDo(dto.getTimeToDo());
                    if (dto.getState() != null)
                        existing.setState(State.valueOf(dto.getState().toUpperCase()));
                    if (dto.getCreatedAt() != null)
                        existing.setCreatedAt(LocalDate.parse(dto.getCreatedAt()));
                    if (dto.getStartedAt() != null)
                        existing.setStartedAt(LocalDate.parse(dto.getStartedAt()));
                    if (dto.getFinishedAt() != null)
                        existing.setFinishedAt(LocalDate.parse(dto.getFinishedAt()));
                    if (dto.getUserId() != null)
                        existing.setUserId(dto.getUserId());

                    Task updated = taskRepository.save(existing);
                    return ResponseEntity.ok(TaskMapper.toDTO(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
