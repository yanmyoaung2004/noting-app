package com.yma.app.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yma.app.custom_exception.NotFoundException;
import com.yma.app.dto.GetAllNotesResponse;
import com.yma.app.dto.NoteCreationRequest;
import com.yma.app.dto.NotePermissionUpdateToNoteOwnerResponse;
import com.yma.app.dto.NotificationListResponse;
import com.yma.app.dto.NotificationStatus;
import com.yma.app.dto.NotificationUser;
import com.yma.app.dto.PermissionUpdateRequest;
import com.yma.app.dto.ShareNoteRequest;
import com.yma.app.dto.ShareNoteResponse;
import com.yma.app.dto.ShareNoteUpdatePermission;
import com.yma.app.dto.ShareWithLinkRequest;
import com.yma.app.dto.ShareWithLinkResponse;
import com.yma.app.dto.UserValidateRequest;
import com.yma.app.model.Note;
import com.yma.app.model.NotePermission;
import com.yma.app.model.PermissionLevel;
import com.yma.app.model.User;
import com.yma.app.service.NotePermissionService;
import com.yma.app.service.NoteService;
import com.yma.app.service.NotificationService;
import com.yma.app.service.UserService;

@RestController
@RequestMapping("api/note")
public class NoteController {

	private final NoteService noteService;
	private final UserService userService;
	private final NotePermissionService notePermissionService;
	private final NotificationService notificationService;

	public NoteController(NoteService noteService, UserService userService, NotePermissionService notePermissionService,
			NotificationService notificationService) {
		super();
		this.noteService = noteService;
		this.userService = userService;
		this.notePermissionService = notePermissionService;
		this.notificationService = notificationService;
	}

	@GetMapping("req/all")
	public ResponseEntity<List<Note>> getAllNotes() {
		List<Note> notes = noteService.getAllNotes();
		if (notes.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(notes);
	}

	@GetMapping("all")
	public ResponseEntity<GetAllNotesResponse> getAllNotesByUserEmail(@RequestParam String email) {
		User user = userService.getUserByEmail(email);
		List<Note> activeNotes = noteService.getUserActiveNotes(user.getId());
		List<Note> binNotes = noteService.getUserBinNotes(user.getId());
		return ResponseEntity.ok(new GetAllNotesResponse(activeNotes, binNotes));
	}

	@GetMapping("/shared")
	public ResponseEntity<List<Note>> getSharedNotesByUserEmail(@RequestParam String email) {
		List<Note> notes = noteService.getSharedNotesByUserEmail(email);
		return ResponseEntity.ok(notes);
	}

	@GetMapping("getshareusers/{noteId}")
	public ResponseEntity<List<NotePermission>> getAllNotesByUserId(@PathVariable Long noteId) {
		Note note = noteService.getNoteById(noteId);
		return ResponseEntity.ok(note.getSharedPermissions());
	}

	@PutMapping("/permissions/{permissionId}/notes/{noteId}")
	public ResponseEntity<String> updateUserPermission(@PathVariable Long permissionId, @PathVariable Long noteId,
			@RequestBody PermissionUpdateRequest request) {
		String permission = request.permissionLevel();
		Note note = noteService.getNoteById(noteId);
		List<NotePermission> notePermissions = note.getSharedPermissions();

		try {
			PermissionLevel newLevel = PermissionLevel.valueOf(permission.toUpperCase());
			boolean updated = false;
			NotePermission notePermission = null;
			for (NotePermission p : notePermissions) {
				if (p.getId().equals(permissionId)) {
					p.setPermissionLevel(newLevel);
					notePermission = p;
					updated = true;
					break;
				}
			}
			if (updated) {
				noteService.updateNote(note, noteId);
				notificationService.updateSharePermissionNotification(notePermission.getUser().getEmail(),
						new ShareNoteUpdatePermission(noteId, permissionId, permission,
								NotificationStatus.UPDATE_PERMISSION));
				return ResponseEntity.ok("Permission updated successfully.");
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Permission not found.");
			}

		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body("Invalid permission level.");
		}
	}

	@PostMapping("create")
	public ResponseEntity<Note> createNote(@RequestBody NoteCreationRequest request) {
		Note note = request.note();
		String email = request.email();
		note.setUser(userService.getUserByEmail(email));
		Note newNote = noteService.createNote(note);
		return new ResponseEntity<>(newNote, HttpStatus.CREATED);
	}

	@GetMapping("{id}/detail")
	public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
		Note note = noteService.getNoteById(id);
		return ResponseEntity.ok(note);
	}

