package com.snaptask.server.snaptask_server.service.auth;

import com.snaptask.server.snaptask_server.exceptions.customExceptions.JwtExpiredException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Function;

@Slf4j
@Service
public class JwtService {

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration;

    private final AtomicReference<Key> cachedKey = new AtomicReference<>();

    private Key getSignInKey() {
        if (cachedKey.get() == null) {
            byte[] keyBytes = Decoders.BASE64.decode(secretKey);
            cachedKey.set(Keys.hmacShaKeyFor(keyBytes));
        }
        return cachedKey.get();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        try {
            final Claims claims = extractAllClaims(token);
            return resolver.apply(claims);
        } catch (ExpiredJwtException e) {
            log.warn("JWT expired: {}", e.getMessage());
            throw new JwtExpiredException(e.getMessage());
        } catch (JwtException e) {
            log.warn("Invalid JWT: {}", e.getMessage());
            throw new JwtException("Invalid JWT token", e);
        }
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);

            if (!username.equals(userDetails.getUsername())) {
                log.warn("Token username mismatch: expected {}, got {}", userDetails.getUsername(), username);
                return false;
            }

            if (isTokenExpired(token)) {
                throw new JwtExpiredException("JWT token expired for user: " + username);
            }

            return true;
        }
        catch (ExpiredJwtException e) {
            throw new JwtExpiredException("JWT token expired: " + e.getMessage());
        }
        catch (JwtExpiredException e) {
            throw e;
        }
        catch (JwtException | IllegalArgumentException e) {
            log.error("Invalid JWT: {}", e.getMessage());
            throw new JwtException("Invalid JWT: " + e.getMessage());
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public long getExpirationTime() {
        return jwtExpiration;
    }
}
