package com.yma.app.dto;

public record ResetPasswordViaProfileRequest(String currentPassword, String newPassword, String email) {

}
