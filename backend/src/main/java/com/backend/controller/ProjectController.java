package com.backend.controller;

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
    public List<Project> getAll() {
        return projectRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Project> addProject(@RequestBody Project project){
        Project addedProject = projectRepository.save(project);
        return ResponseEntity.created(URI.create("api/projects/" + addedProject.getId()))
                .body(addedProject);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Integer id){
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Integer id){
        if(!projectRepository.existsById(id)){
            return ResponseEntity.notFound().build();
        }
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();

    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Integer id, @RequestBody Project project){
        return projectRepository.findById(id)
                .map(existing -> {
                   existing.setTitle(project.getTitle());
                   existing.setDescription(project.getDescription());
                   Project updated = projectRepository.save(existing);
                   return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
