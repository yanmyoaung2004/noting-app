package com.yma.app.service;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.yma.app.custom_exception.NotFoundException;
import com.yma.app.model.CustomUserDetails;

public interface CustomUserDetailsService extends UserDetailsService {

	public CustomUserDetails loadUserByEmail(String email) throws NotFoundException;

}
