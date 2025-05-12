package com.yma.app.config;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import com.yma.app.model.CustomUserDetails;

public class EmailPrincipalHandshakeHandler extends DefaultHandshakeHandler {
	
	@Override
	protected Principal determineUser(ServerHttpRequest request,
			WebSocketHandler wsHandler, Map<String, Object> attributes) {
		CustomUserDetails userDetails = (CustomUserDetails) attributes.get("user");
        return () -> userDetails.getEmail();
		
	}
}
