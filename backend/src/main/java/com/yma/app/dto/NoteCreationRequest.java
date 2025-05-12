package com.yma.app.dto;

import com.yma.app.model.Note;

public record NoteCreationRequest(Note note, String email) {

}
