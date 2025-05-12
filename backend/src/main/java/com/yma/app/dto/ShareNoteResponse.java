package com.yma.app.dto;

import java.util.List;

import com.yma.app.model.NotePermission;

public record ShareNoteResponse(String message, List<NotePermission> sharedUsers) {

}
