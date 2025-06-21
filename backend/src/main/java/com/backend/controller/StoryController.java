package com.backend.controller;

import com.backend.dto.StoryDTO;
import com.backend.mapper.StoryMapper;
import com.backend.model.Story;
import com.backend.repository.StoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.backend.model.constance.Priority;
import com.backend.model.constance.State;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    @Autowired
    private StoryRepository storyRepository;

    @GetMapping
    public List<StoryDTO> findAllByProject(@RequestParam String projectId) {
        return storyRepository.findByProjectId(projectId)
                .stream()
                .map(StoryMapper::toDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoryDTO> getById(@PathVariable String id) {
        return storyRepository.findById(id)
                .map(StoryMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StoryDTO> create(@RequestBody StoryDTO dto) {
        Story saved = storyRepository.save(StoryMapper.fromDTO(dto));
        return ResponseEntity.created(URI.create("/api/stories/" + saved.getId()))
                .body(StoryMapper.toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoryDTO> update(@PathVariable String id, @RequestBody StoryDTO dto) {
        return storyRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(dto.getTitle());
                    existing.setDescription(dto.getDescription());
                    existing.setPriority(Priority.valueOf(dto.getPriority().toUpperCase()));
                    existing.setState(State.valueOf(dto.getState().toUpperCase()));
                    existing.setUserId(dto.getUserId());
                    Story updated = storyRepository.save(existing);
                    return ResponseEntity.ok(StoryMapper.toDTO(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!storyRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        storyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
