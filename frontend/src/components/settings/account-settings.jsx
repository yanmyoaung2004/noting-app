"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Toaster } from "../../components/ui/toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import {
  AlertCircle,
  Camera,
  Check,
  Info,
  Key,
  Lock,
  Save,
  User,
  Bell,
  Moon,
  Sun,
  Globe,
} from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { handleSuccessToast, handleFailureToast } from "../../services/Toast";

export function AccountSettings() {
  const { updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    avatar: "",
    bio: "",
  });
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  // Notification preferences
  const [notificationPreferences, setNotificationPreferences] = useState({
    userSettingsId: null,
    emailNotifications: true,
    shareNotifications: true,
    reminderNotifications: false,
  });

  // Appearance preferences
  const [appearancePreferences, setAppearancePreferences] = useState({
    theme: "system",
    fontSize: "medium",
    compactMode: false,
    reducedMotion: false,
    language: "en",
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: "30",
  });
  const userData = JSON.parse(localStorage.getItem("currentUser"));

  const fetchUserData = async () => {
    try {
      if (!userData || !userData.token || !userData.email) {
        console.error("User not authenticated.");
        return;
      }
      const res = await axios.get(`/user/${userData.email}/email/detail`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      setProfileForm({
        email: res.data.email,
        name: res.data.username,
      });

      setNotificationPreferences({
        userSettingsId: res.data.userSettings.id,
        emailNotifications: res.data.userSettings.emailNotificationsEnabled,
        shareNotifications: res.data.userSettings.shareNotificationsEnabled,
        reminderNotifications:
          res.data.userSettings.reminderNotificationsEnabled,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess(false);
    setProfileError("");

    if (!profileForm.name.trim()) {
      setProfileError("Name is required");
      return;
    }

    if (!profileForm.email.includes("@") || !profileForm.email.includes(".")) {
      setProfileError("Please enter a valid email address");
      return;
    }

    try {
      setIsProfileSubmitting(true);

      // In a real app, this would call an API to update the user's profile
      if (updateProfile) {
        await updateProfile(profileForm);
      }

      setProfileSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setProfileSuccess(false);
      }, 3000);
    } catch (error) {
      setProfileError(error.message || "Failed to update profile");
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      handleFailureToast("Current password, is required!");

      return;
    }

    if (passwordForm.newPassword.length < 6) {
      handleFailureToast("New password must be at least 6 characters!");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      handleFailureToast("Passwords not not match!");
      return;
    }

    try {
      setIsPasswordSubmitting(true);
      const res = await axios.post(
        "auth/change-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          email: userData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (res.status === 200) {
        handleSuccessToast("Password has been changed!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      handleFailureToast(error.message || "Failed to update password");
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const changeNotiSetting = async () => {
    try {
      const res = await axios.post(
        "/user/update-settings",
        {
          email: userData.email,
          userSettingsId: notificationPreferences.userSettingsId,
          emailNotificationsEnabled: notificationPreferences.emailNotifications,
          shareNotificationsEnabled: notificationPreferences.shareNotifications,
          reminderNotificationsEnabled:
            notificationPreferences.reminderNotifications,
          darkModeEnabled: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (res.status === 200) {
        handleSuccessToast(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNotificationChange = (key, value) => {
    setNotificationPreferences({
      ...notificationPreferences,
      [key]: value,
    });
  };

  const savePreferences = () => {
    changeNotiSetting();
  };

  // Handle appearance preferences change
  const handleAppearanceChange = (key, value) => {
    setAppearancePreferences({
      ...appearancePreferences,
      [key]: value,
    });

    // In a real app, this would save the preferences to the server
  };

  // Handle security settings change
  const handleSecurityChange = (key, value) => {
    setSecuritySettings({
      ...securitySettings,
      [key]: value,
    });

    // In a real app, this would save the settings to the server
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <Toaster />

      <Tabs
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger
            value="profile"
            className="flex items-center justify-center"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center justify-center"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="flex items-center justify-center"
          >
            <Sun className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center justify-center"
          >
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information and public details
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileSubmit}>
              <CardContent className="space-y-6">
                {profileSuccess && (
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Your profile has been updated successfully.
                    </AlertDescription>
                  </Alert>
                )}

                {profileError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{profileError}</AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={
                          profileForm.avatar ||
                          "/placeholder.svg?height=96&width=96"
                        }
                        alt={profileForm.name}
                      />
                      <AvatarFallback className="text-2xl">
                        {profileForm.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Avatar
                    </Button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              name: e.target.value,
                            })
                          }
                          placeholder="Your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              email: e.target.value,
                            })
                          }
                          placeholder="Your email address"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={profileForm.bio}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              bio: e.target.value,
                            })
                          }
                          placeholder="A brief description about yourself"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isProfileSubmitting}>
                  {isProfileSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter your current password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter your new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isPasswordSubmitting}>
                  {isPasswordSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important updates
                    </p>
                  </div>
                  <Switch
                    checked={notificationPreferences.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("emailNotifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Share Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone shares a note with you
                    </p>
                  </div>
                  <Switch
                    checked={notificationPreferences.shareNotifications}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("shareNotifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Reminder Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when a reminder you set goes off
                    </p>
                  </div>

                  <Switch
                    checked={notificationPreferences.reminderNotifications}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("reminderNotifications", checked)
                    }
                  />
                </div>

                <Separator />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={savePreferences}>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how Notezy looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base">Theme</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={
                        appearancePreferences.theme === "light"
                          ? "default"
                          : "outline"
                      }
                      className="justify-start"
                      onClick={() => handleAppearanceChange("theme", "light")}
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Button>
                    <Button
                      variant={
                        appearancePreferences.theme === "dark"
                          ? "default"
                          : "outline"
                      }
                      className="justify-start"
                      onClick={() => handleAppearanceChange("theme", "dark")}
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Button>
                    <Button
                      variant={
                        appearancePreferences.theme === "system"
                          ? "default"
                          : "outline"
                      }
                      className="justify-start"
                      onClick={() => handleAppearanceChange("theme", "system")}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      System
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-base">Font Size</Label>
                  <Select
                    value={appearancePreferences.fontSize}
                    onValueChange={(value) =>
                      handleAppearanceChange("fontSize", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-base">Language</Label>
                  <Select
                    value={appearancePreferences.language}
                    onValueChange={(value) =>
                      handleAppearanceChange("language", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        handleSecurityChange("twoFactorAuth", checked)
                      }
                    />
                    {!securitySettings.twoFactorAuth && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={securitySettings.twoFactorAuth}
                      >
                        Setup
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone logs into your account
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.loginAlerts}
                    onCheckedChange={(checked) =>
                      handleSecurityChange("loginAlerts", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-base">Session Timeout</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Automatically log out after a period of inactivity
                  </p>
                  <Select
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) =>
                      handleSecurityChange("sessionTimeout", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeout period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-base">Active Sessions</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Manage devices where you're currently logged in
                  </p>
                  <div className="border rounded-md divide-y">
                    <div className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Current Browser</p>
                        <p className="text-sm text-muted-foreground">
                          Chrome on Windows • Active now
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" disabled>
                        Current
                      </Button>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Mobile App</p>
                        <p className="text-sm text-muted-foreground">
                          iPhone 13 • Last active 2 hours ago
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Log Out
                      </Button>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Safari</p>
                        <p className="text-sm text-muted-foreground">
                          Mac OS • Last active 3 days ago
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Log Out
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="destructive">
                    <Key className="h-4 w-4 mr-2" />
                    Log Out of All Devices
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-md bg-red-50">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all of your data
                  </p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>

              <div className="flex p-4 border rounded-md bg-amber-50 border-amber-200">
                <Info className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Deleting your account is permanent. All of your notes and data
                  will be permanently deleted and cannot be recovered.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
