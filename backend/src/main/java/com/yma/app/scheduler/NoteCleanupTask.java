package com.yma.app.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.yma.app.service.NoteService;
import com.yma.app.dto.NoteDeletedEvent;

@Component
public class NoteCleanupTask {

    private final NoteService noteService;
    private final SimpMessagingTemplate messagingTemplate;

    public NoteCleanupTask(NoteService noteService, SimpMessagingTemplate messagingTemplate) {
        this.noteService = noteService;
        this.messagingTemplate = messagingTemplate;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void deleteOldNotes() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(7);

        List<Long> noteIdsToDelete = noteService.getIdsOfNotesToBeDeleted(cutoffDate);
        noteService.deleteByIsDeletedTrueAndDeletedAtBefore(cutoffDate);
        for (Long noteId : noteIdsToDelete) {
            messagingTemplate.convertAndSend("/topic/binUpdates", new NoteDeletedEvent(noteId));
        }
    }
}
