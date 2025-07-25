"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import {
  BookOpen,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  BarChart3,
  FileText,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock data - in real app, this would come from API
  const mockStats = {
    admin: {
      totalUsers: 247,
      totalAssignments: 18,
      totalGroups: 8,
      activeSubmissions: 142,
    },
    teacher: {
      totalAssignments: 12,
      totalStudents: 45,
      pendingGrades: 23,
      completedSubmissions: 89,
    },
    student: {
      totalAssignments: 8,
      completedAssignments: 5,
      pendingAssignments: 2,
      upcomingDeadlines: 3,
    },
  };

  const mockRecentActivity = {
    admin: [
      {
        id: 1,
        action: "Новый пользователь зарегистрирован",
        user: "User1",
        time: "2 часа назад",
        type: "user",
      },
      {
        id: 2,
        action: "Задание создано",
        user: "User2",
        time: "4 часа назад",
        type: "assignment",
      },
      {
        id: 3,
        action: "Группа обновлена",
        user: "Admin",
        time: "1 день назад",
        type: "group",
      },
    ],
    teacher: [
      {
        id: 1,
        action: "Задание отправлено",
        user: "User2",
        time: "1 час назад",
        type: "submission",
      },
      {
        id: 2,
        action: "Поставленная оценка",
        user: "Teacher1",
        time: "3 часа назад",
        type: "grade",
      },
      {
        id: 3,
        action: "Новое задание создано",
        user: "Teacher1",
        time: "1 день назад",
        type: "assignment",
      },
    ],
    student: [
      {
        id: 1,
        action: "Получена оценка",
        assignment: "User2",
        time: "2 часа назад",
        type: "grade",
      },
      {
        id: 2,
        action: "Задание отправлено",
        assignment: "User3",
        time: "1 день назад",
        type: "submission",
      },
      {
        id: 3,
        action: "Новая задание",
        assignment: "User1",
        time: "2 дня назад",
        type: "assignment",
      },
    ],
  };

  const upcomingDeadlines = [
    {
      id: 1,
      title: "Оптимизация базы данных",
      deadline: "Дек 25, 2024",
      status: "В ожидании",
    },
    {
      id: 2,
      title: "Разработка API",
      deadline: "Дек 28, 2024",
      status: "в процессе",
    },
    {
      id: 3,
      title: "Финальный проект",
      deadline: "Янв 15, 2025",
      status: "Не начато",
    },
  ];

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const timeGreeting =
      hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";
    return `${timeGreeting}, ${user?.name}!`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="h-4 w-4" />;
      case "assignment":
        return <BookOpen className="h-4 w-4" />;
      case "submission":
        return <FileText className="h-4 w-4" />;
      case "grade":
        return <CheckCircle className="h-4 w-4" />;
      case "group":
        return <Users className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            В ожидании
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            В процессе
          </Badge>
        );
      case "not-started":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Не начато
          </Badge>
        );
      default:
        return <Badge variant="secondary">Неизвестно</Badge>;
    }
  };

  const renderStatsCards = () => {
    if (user?.role === "admin") {
      const stats = mockStats.admin;
      return (
        <>
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Всего пользователей
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                +12 за прошлый месяц
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Всего заданий
              </CardTitle>
              <BookOpen className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {stats.totalAssignments}
              </div>
              <p className="text-xs text-muted-foreground">+3 за эту неделю</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Активные группы
              </CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.totalGroups}
              </div>
              <p className="text-xs text-muted-foreground">
                Все группы активны
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Активные сдачи
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.activeSubmissions}
              </div>
              <p className="text-xs text-muted-foreground">+18 за сегодня</p>
            </CardContent>
          </Card>
        </>
      );
    } else if (user?.role === "teacher") {
      const stats = mockStats.teacher;
      return (
        <>
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Мои задания</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalAssignments}
              </div>
              <p className="text-xs text-muted-foreground">Активные задания</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Мои студенты
              </CardTitle>
              <Users className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {stats.totalStudents}
              </div>
              <p className="text-xs text-muted-foreground">В 3 группах</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Оценки в ожидании
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.pendingGrades}
              </div>
              <p className="text-xs text-muted-foreground">Нужно проверить</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Выполнено</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.completedSubmissions}
              </div>
              <p className="text-xs text-muted-foreground">Проверенные сдачи</p>
            </CardContent>
          </Card>
        </>
      );
    } else {
      const stats = mockStats.student;
      return (
        <>
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Всего заданий
              </CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalAssignments}
              </div>
              <p className="text-xs text-muted-foreground">Этот семестр</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Завершено</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {stats.completedAssignments}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(
                  (stats.completedAssignments / stats.totalAssignments) * 100
                )}
                % progress
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">В ожидании</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.pendingAssignments}
              </div>
              <p className="text-xs text-muted-foreground">
                Нужно сдать работу
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Предстоящие дедлайны
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.upcomingDeadlines}
              </div>
              <p className="text-xs text-muted-foreground">Ближайшие 7 дней</p>
            </CardContent>
          </Card>
        </>
      );
    }
  };

  const renderQuickActions = () => {
    if (user?.role === "admin") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-blue-600 hover:bg-blue-700">
              <Users className="h-6 w-6" />
              <span>Управление пользователями</span>
            </Button>
          </Link>
          <Link href="/assignments">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-emerald-600 hover:bg-emerald-700">
              <BookOpen className="h-6 w-6" />
              <span>Просмотреть задания</span>
            </Button>
          </Link>
          <Link href="/reports">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-orange-600 hover:bg-orange-700">
              <BarChart3 className="h-6 w-6" />
              <span>Отчёты системы</span>
            </Button>
          </Link>
        </div>
      );
    } else if (user?.role === "teacher") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/assignments/create">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-6 w-6" />
              <span>Создать задание</span>
            </Button>
          </Link>
          <Link href="/assignments">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-emerald-600 hover:bg-emerald-700">
              <BookOpen className="h-6 w-6" />
              <span>Просмотреть задания</span>
            </Button>
          </Link>
          <Link href="/students">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-orange-600 hover:bg-orange-700">
              <Users className="h-6 w-6" />
              <span>Мои студенты</span>
            </Button>
          </Link>
          <Link href="/reports">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-purple-600 hover:bg-purple-700">
              <BarChart3 className="h-6 w-6" />
              <span>Отчёты об успеваемости</span>
            </Button>
          </Link>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/assignments">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-blue-600 hover:bg-blue-700">
              <BookOpen className="h-6 w-6" />
              <span>Мои задания</span>
            </Button>
          </Link>
          <Link href="/assignments">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle className="h-6 w-6" />
              <span>Мои оценки</span>
            </Button>
          </Link>
          <Link href="/assignments">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-orange-600 hover:bg-orange-700">
              <Calendar className="h-6 w-6" />
              <span>Дедлайны</span>
            </Button>
          </Link>
        </div>
      );
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getWelcomeMessage()}
            </h1>
            <p className="text-gray-600">
              {user?.role === "admin" &&
                "Управлять системой лабораторного практикума и контролировать все виды деятельности."}
              {user?.role === "teacher" &&
                "Создавать задания, оценивать работы и отслеживать прогресс студентов."}
              {user?.role === "student" &&
                "Выполняйте лабораторные задания по базам данных и отслеживайте свой прогресс."}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {renderStatsCards()}
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Быстрые операции</CardTitle>
              <CardDescription>
                Часто используемые функции для вашей роли
              </CardDescription>
            </CardHeader>
            <CardContent>{renderQuickActions()}</CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Последняя активность</CardTitle>
                <CardDescription>
                  Последние обновления в системе
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(
                    mockRecentActivity[
                      user?.role as keyof typeof mockRecentActivity
                    ] || []
                  ).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-500">
                          {"user" in activity
                            ? activity.user
                            : "assignment" in activity
                            ? activity.assignment
                            : ""}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines (for students) or Quick Stats (for others) */}
            {user?.role === "student" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Ближайшие дедлайны</CardTitle>
                  <CardDescription>
                    Не пропустите эти важные даты
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingDeadlines.map((deadline) => (
                      <div
                        key={deadline.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {deadline.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {deadline.deadline}
                          </p>
                        </div>
                        {getStatusBadge(deadline.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Обзор системы</CardTitle>
                  <CardDescription>
                    Ключевые метрики в одном обзоре
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Активные задания</span>
                      </div>
                      <span className="text-blue-600 font-bold">
                        {user?.role === "admin" ? "18" : "12"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-emerald-600" />
                        <span className="font-medium">Активные студенты</span>
                      </div>
                      <span className="text-emerald-600 font-bold">
                        {user?.role === "admin" ? "247" : "45"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                        <span className="font-medium">Процент выполнения</span>
                      </div>
                      <span className="text-orange-600 font-bold">87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
