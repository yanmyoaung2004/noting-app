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

import com.yma.app.model.User;
import com.yma.app.service.UserService;

@RestController
@RequestMapping("api/user")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		super();
		this.userService = userService;
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
	
}
