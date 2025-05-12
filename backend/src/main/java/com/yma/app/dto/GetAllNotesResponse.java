package com.yma.app.dto;

import java.util.List;

import com.yma.app.model.Note;

public record GetAllNotesResponse(List<Note> activeNotes, List<Note> binNotes) {

}
