package com.yma.app.response;


public record LoginResponse(String token, Long expiresIn, LoginResponseUser user) {
}

