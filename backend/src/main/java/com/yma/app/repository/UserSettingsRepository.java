package com.yma.app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yma.app.model.User;
import com.yma.app.model.UserSettings;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {

    Optional<UserSettings> findByUser(User user);
    
}
