package com.yma.app.service.impl;

import com.yma.app.model.User;
import com.yma.app.service.MailService;
import com.yma.app.service.TokenService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailServiceImpl implements MailService {

	private final JavaMailSender mailSender;
	private final TokenService tokenService;

	@Value("${app.admin.email}")
	private String adminEmail;

	@Value("${app.admin.frontendurl}")
	private String frontendUrl;

	public MailServiceImpl(JavaMailSender mailSender, TokenService tokenService) {
		this.mailSender = mailSender;
		this.tokenService = tokenService;
	}

	@Override
	public void sendForgotPasswordEmail(User user) {
		String token = tokenService.generateToken(user);
		String resetLink = String.format("%s/reset-password/%s", frontendUrl, token);

		try {
			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
			helper.setFrom(adminEmail);
			helper.setTo(user.getEmail());
			helper.setSubject("Password Reset Request");
			helper.setText(buildHtmlContent(resetLink, user.getUsername()), true);

			mailSender.send(mimeMessage);
		} catch (MessagingException e) {
			throw new RuntimeException("Failed to send reset email", e);
		}
	}

	private String buildHtmlContent(String resetLink, String firstName) {
		String name = (firstName != null && !firstName.isBlank()) ? firstName : "there";

		return String.format(
				"""
						<html>
						<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
						    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px;">
						        <h2 style="color: #333;">Hi %s,</h2>
						        <p>We received a request to reset your password.</p>
						        <p>Click the button below to set a new password (link expires in <strong>30 minutes</strong>):</p>

						        <div style="text-align: center; margin: 30px 0;">
						            <a href="%s"
						               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
						                Reset Password
						            </a>
						        </div>

						        <p>If you didn’t request this, you can safely ignore this email.</p>
						        <hr style="margin-top: 40px;">
						        <p style="font-size: 12px; color: #777;">If you need help, contact us at <a href="mailto:ymyo44277@gmail.com">ymyo44277@gmail.com</a>.</p>
						    </div>
						</body>
						</html>
						""",
				name, resetLink);
	}
}