	@DeleteMapping("{id}/delete/user/{email}")
	public ResponseEntity<String> deleteNoteById(@PathVariable Long id, @PathVariable String email) {
		User user = userService.getUserByEmail(email);
		noteService.softDeleteNoteById(id, user.getId());
		return ResponseEntity.ok("Note is successfully deleted!");
	}

	@DeleteMapping("{id}/permanent-delete/user/{email}")
	public ResponseEntity<String> deleteNotePermanentById(@PathVariable Long id, @PathVariable String email) {
		User user = userService.getUserByEmail(email);
		noteService.deleteNoteById(id, user.getId());
		return ResponseEntity.ok("Note is permanently deleted!");
	}

	@PutMapping("{id}/restore")
	public ResponseEntity<String> restoreNoteById(@PathVariable Long id) {
		Note note = noteService.getNoteById(id);
		if (note == null) {
			return ResponseEntity.status(HttpStatus.GONE).body("Note is no longer available.");
		}
		noteService.restoreNote(id);
		return ResponseEntity.ok("Note is successfully restored!");
	}

	@PutMapping("{id}/update")
	public ResponseEntity<Note> updateNote(@RequestBody Note updatedData, @PathVariable Long id) {
		Note existingNote = noteService.getNoteById(id);

		if (existingNote == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		if (updatedData.getTitle() != null) {
			existingNote.setTitle(updatedData.getTitle());
		}
		if (updatedData.getContent() != null) {
			existingNote.setContent(updatedData.getContent());
		}
		if (updatedData.getAccessLevel() != null) {
			existingNote.setAccessLevel(updatedData.getAccessLevel());
		}
		Note savedNote = noteService.updateNote(existingNote, id);
		return ResponseEntity.ok(savedNote);
	}

	@PutMapping("removepermission/{permissionId}/note/{noteId}")
	public ResponseEntity<String> removeUserFromSharedList(@PathVariable Long noteId, @PathVariable Long permissionId) {
		Note note = noteService.getNoteById(noteId);
		if (note == null) {
			throw new NotFoundException("Note Not Found!");
		}

		List<NotePermission> notePermissions = note.getSharedPermissions();
		NotePermission toRemove = null;

		for (NotePermission permission : notePermissions) {
			if (permission.getId().equals(permissionId)) {
				toRemove = permission;
				break;
			}
		}

		if (toRemove != null) {
			notePermissions.remove(toRemove);
			notePermissionService.deletePermissionById(permissionId);
			noteService.updateNote(note, noteId);
			notificationService.removeInviteNotificationToEmail(toRemove.getUser().getEmail(), permissionId,
					note.getId(), toRemove.getStatus().toString());
			return ResponseEntity.ok("User removed from shared list.");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Permission not found.");
		}
	}

	@PutMapping("{noteId}/shareuser")
	public ResponseEntity<ShareNoteResponse> shareNoteWithOtherUsers(@RequestBody List<ShareNoteRequest> requests,
			@PathVariable Long noteId) {

		Note note = noteService.getNoteById(noteId);
		if (note == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(new ShareNoteResponse("Note Not Found!", List.of()));
		}

		List<NotePermission> newPermissions = new ArrayList<>();
		for (ShareNoteRequest req : requests) {
			User user = userService.getUserByEmailForShare(req.email());
			if (user == null) {
				System.out.println("Send email to that user!");
				continue;
			}

			PermissionLevel level;
			try {
				level = PermissionLevel.valueOf(req.permission().toUpperCase());
			} catch (IllegalArgumentException e) {
				return ResponseEntity.badRequest()
						.body(new ShareNoteResponse("Invalid permission: " + req.permission(), List.of()));
			}
			boolean alreadyShared = note.getSharedPermissions().stream()
					.anyMatch(p -> p.getUser().getId().equals(user.getId()));
			if (!alreadyShared) {
				NotePermission permission = new NotePermission(note, user, level);
				newPermissions.add(permission);
				note.getSharedPermissions().addAll(newPermissions);
				Note newNote = noteService.updateNote(note, noteId);
				Optional<NotePermission> notePermissionOptional = newNote.getSharedPermissions().stream()
						.filter(sp -> sp.getUser().getEmail().equals(user.getEmail())).findFirst();
				NotePermission notePermission = notePermissionOptional.get();
				NotificationListResponse newNotification = new NotificationListResponse(notePermission.getId(), "share",
						notePermission.getStatus().toString(), noteId, note.getTitle(),
						new NotificationUser(note.getUser().getId(), note.getUser().getUsername(),
								note.getUser().getEmail()),
						notePermission.getPermissionLevel().toString(), notePermission.getCreatedAt());
				notificationService.sendInvitateNotificationToEmail(req.email(), newNotification);
			}
		}
		return ResponseEntity.ok(
				new ShareNoteResponse("Note successfully shared with specified users!", note.getSharedPermissions()));
	}

	@PostMapping("validate/user")
	public ResponseEntity<String> validateUser(@RequestBody UserValidateRequest request) {
		String email = request.email();
		User user = userService.getUserByEmail(email);
		if (user == null) {
			throw new NotFoundException("User not found with email: " + email);
		}
		return ResponseEntity.ok("User is valid!");
	}

	@PutMapping("/share/link/{noteId}")
	public ResponseEntity<ShareWithLinkResponse> shareWithLink(@PathVariable Long noteId,
			@RequestBody ShareWithLinkRequest request) {
		String accessLevel = request.accessLevel();
		Note note = noteService.getNoteById(noteId);
		note.setShareToken(UUID.randomUUID().toString());
		note.setPubliclyShared(true);
		note.setAccessLevel(accessLevel);
		noteService.updateNote(note, noteId);
		return ResponseEntity.ok(new ShareWithLinkResponse(note.getShareToken()));
	}

	@PutMapping("/private/link/{noteId}")
	public ResponseEntity<String> changeToPrivate(@PathVariable Long noteId) {
		Note note = noteService.getNoteById(noteId);
		if (note == null) {
			return ResponseEntity.notFound().build();
		}
		note.setAccessLevel("private");
		note.setShareToken(null);
		note.setPubliclyShared(false);
		noteService.updateNote(note, noteId);
		return ResponseEntity.ok("Note visibility changed to private.");
	}

	@GetMapping("/notifications/pending/{email}")
	public ResponseEntity<List<NotificationListResponse>> getAllPendingNotification(@PathVariable String email) {
		User user = userService.getUserByEmail(email);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
		}
		List<NotePermission> notePermissions = notePermissionService.getUserPendingPermissions(user);
		List<NotificationListResponse> notifications = this.formatNotificationData(notePermissions, email);
		return ResponseEntity.ok(notifications);
	}

