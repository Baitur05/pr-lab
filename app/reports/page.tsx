"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import {
  BarChart3,
  Users,
  BookOpen,
  TrendingUp,
  Download,
  Filter,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Group {
  id: string;
  name: string;
  description: string;
  teacherName: string;
  studentCount: number;
  averageGrade: number;
  completionRate: number;
  activeAssignments: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  group: string;
  totalAssignments: number;
  completedAssignments: number;
  averageGrade: number;
  lastSubmission: string;
}

interface Assignment {
  id: number;
  title: string;
  deadline: string;
  submissionCount: number;
  totalStudents: number;
  averageGrade: number;
  completionRate: number;
}

const mockGroups: Group[] = [
  {
    id: "1",
    name: "CS-301",
    description: "Базы данных — осенний семестр 2024 года",
    teacherName: "Robert Lewandowski",
    studentCount: 25,
    averageGrade: 85,
    completionRate: 88,
    activeAssignments: 8,
  },
  {
    id: "2",
    name: "CS-302",
    description: "Углублённые концепции баз данных — осенний семестр 2024 года",
    teacherName: "Lionel Andrés Messi",
    studentCount: 20,
    averageGrade: 82,
    completionRate: 85,
    activeAssignments: 6,
  },
];

const mockStudents: Student[] = [
  {
    id: "3",
    name: "Kylian Mbappé",
    email: "kylian.mbappe@student.edu",
    group: "CS-301",
    totalAssignments: 8,
    completedAssignments: 6,
    averageGrade: 85,
    lastSubmission: "2024-12-21",
  },
  {
    id: "4",
    name: "Erling Haaland",
    email: "erling.haaland@student.edu",
    group: "CS-301",
    totalAssignments: 8,
    completedAssignments: 7,
    averageGrade: 92,
    lastSubmission: "2024-12-22",
  },
  {
    id: "5",
    name: "Kevin De Bruyne",
    email: "kevin.debruyne@student.edu",
    group: "CS-301",
    totalAssignments: 8,
    completedAssignments: 5,
    averageGrade: 78,
    lastSubmission: "2024-12-20",
  },
];

const mockAssignments: Assignment[] = [
  {
    id: 1,
    title: "Создание таблиц в PostgreSQL",
    deadline: "2024-12-25",
    submissionCount: 20,
    totalStudents: 25,
    averageGrade: 85,
    completionRate: 80,
  },
  {
    id: 2,
    title: "SELECT-запросы и JOIN",
    deadline: "2024-12-28",
    submissionCount: 15,
    totalStudents: 25,
    averageGrade: 88,
    completionRate: 60,
  },
  {
    id: 3,
    title: "Индексация и оптимизация баз данных",
    deadline: "2025-01-05",
    submissionCount: 8,
    totalStudents: 25,
    averageGrade: 82,
    completionRate: 32,
  },
];

