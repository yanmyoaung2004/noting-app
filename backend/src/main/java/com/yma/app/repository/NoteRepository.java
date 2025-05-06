package com.yma.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.yma.app.model.Note;
import com.yma.app.model.User;

public interface NoteRepository extends JpaRepository<Note, Long> {

	List<Note> getAllNotesByUser(User user);

	Note findNoteByShareToken(String shareToken);

    @Query("SELECT np.note FROM NotePermission np WHERE np.user.email = :email")
	List<Note> findNotesSharedWithUser(@Param("email") String email);

}
