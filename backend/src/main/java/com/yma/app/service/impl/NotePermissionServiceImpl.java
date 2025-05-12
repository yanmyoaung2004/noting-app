package com.yma.app.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yma.app.custom_exception.NotFoundException;
import com.yma.app.model.NotePermission;
import com.yma.app.model.Status;
import com.yma.app.model.User;
import com.yma.app.repository.NotePermissionRepository;
import com.yma.app.service.NotePermissionService;

@Service
public class NotePermissionServiceImpl implements NotePermissionService {

	private final NotePermissionRepository notePermissionRepository;

	public NotePermissionServiceImpl(NotePermissionRepository notePermissionRepository) {
		super();
		this.notePermissionRepository = notePermissionRepository;
	}

	@Override
	public void deletePermissionById(Long id) {

		Optional<NotePermission> notePermissionOpt = notePermissionRepository.findById(id);
		if (notePermissionOpt.isEmpty()) {
			throw new NotFoundException("Note Permission Not Found!");
		}
		notePermissionRepository.deleteById(id);

	}

	@Override
	public NotePermission getPermissionById(Long id) {
		return notePermissionRepository.findById(id).orElseThrow(() -> new NotFoundException("Permission not found"));
	}

	@Override
	public List<NotePermission> getUserPendingPermissions(User user) {
	    return notePermissionRepository.findAllByUserAndStatus(user, Status.PENDING);
	}

	@Override
	public List<NotePermission> getUserAcceptedPermissions(User user) {
	    return notePermissionRepository.findAllByUserAndStatus(user, Status.ACCEPTED);
	}

	@Override
	public List<NotePermission> getUserRejectedPermissions(User user) {
	    return notePermissionRepository.findAllByUserAndStatus(user, Status.REJECTED);
		
	}

	@Override
	public List<NotePermission> getAllByUser(User user) {
		return notePermissionRepository.findAllByUser(user);
	}

	@Override
	public NotePermission updateNotePermisson(String status, Long id) {
		Optional<NotePermission> notePermissionOptional = notePermissionRepository.findById(id);
		if(notePermissionOptional.isEmpty()) {
			throw new NotFoundException("Not Permission Not Found!");
		}
		NotePermission notePermission = notePermissionOptional.get();
		notePermission.setStatus(Status.valueOf(status));
		return notePermissionRepository.save(notePermission);
	}


}
