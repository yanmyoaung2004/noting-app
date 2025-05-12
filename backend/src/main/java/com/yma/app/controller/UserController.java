package com.yma.app.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yma.app.custom_exception.NotFoundException;
import com.yma.app.dto.UserSettingsRequest;
import com.yma.app.model.User;
import com.yma.app.model.UserSettings;
import com.yma.app.service.UserService;
import com.yma.app.service.UserSettingsService;

@RestController
@RequestMapping("api/user")
public class UserController {

	private final UserService userService;
	private final UserSettingsService userSettingsService;	

	public UserController(UserService userService, UserSettingsService userSettingsService) {
		this.userService = userService;
		this.userSettingsService = userSettingsService;
	}

	@GetMapping("all")
	public ResponseEntity<List<User>> getAllUsers() {
		List<User> users = userService.getAllUsers();
		if (users.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(users);
	}

	@PostMapping("create")
	public ResponseEntity<String> createUser(@RequestBody User user) {
		userService.createUser(user);
		return new ResponseEntity<>("User is successfully created!", HttpStatus.CREATED);
	}

	@GetMapping("{id}/detail")
	public ResponseEntity<User> getUserById(@PathVariable Long id) {
		User user = userService.getUserById(id);
		return ResponseEntity.ok(user);
	}
	
	@GetMapping("{email}/email/detail")
	public ResponseEntity<User> getUserByEmail(@PathVariable String email){
		User user = userService.getUserByEmail(email);
		return ResponseEntity.ok(user);
	}

	@DeleteMapping("{id}/delete")
	public ResponseEntity<String> deleteUserById(@PathVariable Long id) {
		userService.deleteUserById(id);
		return ResponseEntity.ok("User is successfully deleted!");
	}

	@PutMapping("{id}/update")
	public ResponseEntity<String> updateUser(@RequestBody User user, @PathVariable Long id) {
		userService.updateUser(user, id);
		return ResponseEntity.ok("User is successfully updated!");
	}

	@PostMapping("/update-settings")
	public ResponseEntity<String> updateUserSettings(@RequestBody UserSettingsRequest request){
		String email = request.email();
		User user = userService.getUserByEmail(email);
		if(user == null){
			throw new NotFoundException("User Not Found!");
		}
		UserSettings userSettings = new UserSettings(request.userSettingsId(), user, request.emailNotificationsEnabled(), request.shareNotificationsEnabled(), request.reminderNotificationsEnabled(), request.darkModeEnabled());
		userSettingsService.updateUserSettings(user, userSettings);
		return ResponseEntity.ok("User Settings is successfully updated!");
	}
	
}
