package com.yma.app.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yma.app.custom_exception.NotFoundException;
import com.yma.app.model.User;
import com.yma.app.model.UserSettings;
import com.yma.app.repository.UserRepository;
import com.yma.app.service.UserService;

@Service
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	public UserServiceImpl(UserRepository userRepository) {
		super();
		this.userRepository = userRepository;
	}

	@Override
	public List<User> getAllUsers() {
		// TODO Auto-generated method stub
		return userRepository.findAll();
	}

	@Override
	public void createUser(User user) {
		user.setUserSettings(new UserSettings(user));
		userRepository.save(user); 
		userRepository.save(user);
	}

	@Override
	public User getUserById(Long id) {
		// TODO Auto-generated method stub
		Optional<User> user = userRepository.findById(id);
		if (user.isEmpty()) {
			throw new NotFoundException("User Not Found!");
		}
		return user.get();
	}

	@Override
	public void deleteUserById(Long id) {
		Optional<User> user = userRepository.findById(id);
		if (user.isEmpty()) {
			throw new NotFoundException("User Not Found!");
		}
		userRepository.deleteById(id);

	}

	@Override
	public void updateUser(User user, Long id) {
		// TODO Auto-generated method stub
		Optional<User> userOptional = userRepository.findById(id);
		if (userOptional.isEmpty()) {
			throw new NotFoundException("User Not Found!");
		}
		userRepository.save(user);

	}

	@Override
	public User getUserByEmail(String email) {
		Optional<User> userOptional = userRepository.findByEmail(email);
		if (userOptional.isEmpty()) {
			throw new NotFoundException("User Not Found!");
		}
		return userOptional.get();

	}

	@Override
	public User getUserByEmailForShare(String email) {
		Optional<User> userOptional = userRepository.findByEmail(email);
		if(userOptional.isEmpty()) {
			return null;
		}
		return userOptional.get();
	}

}
