package com.yma.app.service;

import com.yma.app.dto.LoginUserDto;
import com.yma.app.dto.RegisterUserDto;
import com.yma.app.model.User;

public interface AuthenticationService {

	User signup(RegisterUserDto userData);

	User authenticate(LoginUserDto userData);

	User resetPassword(User user, String password);

}
