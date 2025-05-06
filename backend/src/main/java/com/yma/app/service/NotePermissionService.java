package com.yma.app.service;

import com.yma.app.model.NotePermission;

public interface NotePermissionService {

	void deletePermissionById(Long id);

	NotePermission getPermissionById(Long id);
}
