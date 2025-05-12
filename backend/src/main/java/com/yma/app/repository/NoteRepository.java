package com.yma.app.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.yma.app.model.Note;
import com.yma.app.model.User;

import jakarta.transaction.Transactional;

public interface NoteRepository extends JpaRepository<Note, Long> {

	List<Note> getAllNotesByUser(User user);

	Note findNoteByShareToken(String shareToken);

    @Query("SELECT np.note FROM NotePermission np WHERE np.user.email = :email AND np.status = 'ACCEPTED'")
	List<Note> findNotesSharedWithUser(@Param("email") String email);
    
    List<Note> findByUserAndIsDeletedFalse(User user);

    List<Note> findByUserAndIsDeletedTrue(User user);

    @Modifying
    @Transactional
    void deleteByIsDeletedTrueAndDeletedAtBefore(LocalDateTime cutoffDate);
    
    @Query("SELECT n.id FROM Note n WHERE n.isDeleted = true AND n.deletedAt < :cutoffDate")
    List<Long> findIdsByIsDeletedTrueAndDeletedAtBefore(LocalDateTime cutoffDate);

}
