package com.yma.app.service;

import java.util.List;

import com.yma.app.model.NotePermission;
import com.yma.app.model.User;

public interface NotePermissionService {

	void deletePermissionById(Long id);

	NotePermission getPermissionById(Long id);

	List<NotePermission> getUserPendingPermissions(User user);

	List<NotePermission> getUserAcceptedPermissions(User user);

	List<NotePermission> getUserRejectedPermissions(User user);
	
	List<NotePermission> getAllByUser(User user);
	
	NotePermission updateNotePermisson(String status, Long id);
	

}
