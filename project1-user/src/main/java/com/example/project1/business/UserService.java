package com.example.project1.business;

import com.example.project1.model.Role;
import com.example.project1.model.User;
import com.example.project1.persistance.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@AllArgsConstructor
@Component
public class UserService {
    @Autowired
    private UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    //CRUD operations
    //C - create
    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.CLIENT);
        return userRepository.save(user);
    }

    //R - read
    public List<User> readUser() {
        return userRepository.findAll();
    }

    //U - update
    public User updateUser(User user, Integer id) {
        User newUser = userRepository.findById(id).get();

        if (Objects.nonNull(user.getUsername()) && !"".equalsIgnoreCase(user.getUsername())) {
            newUser.setUsername(user.getUsername());
        }

        if (Objects.nonNull(user.getPassword()) && !"".equalsIgnoreCase(user.getPassword())) {
            newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return userRepository.save(newUser);
    }

    //D - delete
    public String deleteUser(Integer id) {
        userRepository.deleteById(id);
        return "User deleted successfully.";
    }

    @Transactional
    public Integer checkUserExists(Integer userId) {
        if (userRepository.existsById(userId)) {
            return userId;
        } else {
            userId = null;
            return userId;
        }
    }

    public List<User> readAll() {
        return userRepository.findAll();
    }
}
