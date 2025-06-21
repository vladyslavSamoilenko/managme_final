package com.backend.repository;

import com.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findById(String id);

    boolean existsById(String id);

    void deleteById(String id);
}
