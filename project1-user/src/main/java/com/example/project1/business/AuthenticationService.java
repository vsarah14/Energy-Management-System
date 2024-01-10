package com.example.project1.business;

import com.example.project1.auth.AuthenticationRequest;
import com.example.project1.auth.AuthenticationResponse;
import com.example.project1.configuration.JwtService;
import com.example.project1.persistance.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Component
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JwtService service;
    private final AuthenticationManager manager;

    //login
    public AuthenticationResponse loginUser(AuthenticationRequest request) {
        manager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        var token = service.generateToken(user);
        return AuthenticationResponse.builder().token(token).build();
    }
}
