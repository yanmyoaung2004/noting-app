package com.yma.app.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yma.app.dto.PublicNoteResponse;
import com.yma.app.model.Note;
import com.yma.app.model.User;
import com.yma.app.service.NoteService;

@RestController
@RequestMapping("api/public")
public class PublicRouteController {

	private final NoteService noteService;

	public PublicRouteController(NoteService noteService) {
		super();
		this.noteService = noteService;
	}

	@GetMapping("note/public/{token}")
	public ResponseEntity<PublicNoteResponse> getPublicNote(@PathVariable String token) {
		Note note = noteService.getNoteByShareToken(token);
		if (note == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		User owner = note.getUser();

		PublicNoteResponse.OwnerDto ownerDto = new PublicNoteResponse.OwnerDto(owner.getUsername(), owner.getEmail(),
				"/placeholder.svg?height=32&width=32");

		PublicNoteResponse response = new PublicNoteResponse(note.getId(), note.getTitle(), note.getContent(), ownerDto,
				note.getUpdatedAt().toString());
		return ResponseEntity.ok(response);
	}
}
