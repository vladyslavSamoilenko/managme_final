package com.backend.repository;

import com.backend.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TaskRepository extends MongoRepository<Task, Integer> {
    List<Task> findByStory_Project_Id(Integer projectId);
}
