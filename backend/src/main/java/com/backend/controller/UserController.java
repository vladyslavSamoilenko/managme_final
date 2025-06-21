package com.backend.controller;

import com.backend.dto.UserDTO;
import com.backend.mapper.UserMapper;
import com.backend.model.User;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<UserDTO> getAll() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getById(@PathVariable String id) {
        return userRepository.findById(id)
                .map(UserMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserDTO> create(@RequestBody UserDTO dto) {
        User user = userRepository.save(UserMapper.fromDTO(dto));
        return ResponseEntity
                .created(URI.create("/api/users/" + user.getId()))
                .body(UserMapper.toDTO(user));
    }


    @PutMapping("/{id}")
    public ResponseEntity<User> update(
            @PathVariable String id,
            @RequestBody User incoming
    ) {
        return userRepository.findById(id)
                .map(existing -> {
                    existing.setName(incoming.getName());
                    existing.setSurname(incoming.getSurname());
                    existing.setRole(incoming.getRole());
                    User updated = userRepository.save(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
