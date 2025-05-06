package com.yma.app.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yma.app.custom_exception.NotFoundException;
import com.yma.app.model.NotePermission;
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

}
