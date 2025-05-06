package com.yma.app.service;

import java.util.List;

import com.yma.app.model.Note;

public interface NoteService {

	List<Note> getAllNotes();

	List<Note> getAllNotesByUserId(Long id);

	List<Note> getSharedNotesByUserEmail(String email);

	Note createNote(Note note);

	Note getNoteById(Long id);

	void deleteNoteById(Long id, Long userId);

	Note updateNote(Note user, Long id);

	Note getNoteByShareToken(String shareToken);

}
