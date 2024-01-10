package com.example.project1.controller;

import com.example.project1.auth.AuthenticationRequest;
import com.example.project1.auth.AuthenticationResponse;
import com.example.project1.business.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@EnableMethodSecurity
@CrossOrigin
public class AuthenticationController {

    private final AuthenticationService service;

    //login
    @PostMapping("/api/login/user")
    public ResponseEntity<AuthenticationResponse> loginUser(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.loginUser(request));
    }
}
