package com.yma.app.service;

import java.util.Optional;

import com.yma.app.model.Token;
import com.yma.app.model.User;

public interface TokenService {

	String generateToken(User user);
	
	Optional<Token> validateToken(String token);
	
	Optional<Token> findByToken(String token);
	
	void deleteAllTokenByUser(User user);
}
