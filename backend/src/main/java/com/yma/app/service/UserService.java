package com.yma.app.service;

import java.util.List;

import com.yma.app.model.User;

public interface UserService {

	List<User> getAllUsers();

	void createUser(User user);

	User getUserById(Long id);

	User getUserByEmail(String email);

	void deleteUserById(Long id);

	void updateUser(User user, Long id);

}
