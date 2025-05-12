package com.yma.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "user_settings")
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @OneToOne
    @MapsId
    @JoinColumn(name = "id") 
    @JsonIgnore
    private User user;

    @Column(name = "email_notifications_enabled", nullable = false)
    private boolean emailNotificationsEnabled = true;

    @Column(name = "share_notifications_enabled", nullable = false)
    private boolean shareNotificationsEnabled = true;
    
    @Column(name = "reminder_notifications_enabled", nullable = false)
    private boolean reminderNotificationsEnabled = true;

    @Column(name = "dark_mode_enabled", nullable = false)
    private boolean darkModeEnabled = false;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public UserSettings() {}

    

    public UserSettings(Long id, User user, boolean emailNotificationsEnabled, boolean shareNotificationsEnabled,
            boolean reminderNotificationsEnabled, boolean darkModeEnabled) {
        this.id = id;
        this.user = user;
        this.emailNotificationsEnabled = emailNotificationsEnabled;
        this.shareNotificationsEnabled = shareNotificationsEnabled;
        this.reminderNotificationsEnabled = reminderNotificationsEnabled;
        this.darkModeEnabled = darkModeEnabled;
    }



    public UserSettings(User user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isEmailNotificationsEnabled() {
        return emailNotificationsEnabled;
    }

    public void setEmailNotificationsEnabled(boolean emailNotificationsEnabled) {
        this.emailNotificationsEnabled = emailNotificationsEnabled;
    }

    public boolean isShareNotificationsEnabled() {
        return shareNotificationsEnabled;
    }

    public void setShareNotificationsEnabled(boolean shareNotificationsEnabled) {
        this.shareNotificationsEnabled = shareNotificationsEnabled;
    }
    
    public boolean isReminderNotificationsEnabled() {
        return reminderNotificationsEnabled;
    }

    public void setReminderNotificationsEnabled(boolean reminderNotificationsEnabled) {
        this.reminderNotificationsEnabled = reminderNotificationsEnabled;
    }

    public boolean isDarkModeEnabled() {
        return darkModeEnabled;
    }

    public void setDarkModeEnabled(boolean darkModeEnabled) {
        this.darkModeEnabled = darkModeEnabled;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
