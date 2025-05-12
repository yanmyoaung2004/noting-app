package com.yma.app.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yma.app.custom_exception.NotFoundException;
import com.yma.app.model.User;
import com.yma.app.model.UserSettings;
import com.yma.app.repository.UserSettingsRepository;
import com.yma.app.service.UserSettingsService;

@Service
public class UserSettingsServiceImpl implements UserSettingsService {

    private final UserSettingsRepository userSettingsRepository;
    
    public UserSettingsServiceImpl(UserSettingsRepository userSettingsRepository) {
        this.userSettingsRepository = userSettingsRepository;
    }
    @Override
    public void updateUserSettings(User user, UserSettings userSettings) {
        
        Optional<UserSettings> userSettingsOptional = userSettingsRepository.findByUser(user);
        if(userSettingsOptional.isEmpty()){
            throw new NotFoundException("User Settings Not Found!");
        }
        userSettingsRepository.save(userSettings);
    }
    @Override
    public UserSettings getUserSettingById(Long id) {
        Optional<UserSettings> userSettingsOptional = userSettingsRepository.findById(id);
        if(userSettingsOptional.isEmpty()){
            throw new NotFoundException("User Settings Not Found!");
        }
        return userSettingsOptional.get();
    }

    

}
