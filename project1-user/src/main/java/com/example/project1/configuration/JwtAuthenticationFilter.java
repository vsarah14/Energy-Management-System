package com.example.project1.configuration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    public static final String HEADER_STRING = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer ";
    private final UserDetailsService userDetailsService;         //used to load user details based on the extracted username from the JWT

    //loads the user details, validates the token and creates an authentication token (stored in Spring Security Context)
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String header = request.getHeader(HEADER_STRING);
        final String jwt;
        final String user;
        if (header == null || !header.startsWith(TOKEN_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = header.substring(7);                              //extract the token; 7 from "Bearer "
        user = jwtService.extractUsername(jwt);                           //extract the username

        //if the user exists and he is not authenticated
        if (user != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails details = this.userDetailsService.loadUserByUsername(user);
            if (jwtService.isValidToken(jwt, details)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(details, null, details.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
