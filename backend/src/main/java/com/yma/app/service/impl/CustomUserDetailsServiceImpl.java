package com.yma.app.service.impl;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.yma.app.custom_exception.NotFoundException;
import com.yma.app.model.CustomUserDetails;
import com.yma.app.repository.UserRepository;
import com.yma.app.service.CustomUserDetailsService;


@Service
public class CustomUserDetailsServiceImpl implements CustomUserDetailsService {

	private final UserRepository userRepository;

	public CustomUserDetailsServiceImpl(UserRepository userRepository) {
		super();
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws NotFoundException {
		return userRepository.findByUsername(username)
				.orElseThrow(() -> new NotFoundException("User not found: " + username));
	}

	public CustomUserDetails loadUserByEmail(String email) throws NotFoundException {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new NotFoundException("User not found with email: " + email));
	}

}
