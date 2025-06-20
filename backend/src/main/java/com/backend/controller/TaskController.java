package com.backend.controller;

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

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;
    private UserRepository userRepository;
    private StoryRepository storyRepository;

    @GetMapping
    public List<Task> findAllByProject(@RequestParam Integer id){
        return taskRepository.findByStory_Project_Id(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> findById(@PathVariable Integer id){
        return taskRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Task> addTask(@RequestBody Task incoming){
        storyRepository.findById(incoming.getStory().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "History not found"));
        if (incoming.getTaskOwner() != null){
            userRepository.findById(incoming.getTaskOwner().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found"));

        }

        Task saved = taskRepository.save(incoming);
        return ResponseEntity.created(URI.create("/api/tasks" + saved.getId()))
                .body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Integer id, @RequestBody Task incoming){
        return taskRepository.findById(id)
                .map(existing -> {
                    if (incoming.getTitle() != null) existing.setTitle(incoming.getTitle());
                    if (incoming.getDescription() != null) existing.setDescription(incoming.getDescription());
                    if (incoming.getPriority() != null) existing.setPriority(incoming.getPriority());
                    if (incoming.getTimeToDo() != null) existing.setTimeToDo(incoming.getTimeToDo());
                    if (incoming.getState() != null) existing.setState(incoming.getState());

                    if(incoming.getStory() != null && incoming.getStory().getId() != null){
                        User user = userRepository.findById(incoming.getTaskOwner().getId())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found"));
                        existing.setTaskOwner(user);
                    }

                    if(existing.getState() == State.DOING && existing.getStartedAt() == null){
                        existing.setStartedAt(LocalDate.now());
                    }
                    if(existing.getState() == State.DOING && existing.getFinishedAt() == null){
                        existing.setFinishedAt(LocalDate.now());
                    }

                    Task updated = taskRepository.save(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        if(!taskRepository.existsById(id)){
            return ResponseEntity.notFound().build();
        }

        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
