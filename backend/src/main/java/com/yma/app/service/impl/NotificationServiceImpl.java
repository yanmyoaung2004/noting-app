package com.yma.app.service.impl;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.yma.app.dto.NotificationListResponse;
import com.yma.app.dto.InviteNotificationResponse;
import com.yma.app.dto.NotePermissionUpdateToNoteOwnerResponse;
import com.yma.app.dto.NotificationStatus;
import com.yma.app.dto.RemoveNotificationResponse;
import com.yma.app.dto.ShareNoteUpdatePermission;
import com.yma.app.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

	private SimpMessagingTemplate messagingTemplate;

	public NotificationServiceImpl(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
	}

	@Override
	public void sendInvitateNotificationToEmail(String invitedUserEmail, NotificationListResponse newNotification) {
		messagingTemplate.convertAndSendToUser(invitedUserEmail, "/queue/invitations",
				new InviteNotificationResponse(newNotification, NotificationStatus.INVITE.toString()));
	}

	@Override
	public void removeInviteNotificationToEmail(String invitedUserEmail, Long notePermissionId, Long noteId, String permissionStatus) {
		messagingTemplate.convertAndSendToUser(invitedUserEmail, "/queue/invitations",
				new RemoveNotificationResponse(notePermissionId, noteId, NotificationStatus.DELETE.toString(), permissionStatus));
	}

	@Override
	public void updateSharePermissionNotification(String targetEmail, ShareNoteUpdatePermission updatedPermission) {
		messagingTemplate.convertAndSendToUser(targetEmail, "/queue/invitations", updatedPermission);
	}

	@Override
	public void updateNotePermissoinStatusToNoteOwner(String targetEmail,
			NotePermissionUpdateToNoteOwnerResponse updatedPermission) {
		messagingTemplate.convertAndSendToUser(targetEmail, "/queue/invitations", updatedPermission);
	}

}
