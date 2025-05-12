package com.yma.app.dto;

import java.time.Instant;

public record NotificationListResponse(Long id, String type, String status, Long noteId, String noteTitle,
		NotificationUser fromUser, String permission, Instant createdAt) {
}
