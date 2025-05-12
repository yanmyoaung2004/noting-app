package com.yma.app.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yma.app.dto.ForgotPasswordRequest;
import com.yma.app.dto.LoginResponse;
import com.yma.app.dto.LoginUserDto;
import com.yma.app.dto.RegisterUserDto;
import com.yma.app.dto.ResetPasswordRequest;
import com.yma.app.dto.ResetPasswordViaProfileRequest;
import com.yma.app.model.Token;
import com.yma.app.model.User;
import com.yma.app.service.AuthenticationService;
import com.yma.app.service.JwtService;
import com.yma.app.service.MailService;
import com.yma.app.service.TokenService;
import com.yma.app.service.UserService;

@RequestMapping("/api/auth")
@RestController
public class AuthenticationController {

	private final JwtService jwtService;
	private final AuthenticationService authenticationService;
	private final UserService userService;
	private final MailService mailService;
	private final TokenService tokenService;

	public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService,
			UserService userService, MailService mailService, TokenService tokenService) {
		super();
		this.jwtService = jwtService;
		this.authenticationService = authenticationService;
		this.userService = userService;
		this.mailService = mailService;
		this.tokenService = tokenService;
	}

	@PostMapping("/signup")
	public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
		User registeredUser = authenticationService.signup(registerUserDto);
		return ResponseEntity.ok(registeredUser);
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
		User authenticatedUser = authenticationService.authenticate(loginUserDto);
		String jwtToken = jwtService.generateToken(authenticatedUser);
		LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());
		return ResponseEntity.ok(loginResponse);
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
		String email = request.email();
		User user = userService.getUserByEmail(email);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Not Found!");
		}
		mailService.sendForgotPasswordEmail(user);
		return ResponseEntity.ok("Email has been sent!");

	}

	@PostMapping("/reset-password")
	public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
		String password = request.password();
		String token = request.token();
		Optional<Token> tokenObj = tokenService.findByToken(token);
		if (tokenObj.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token!");
		}
		if (authenticationService.resetPassword(tokenObj.get().getUser(), password) == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token!");
		}
		tokenService.deleteAllTokenByUser(tokenObj.get().getUser());
		return ResponseEntity.ok("Password has been reset!");
	}

	@PostMapping("/change-password")
	public ResponseEntity<String> changePasswordViaProfile(@RequestBody ResetPasswordViaProfileRequest request) {
		String currentPassword = request.currentPassword();
		String newPassword = request.newPassword();
		String email = request.email();
		User authenticatedUser = authenticationService.authenticate(new LoginUserDto(email, currentPassword));
		if (authenticatedUser != null) {
			User user = authenticationService.resetPassword(authenticatedUser, newPassword);
			if (user != null) {
				return ResponseEntity.ok("Password has been changed successfully!");
			} else {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to reset password");
			}
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
		}
	}

	@GetMapping("/validate-token/{token}")
	public ResponseEntity<String> validateToken(@PathVariable String token) {
		Optional<Token> validToken = tokenService.validateToken(token);
		if (validToken.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token!");
		}
		return ResponseEntity.ok("The token is valid!");
	}
	

}