export default function ReportsPage() {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 75) return "text-blue-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredStudents =
    selectedGroup === "all"
      ? mockStudents
      : mockStudents.filter((s) => s.group === selectedGroup);

  const calculateOverallStats = () => {
    const groups =
      selectedGroup === "all"
        ? mockGroups
        : mockGroups.filter((g) => g.name === selectedGroup);
    const students = filteredStudents;

    return {
      totalStudents: students.length,
      totalGroups: groups.length,
      averageGrade:
        students.length > 0
          ? Math.round(
              students.reduce((acc, s) => acc + s.averageGrade, 0) /
                students.length
            )
          : 0,
      averageCompletion:
        students.length > 0
          ? Math.round(
              students.reduce(
                (acc, s) =>
                  acc + (s.completedAssignments / s.totalAssignments) * 100,
                0
              ) / students.length
            )
          : 0,
    };
  };

  const stats = calculateOverallStats();

  return (
    <ProtectedRoute allowedRoles={["teacher", "admin"]}>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Статистика и отчёты
              </h1>
              <p className="text-gray-600">
                {user?.role === "admin"
                  ? "System-wide performance analytics and reports"
                  : "Student performance analytics and grade reports"}
              </p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Экспорт отчёта
            </Button>
          </div>
          {/* Filter */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все группы</SelectItem>
                    {mockGroups.map((group) => (
                      <SelectItem key={group.id} value={group.name}>
                        {group.name} - {group.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Общее количество студентов
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalStudents}
                </div>
                <p className="text-xs text-muted-foreground">
                  Во всех {stats.totalGroups} группах
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Средняя успеваемость
                </CardTitle>
                <Award className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${getGradeColor(
                    stats.averageGrade
                  )}`}
                >
                  {stats.averageGrade}
                </div>
                <p className="text-xs text-muted-foreground">
                  Общая успеваемость
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Уровень завершения
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${getCompletionColor(
                    stats.averageCompletion
                  )}`}
                >
                  {stats.averageCompletion}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Выполнение заданий
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Текущие задания
                </CardTitle>
                <BookOpen className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {mockAssignments.length}
                </div>
                <p className="text-xs text-muted-foreground">Активно сейчас</p>
              </CardContent>
            </Card>
          </div>
          {/* Tabs */}
          <Tabs defaultValue="groups" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="groups">Информация о группах</TabsTrigger>
              <TabsTrigger value="students">Успеваемость студентов</TabsTrigger>
              <TabsTrigger value="assignments">Статистика заданий</TabsTrigger>
            </TabsList>

            <TabsContent value="groups" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Общая успеваемость группы</CardTitle>
                  <CardDescription>
                    Показатели успеваемости для каждой группы
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(selectedGroup === "all"
                      ? mockGroups
                      : mockGroups.filter((g) => g.name === selectedGroup)
                    ).map((group) => (
                      <div key={group.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {group.name}
                            </h3>
                            <p className="text-gray-600">{group.description}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Преподаватель {group.teacherName}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {group.studentCount} Студенты
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-blue-800">
                                Средний балл
                              </span>
                              <Award className="h-4 w-4 text-blue-600" />
                            </div>
                            <div
                              className={`text-2xl font-bold ${getGradeColor(
                                group.averageGrade
                              )} mt-1`}
                            >
                              {group.averageGrade}
                            </div>
                          </div>

                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-green-800">
                                Уровень выполнения
                              </span>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div
                              className={`text-2xl font-bold ${getCompletionColor(
                                group.completionRate
                              )} mt-1`}
                            >
                              {group.completionRate}%
                            </div>
                          </div>

                          <div className="bg-orange-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-orange-800">
                                Текущие задания
                              </span>
                              <BookOpen className="h-4 w-4 text-orange-600" />
                            </div>
                            <div className="text-2xl font-bold text-orange-600 mt-1">
                              {group.activeAssignments}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Students List */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Успеваемость студентов</CardTitle>
                      <CardDescription>
                        Кликните по студенту, чтобы увидеть детали успеваемости
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {filteredStudents.map((student) => (
                          <div
                            key={student.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedStudent?.id === student.id
                                ? "border-blue-500 bg-blue-50"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => setSelectedStudent(student)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {student.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {student.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {student.group}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`text-lg font-bold ${getGradeColor(
                                    student.averageGrade
                                  )}`}
                                >
                                  {student.averageGrade}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {student.completedAssignments}/
                                  {student.totalAssignments} Завершено
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Student Details */}
                <div>
                  {selectedStudent ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Сведения о студенте</CardTitle>
                        <CardDescription>
                          Подробный отчет о производительности для{" "}
                          {selectedStudent.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <Avatar className="h-16 w-16 mx-auto mb-3">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                              {selectedStudent.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold text-gray-900">
                            {selectedStudent.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {selectedStudent.email}
                          </p>
                          <Badge variant="outline" className="mt-2">
                            {selectedStudent.group}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Средний балл
                            </span>
                            <span
                              className={`font-bold ${getGradeColor(
                                selectedStudent.averageGrade
                              )}`}
                            >
                              {selectedStudent.averageGrade}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Уровень завершения
                            </span>
                            <span className="font-bold">
                              {Math.round(
                                (selectedStudent.completedAssignments /
                                  selectedStudent.totalAssignments) *
                                  100
                              )}
                              %
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Задания
                            </span>
                            <span className="font-bold">
                              {selectedStudent.completedAssignments}/
                              {selectedStudent.totalAssignments}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Последняя сдача
                            </span>
                            <span className="font-bold">
                              {new Date(
                                selectedStudent.lastSubmission
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <Link href={`/students/${selectedStudent.id}`}>
                          <Button className="w-full">
                            Просмотреть полный профиль
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Выберите студента
                        </h3>
                        <p className="text-gray-600">
                          Кликните по студенту, чтобы увидеть детали
                          успеваемости
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assignments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Успеваемость по заданию</CardTitle>
                  <CardDescription>Статистика по всем заданиям</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAssignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="border rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {assignment.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Срок сдачи:{" "}
                              {new Date(
                                assignment.deadline
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              Отправленные работы
                            </div>
                            <div className="text-lg font-bold">
                              {assignment.submissionCount}/
                              {assignment.totalStudents}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-blue-800">
                                Средний балл
                              </span>
                              <Award className="h-4 w-4 text-blue-600" />
                            </div>
                            <div
                              className={`text-2xl font-bold ${getGradeColor(
                                assignment.averageGrade
                              )} mt-1`}
                            >
                              {assignment.averageGrade}
                            </div>
                          </div>

                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-green-800">
                                Уровень завершения
                              </span>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div
                              className={`text-2xl font-bold ${getCompletionColor(
                                assignment.completionRate
                              )} mt-1`}
                            >
                              {assignment.completionRate}%
                            </div>
                          </div>

                          <div className="bg-orange-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-orange-800">
                                Отправленные работы
                              </span>
                              <TrendingUp className="h-4 w-4 text-orange-600" />
                            </div>
                            <div className="text-2xl font-bold text-orange-600 mt-1">
                              {assignment.submissionCount}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          ]
        </div>
      </div>
    </ProtectedRoute>
  );
}
