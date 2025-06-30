'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  User, 
  Mail,
  Calendar,
  Shield,
  GraduationCap,
  Edit,
  Save,
  ArrowLeft,
  Key,
  Bell,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    assignmentReminders: true,
    gradeNotifications: true,
    systemUpdates: false
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-5 w-5" />;
      case 'teacher': return <GraduationCap className="h-5 w-5" />;
      case 'student': return <User className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Администратор</Badge>;
      case 'teacher':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Преподаватель</Badge>;
      case 'student':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Студент</Badge>;
      default:
        return <Badge variant="secondary">Неизвестный</Badge>;
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    // Validation
    if (!profileData.name.trim()) {
      setError('Name is required');
      setIsSaving(false);
      return;
    }

    if (!profileData.email.trim()) {
      setError('Email is required');
      setIsSaving(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Updating profile:', {
        name: profileData.name,
        email: profileData.email
      });

      setSuccess('Profile updated successfully');
      setIsEditing(false);
      
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    // Validation
    if (!profileData.currentPassword || !profileData.newPassword || !profileData.confirmPassword) {
      setError('All password fields are required');
      setIsSaving(false);
      return;
    }

    if (profileData.newPassword !== profileData.confirmPassword) {
      setError('New passwords do not match');
      setIsSaving(false);
      return;
    }

    if (profileData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      setIsSaving(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Changing password');

      setSuccess('Password changed successfully');
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationUpdate = async (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    
    // Simulate API call
    console.log('Updating notification setting:', key, value);
  };

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardContent className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Пользователь не найден</h2>
                <p className="text-gray-600">Не удалось загрузить профиль пользователя.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Вернуться на панель управления
              </Button>
            </Link>
            
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <div className="space-y-1 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(user.role)}
                    <span className="capitalize">{user.role}</span>
                  </div>
                  {user.group && (
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>Группа {user.group}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                {getRoleBadge(user.role)}
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Информация о профиле</TabsTrigger>
              <TabsTrigger value="security">Безопасность</TabsTrigger>
              <TabsTrigger value="notifications">Уведомления</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Информация о профиле</CardTitle>
                      <CardDescription>
                        Обновите личную информацию и данные учетной записи
                      </CardDescription>
                    </div>
                    {!isEditing && (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Редактировать профиль
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Полное имя</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          disabled={!isEditing}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Электронная почта</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Роль</Label>
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <span className="capitalize font-medium">{user.role}</span>
                          {getRoleBadge(user.role)}
                        </div>
                      </div>

                      {user.group && (
                        <div className="space-y-2">
                          <Label>Группа</Label>
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="h-4 w-4" />
                            <span className="font-medium">{user.group}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-4 pt-6 border-t">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsEditing(false);
                            setProfileData({
                              name: user.name,
                              email: user.email,
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: ''
                            });
                          }}
                          disabled={isSaving}
                        >
                          Отмена
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Сохранение...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Сохранить изменения
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="h-5 w-5" />
                    <span>Изменить пароль</span>
                  </CardTitle>
                  <CardDescription>
                    Обновите пароль, чтобы обезопасить свою учетную запись
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Текущий пароль</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={profileData.currentPassword}
                        onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter your current password"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Новый пароль</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={profileData.newPassword}
                        onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter your new password"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm your new password"
                        required
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Обновляется..
                          </>
                        ) : (
                          <>
                            <Key className="h-4 w-4 mr-2" />
                            Изменить пароль
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Сведения об учетной записи</CardTitle>
                  <CardDescription>
                    Данные вашей учетной записи и параметры безопасности
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Учетная запись создана</span>
                        <p className="text-sm text-gray-600">Ваша учетная запись была создана 1 сентября 2024 года</p>
                      </div>
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Последний вход в систему</span>
                        <p className="text-sm text-gray-600">Сегодня в 14:30</p>
                      </div>
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Параметры уведомлений</span>
                  </CardTitle>
                  <CardDescription>
                    Управление уведомлениями и обновлениями
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Email-уведомления</h4>
                        <p className="text-sm text-gray-600">Получать уведомления на email</p>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationUpdate('emailNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Уведомления о заданиях</h4>
                        <p className="text-sm text-gray-600">Получайте уведомления о дедлайнах по заданиям</p>
                      </div>
                      <Switch
                        checked={notifications.assignmentReminders}
                        onCheckedChange={(checked) => handleNotificationUpdate('assignmentReminders', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Уведомления об оценках</h4>
                        <p className="text-sm text-gray-600">Получайте оповещения о новых оценках</p>
                      </div>
                      <Switch
                        checked={notifications.gradeNotifications}
                        onCheckedChange={(checked) => handleNotificationUpdate('gradeNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Системные обновления</h4>
                        <p className="text-sm text-gray-600">Уведомления о работах по обслуживанию и обновлениях системы</p>
                      </div>
                      <Switch
                        checked={notifications.systemUpdates}
                        onCheckedChange={(checked) => handleNotificationUpdate('systemUpdates', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}