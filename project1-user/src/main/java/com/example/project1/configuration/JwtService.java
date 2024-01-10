package com.example.project1.configuration;

import com.example.project1.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    //encryption key 512-bit
    private static final String SECRET_KEY = "753778214125442A472D4B6150645367566B58703273357638792F423F4528482B4D6251655468576D5A7133743677397A24432646294A404E635266556A586E";

    //extracts the username (subject)
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    //extracts a specific claim from JWT
    public <T> T extractClaim(String token, Function<Claims, T> claimsTFunction) {
        final Claims claims = extractAllClaims(token);
        return claimsTFunction.apply(claims);
    }

    //custom claims: role, id
    public String generateToken(User userDetails) {
        return generateToken(new HashMap<>(){{
            put("role", userDetails.getRole());
            put("id", userDetails.getUserId());
        }}, userDetails);
    }

    //generates token with custom claims along with standard claims
    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 864000000))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    //checks if a JWT is valid
    public boolean isValidToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isExpiredToken(token);
    }

    //checks if a JWT has expired
    private boolean isExpiredToken(String token) {
        return extractExpDate(token).before(new Date());
    }

    //extracts the expiration date
    private Date extractExpDate(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    //responsible for extracting all claims of a JWT
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    //responsible for obtaining the signing key used in the JWT verification
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
