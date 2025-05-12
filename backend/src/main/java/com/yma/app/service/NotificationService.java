package com.yma.app.service;

import com.yma.app.dto.NotePermissionUpdateToNoteOwnerResponse;
import com.yma.app.dto.NotificationListResponse;
import com.yma.app.dto.ShareNoteUpdatePermission;

public interface NotificationService {

	void sendInvitateNotificationToEmail(String invitedUserEmail, NotificationListResponse newNotification);

	void removeInviteNotificationToEmail(String invitedUserEmail, Long notePermissionId, Long noteId,
			String permissionStatus);

	void updateSharePermissionNotification(String targetEmail, ShareNoteUpdatePermission updatedPermission);
	
	void updateNotePermissoinStatusToNoteOwner(String targetEmail, NotePermissionUpdateToNoteOwnerResponse updatedPermission);

}
