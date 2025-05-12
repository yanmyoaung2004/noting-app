package com.yma.app.dto;

public record UserSettingsRequest(String email, long userSettingsId,  boolean emailNotificationsEnabled, boolean shareNotificationsEnabled, boolean reminderNotificationsEnabled, boolean darkModeEnabled) {

}
