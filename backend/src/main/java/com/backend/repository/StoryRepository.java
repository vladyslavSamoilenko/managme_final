package com.backend.repository;

import com.backend.model.Story;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StoryRepository extends MongoRepository<Story, String> {
    List<Story> findByProjectId(String projectId);
}
