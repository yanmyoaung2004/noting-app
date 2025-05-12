package com.yma.app.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import com.yma.app.model.CustomUserDetails;
import com.yma.app.service.CustomUserDetailsService;
import com.yma.app.service.JwtService;

import java.util.Map;

@Component
public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

	private final JwtService jwtService;
	private final CustomUserDetailsService userDetailsService;

	public WebSocketHandshakeInterceptor(JwtService jwtService, CustomUserDetailsService userDetailsService) {
		super();
		this.jwtService = jwtService;
		this.userDetailsService = userDetailsService;
	}

	@Override
	public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
			Map<String, Object> attributes) throws Exception {

		if (request instanceof ServletServerHttpRequest servletRequest) {
			HttpServletRequest httpRequest = servletRequest.getServletRequest();
			String token = httpRequest.getParameter("token");
			if (token != null) {
				String email = jwtService.extractEmail(token);
				if (email != null) {
					CustomUserDetails userDetails = userDetailsService.loadUserByEmail(email);
					attributes.put("user", userDetails);
				}
			}
		}

		return true;
	}

	@Override
	public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
			Exception exception) {
	}
}
