package com.backend.controller;

import com.backend.dto.ProjectDTO;
import com.backend.mapper.ProjectMapper;
import com.backend.model.Project;
import com.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> show(Integer projectId){
        return projectRepository.findAll();
    }

    @GetMapping
    public List<ProjectDTO> getAll() {
        return projectRepository.findAll()
                .stream()
                .map(ProjectMapper::toDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getById(@PathVariable String id) {
        return projectRepository.findById(id)
                .map(ProjectMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> create(@RequestBody ProjectDTO dto) {
        Project saved = projectRepository.save(ProjectMapper.fromDTO(dto));
        return ResponseEntity
                .created(URI.create("/api/projects/" + saved.getId()))
                .body(ProjectMapper.toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> update(@PathVariable String id, @RequestBody ProjectDTO dto) {
        return projectRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(dto.getTitle());
                    existing.setDescription(dto.getDescription());
                    Project updated = projectRepository.save(existing);
                    return ResponseEntity.ok(ProjectMapper.toDTO(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!projectRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
