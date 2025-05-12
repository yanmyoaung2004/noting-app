package com.yma.app.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yma.app.custom_exception.ForbiddenAccessException;
import com.yma.app.custom_exception.NotFoundException;
import com.yma.app.model.Note;
import com.yma.app.model.User;
import com.yma.app.repository.NoteRepository;
import com.yma.app.service.NoteService;
import com.yma.app.service.UserService;

import jakarta.transaction.Transactional;

@Service
public class NoteServiceImpl implements NoteService {

	private final NoteRepository noteRepository;
	private final UserService userService;

	public NoteServiceImpl(NoteRepository noteRepository, UserService userService) {
		super();
		this.noteRepository = noteRepository;
		this.userService = userService;
	}

	@Override
	public List<Note> getAllNotes() {
		// TODO Auto-generated method stub
		return noteRepository.findAll();
	}

	@Override
	public List<Note> getAllNotesByUserId(Long id) {
		// TODO Auto-generated method stub
		User user = userService.getUserById(id);
		if (user == null) {
			throw new NotFoundException("User Not Found!");
		}
		return noteRepository.getAllNotesByUser(user);
	}

	@Override
	public Note createNote(Note note) {
		// TODO Auto-generated method stub
		return noteRepository.save(note);

	}

	@Override
	public Note getNoteById(Long id) {
		// TODO Auto-generated method stub
		Optional<Note> note = noteRepository.findById(id);
		if (note.isEmpty()) {
			throw new NotFoundException("Note Not Found!");
		}
		return note.get();
	}

	@Transactional
	@Override
	public void deleteNoteById(Long id, Long userId) {
		Optional<Note> noteOpt = noteRepository.findById(id);
		if (noteOpt.isEmpty()) {
			throw new NotFoundException("Note not found!");
		}

		Note note = noteOpt.get();
		User user = note.getUser();

		if (user == null || !user.getId().equals(userId)) {
			throw new ForbiddenAccessException("You do not have permission to delete this note.");
		}
		user.getNotes().remove(note);
		note.getSharedPermissions().forEach(np -> np.setNote(null));
		note.getSharedPermissions().clear();
	}

	@Override
	@Transactional
	public void softDeleteNoteById(Long id, Long userId) {
		Optional<Note> noteOpt = noteRepository.findById(id);
		if (noteOpt.isEmpty()) {
			throw new NotFoundException("Note not found!");
		}
		Note note = noteOpt.get();
		User user = note.getUser();
		if (user == null || !user.getId().equals(userId)) {
			throw new ForbiddenAccessException("You do not have permission to delete this note.");
		}
		note.setIsDeleted(true);
		note.setDeletedAt(LocalDateTime.now());
		noteRepository.save(note);
	}

	@Override
	public Note updateNote(Note note, Long id) {
		// TODO Auto-generated method stub
		Optional<Note> noteOptional = noteRepository.findById(id);
		if (noteOptional.isEmpty()) {
			throw new NotFoundException("Note Not Found!");
		}
		note.setUser(noteOptional.get().getUser());
		return noteRepository.save(note);
	}

	@Override
	public Note getNoteByShareToken(String shareToken) {
		return noteRepository.findNoteByShareToken(shareToken);
	}

	@Override
	public List<Note> getSharedNotesByUserEmail(String email) {
		User user = userService.getUserByEmail(email);
		if (user == null) {
			throw new NotFoundException("User Not Found!");
		}
		return noteRepository.findNotesSharedWithUser(email);
	}

	@Override
	public List<Note> getUserActiveNotes(Long userId) {
		User user = userService.getUserById(userId);
		if (user == null) {
			throw new NotFoundException("User Not Found!");
		}
		return noteRepository.findByUserAndIsDeletedFalse(user);
	}

	@Override
	public List<Note> getUserBinNotes(Long userId) {
		User user = userService.getUserById(userId);
		if (user == null) {
			throw new NotFoundException("User Not Found!");
		}
		return noteRepository.findByUserAndIsDeletedTrue(user);
	}

	@Override
	public void restoreNote(Long id) {
		Optional<Note> noteOptional = noteRepository.findById(id);
		if (noteOptional.isEmpty()) {
			throw new NotFoundException("Note Not Found!");
		}
		Note note = noteOptional.get();
		if (note.getIsDeleted()) {
			note.setIsDeleted(false);
			note.setDeletedAt(null);
			noteRepository.save(note);
		}
	}

	@Override
	public void deleteByIsDeletedTrueAndDeletedAtBefore(LocalDateTime cutoffDate) {
		noteRepository.deleteByIsDeletedTrueAndDeletedAtBefore(cutoffDate);
	}

	@Override
	public List<Long> getIdsOfNotesToBeDeleted(LocalDateTime cutoffDate) {
		return noteRepository.findIdsByIsDeletedTrueAndDeletedAtBefore(cutoffDate);

	}

}
