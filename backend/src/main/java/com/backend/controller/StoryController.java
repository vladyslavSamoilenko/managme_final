package com.backend.controller;

import com.backend.model.Story;
import com.backend.repository.StoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    @Autowired
    private StoryRepository storyRepository;

    @GetMapping
    public List<Story> findAllByProject(@RequestParam Integer projectId){
        return storyRepository.findByProjectId(projectId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Story> getHistoryById(@PathVariable Integer id){
        return storyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Story> addHistory(@RequestBody Story incoming){
        Story saved = storyRepository.save(incoming);
        return ResponseEntity.created(URI.create("/api/stories/" + saved.getId()))
                .body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Story> update(@PathVariable Integer id, @RequestBody Story story){
        return storyRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(story.getTitle());
                    existing.setDescription(story.getDescription());
                    existing.setPriority(story.getPriority());
                    existing.setState(story.getState());
                    existing.setUserId(story.getUserId());
                    Story updated = storyRepository.save(existing);
                    return ResponseEntity.ok(updated);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        if(!storyRepository.existsById(id)){
            return ResponseEntity.notFound().build();
        }
        storyRepository.deleteById(id);
        return ResponseEntity.noContent().build();

    }


}
