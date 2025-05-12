package com.yma.app.service;

import com.yma.app.model.User;
import com.yma.app.model.UserSettings;

public interface UserSettingsService {

    void updateUserSettings(User user, UserSettings userSettings);

    UserSettings getUserSettingById(Long id);

}
