package com.yma.app.dto;

public record ShareNoteUpdatePermission(Long noteId, Long notePermissionId, String permissionLevel, NotificationStatus status) {

}
