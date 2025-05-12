package com.yma.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yma.app.model.Note;
import com.yma.app.model.NotePermission;
import com.yma.app.model.Status;
import com.yma.app.model.User;

public interface NotePermissionRepository extends JpaRepository<NotePermission, Long> {

	List<NotePermission> findAllByUser(User user);

	List<NotePermission> findAllByUserAndStatus(User user, Status status);

	List<NotePermission> findAllByNoteAndStatus(Note note, Status status);

	List<NotePermission> findAllByStatus(Status status);

}
