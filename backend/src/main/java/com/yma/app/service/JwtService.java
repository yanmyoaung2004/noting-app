package com.yma.app.service;

import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;

import io.jsonwebtoken.Claims;

public interface JwtService {
	
	public String extractId(String token);
	
	public String extractEmail(String token);

	public String extractUsername(String token);

	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

	public String generateToken(UserDetails userDetails);

	public String generateToken(Map<String, String> extraClaims, UserDetails userDetails);

	public long getExpirationTime();

	public boolean isTokenValid(String token, UserDetails userDetails);

}
