package com.yma.app.service;

import java.time.LocalDateTime;
import java.util.List;

import com.yma.app.model.Note;

public interface NoteService {

	List<Note> getAllNotes();

	List<Note> getAllNotesByUserId(Long id);

	List<Note> getSharedNotesByUserEmail(String email);

	Note createNote(Note note);

	Note getNoteById(Long id);

	void deleteNoteById(Long id, Long userId);

	void softDeleteNoteById(Long id, Long userId);

	void restoreNote(Long id);

	Note updateNote(Note user, Long id);

	Note getNoteByShareToken(String shareToken);

	List<Note> getUserActiveNotes(Long userId);

	List<Note> getUserBinNotes(Long userId);

	void deleteByIsDeletedTrueAndDeletedAtBefore(LocalDateTime cutoffDate);

	List<Long> getIdsOfNotesToBeDeleted(LocalDateTime cutoffDate);
}
