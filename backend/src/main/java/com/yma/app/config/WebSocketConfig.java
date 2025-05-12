package com.yma.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	private final WebSocketHandshakeInterceptor handshakeInterceptor;

	public WebSocketConfig(WebSocketHandshakeInterceptor handshakeInterceptor) {
		super();
		this.handshakeInterceptor = handshakeInterceptor;
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		config.enableSimpleBroker("/queue");
		config.setApplicationDestinationPrefixes("/app");
		config.setUserDestinationPrefix("/user");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/ws-notifications").setAllowedOrigins("http://localhost:5173")
			.setHandshakeHandler(new EmailPrincipalHandshakeHandler())
				.addInterceptors(handshakeInterceptor).withSockJS();
	}
}