	@GetMapping("/notifications/rejected/{email}")
	public ResponseEntity<List<NotificationListResponse>> getAllRejectedNotification(@PathVariable String email) {
		User user = userService.getUserByEmail(email);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
		}
		List<NotePermission> notePermissions = notePermissionService.getUserRejectedPermissions(user);
		List<NotificationListResponse> notifications = this.formatNotificationData(notePermissions, email);
		return ResponseEntity.ok(notifications);
	}

	@GetMapping("/notifications/accepted/{email}")
	public ResponseEntity<List<NotificationListResponse>> getAllAcceptedNotification(@PathVariable String email) {
		User user = userService.getUserByEmail(email);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
		}
		List<NotePermission> notePermissions = notePermissionService.getUserAcceptedPermissions(user);
		List<NotificationListResponse> notifications = this.formatNotificationData(notePermissions, email);
		return ResponseEntity.ok(notifications);
	}

	@GetMapping("/notifications/all/{email}")
	public ResponseEntity<List<NotificationListResponse>> getAllNotification(@PathVariable String email) {
		User user = userService.getUserByEmail(email);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
		}
		List<NotePermission> notePermissions = notePermissionService.getAllByUser(user);
		List<NotificationListResponse> notifications = this.formatNotificationData(notePermissions, email);
		return ResponseEntity.ok(notifications);
	}

	private List<NotificationListResponse> formatNotificationData(List<NotePermission> notePermissions, String email) {
		return notePermissions.stream().sorted(Comparator.comparing(NotePermission::getCreatedAt).reversed())
				.map(np -> new NotificationListResponse(np.getId(), "share", np.getStatus().toString(),
						np.getNote().getId(), np.getNote().getTitle(),
						new NotificationUser(np.getNote().getUser().getId(), np.getNote().getUser().getUsername(),
								np.getNote().getUser().getEmail()),
						np.getPermissionLevel().toString(), np.getCreatedAt()))
				.toList();
	}

	@PutMapping("invitation/update-status/{status}/{id}")
	public ResponseEntity<Note> updateInvitationStatus(@PathVariable String status, @PathVariable Long id) {
		NotePermission notePermission = notePermissionService.updateNotePermisson(status, id);
		notificationService.updateNotePermissoinStatusToNoteOwner(notePermission.getNote().getUser().getEmail(),
				new NotePermissionUpdateToNoteOwnerResponse(notePermission.getNote().getId(), id, status, NotificationStatus.UPDATE_REJECT.toString()));
		return ResponseEntity.ok(notePermission.getNote());
	}

}
