package com.yma.app.dto;

public record NotePermissionUpdateToNoteOwnerResponse(Long noteId, Long permissionId, String acceptRejectStatus, String status) {

}
