package com.yma.app.service.impl;

import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.yma.app.custom_exception.AlreadyExistedException;
import com.yma.app.custom_exception.NotFoundException;
import com.yma.app.dto.LoginUserDto;
import com.yma.app.dto.RegisterUserDto;
import com.yma.app.model.User;
import com.yma.app.model.UserSettings;
import com.yma.app.repository.UserRepository;
import com.yma.app.service.AuthenticationService;


@Service
public class AuthenticationServiceImpl implements AuthenticationService {
	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final AuthenticationManager authenticationManager;

	public AuthenticationServiceImpl(UserRepository userRepository, AuthenticationManager authenticationManager,
			PasswordEncoder passwordEncoder) {
		this.authenticationManager = authenticationManager;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public User signup(RegisterUserDto input) {
		Optional<User> userOptional = userRepository.findByEmail(input.email());
		if(userOptional.isPresent()) {
			throw new AlreadyExistedException("User already existed with email : " + input.email());
		}
		String encodedPassword = passwordEncoder.encode(input.password());
		User user = new User(input.name(), input.email(), encodedPassword);
		user.setUserSettings(new UserSettings(user));
		userRepository.save(user); 
		return userRepository.save(user);
	}
	
	

	@Override
	public User authenticate(LoginUserDto input) {
		Optional<User> user = userRepository.findByEmail(input.email());
		if (user.isEmpty()) {
			throw new NotFoundException("User Not Found " + input.email());
		}
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(input.email(), input.password()));
		return user.get();
	}

	@Override
	public User resetPassword(User user, String password) {
		String encodedPassword = passwordEncoder.encode(password);
		user.setPassword(encodedPassword);
		return userRepository.save(user);
	}
}