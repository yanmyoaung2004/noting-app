package com.yma.app.dto;


public record LoginResponse(String token, Long expiresIn) {
}

