package com.yma.app.controller;

import java.util.ArrayList;
import java.util.List;
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
import com.yma.app.dto.NoteCreationRequest;
import com.yma.app.dto.PermissionUpdateRequest;
import com.yma.app.dto.ShareNoteRequest;
import com.yma.app.dto.ShareNoteResponse;
import com.yma.app.dto.ShareWithLinkRequest;
import com.yma.app.dto.ShareWithLinkResponse;
import com.yma.app.dto.UserValidateRequest;
import com.yma.app.model.Note;
import com.yma.app.model.NotePermission;
import com.yma.app.model.PermissionLevel;
import com.yma.app.model.User;
import com.yma.app.service.NotePermissionService;
import com.yma.app.service.NoteService;
import com.yma.app.service.UserService;

@RestController
@RequestMapping("api/note")
public class NoteController {

	private final NoteService noteService;
	private final UserService userService;
	private final NotePermissionService notePermissionService;

	public NoteController(NoteService noteService, UserService userService,
			NotePermissionService notePermissionService) {
		super();
		this.noteService = noteService;
		this.userService = userService;
		this.notePermissionService = notePermissionService;
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
	public ResponseEntity<List<Note>> getAllNotesByUserEmail(@RequestParam String email) {
		User user = userService.getUserByEmail(email);
		List<Note> notes = noteService.getAllNotesByUserId(user.getId());
		return ResponseEntity.ok(notes);
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
			for (NotePermission p : notePermissions) {
				if (p.getId().equals(permissionId)) {
					p.setPermissionLevel(newLevel);
					updated = true;
					break;
				}
			}

			if (updated) {
				noteService.updateNote(note, noteId);
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
		noteService.deleteNoteById(id, user.getId());
		return ResponseEntity.ok("Note is successfully deleted!");
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
		List<NotePermission> sharedUserDtos = new ArrayList<>();

		for (ShareNoteRequest req : requests) {
			User user = userService.getUserByEmail(req.email());
			if (user == null)
				continue;

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
				sharedUserDtos.add(permission);
			}
		}
		note.getSharedPermissions().addAll(newPermissions);
		Note newNote = noteService.updateNote(note, noteId);
		newNote.getSharedPermissions();
		return ResponseEntity.ok(new ShareNoteResponse("Note successfully shared with specified users!",
				newNote.getSharedPermissions()));
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
	public ResponseEntity<ShareWithLinkResponse> shareWithLink(@PathVariable Long noteId, @RequestBody ShareWithLinkRequest request) {
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


	

}
