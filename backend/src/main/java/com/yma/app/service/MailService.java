package com.yma.app.service;

import com.yma.app.model.User;

public interface MailService {
	
	public void sendForgotPasswordEmail(User user);
	
}
