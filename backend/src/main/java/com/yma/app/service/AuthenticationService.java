package com.yma.app.service;

import com.yma.app.dto.LoginUserDto;
import com.yma.app.dto.RegisterUserDto;
import com.yma.app.model.User;

public interface AuthenticationService {

	public User signup(RegisterUserDto userData);

	public User authenticate(LoginUserDto userData);

}
