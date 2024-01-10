package com.example.project1.controller;

import com.example.project1.business.UserService;
import com.example.project1.model.User;
import jakarta.persistence.PreUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@EnableMethodSecurity
@CrossOrigin
public class UserController {
    @Autowired
    private final UserService userService;
    @Autowired
    private RestTemplate restTemplate;
    public UserController(UserService clientService) {
        this.userService = clientService;
    }

    //CRUD operations for users
    //C - create
    @PostMapping("/user/create")
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    //R - read
    @GetMapping("/user/read")
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public List<User> readUser() {
        return userService.readUser();
    }

    //U - update
    @PutMapping("/user/update/{userId}")
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public User updateUser(@RequestBody User user, @PathVariable("userId") Integer id) {
        return userService.updateUser(user, id);
    }

    //D - delete
    @DeleteMapping("/user/delete/{userId}")
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public String deleteUser(@PathVariable("userId") Integer id) {
        String deviceMicroserviceUrl = "http://localhost:8081";
      //  String deviceMicroserviceUrl = "http://device-microservice:8081";
        restTemplate.delete(deviceMicroserviceUrl + "/api/device/deleteByUserId/{userId}", id);
        return userService.deleteUser(id);
    }

    @GetMapping("/api/user/readIds/{userId}")
    public Integer checkUsersExists(@PathVariable Integer userId){
        return userService.checkUserExists(userId);
    }

    @GetMapping("/user/getAll")
    public List<User> readAll() {
        return userService.readAll();
    }
}
