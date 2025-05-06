package com.yma.app.service.impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.yma.app.model.CustomUserDetails;
import com.yma.app.service.JwtService;


@Service
public class JwtServiceImpl implements JwtService {
	@Value("${security.jwt.secret-key}")
	private String secretKey;

	@Value("${security.jwt.expiration-time}")
	private long jwtExpiration;

	@Override
	public String extractEmail(String token) {
		return extractClaim(token, claims -> claims.get("email", String.class));
	}
	
	@Override
	public String extractId(String token) {
		return extractClaim(token, Claims::getSubject);
	}

	@Override
	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}

	@Override
	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}

	@Override
	public String generateToken(UserDetails userDetails) {
		return generateToken(new HashMap<>(), userDetails);
	}

	@Override
	public long getExpirationTime() {
		return jwtExpiration;
	}

	@Override
	public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
		return buildToken(extraClaims, userDetails, jwtExpiration);
	}

	private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
		if (!(userDetails instanceof CustomUserDetails)) {
			throw new IllegalArgumentException("UserDetails should be of type CustomUserDetails");
		}
		CustomUserDetails customUserDetails = (CustomUserDetails) userDetails;
		extraClaims.put("email", customUserDetails.getEmail());
		return Jwts.builder().setClaims(extraClaims).setSubject(customUserDetails.getId().toString())
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + expiration))
				.signWith(getSignInKey(), SignatureAlgorithm.HS256).compact();
	}

	@Override
	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String id = extractId(token);
		if (!(userDetails instanceof CustomUserDetails)) {
			throw new IllegalArgumentException("UserDetails should be of type CustomUserDetails");
		}
		CustomUserDetails customUserDetails = (CustomUserDetails) userDetails;
		return (id.equals(customUserDetails.getId().toString())) && !isTokenExpired(token);
	}

	private boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	private Date extractExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(token).getBody();
	}

	private Key getSignInKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secretKey);
		return Keys.hmacShaKeyFor(keyBytes);
	}
}