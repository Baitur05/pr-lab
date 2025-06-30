'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useParams } from 'next/navigation';
import { 
  User, 
  Mail,
  Calendar,
  BookOpen,
  TrendingUp,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Award,
  GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

interface Student {
  id: string;
  name: string;
  email: string;
  group: string;
  enrollmentDate: string;
  lastActivity: string;
  status: 'active' | 'inactive';
  totalAssignments: number;
  completedAssignments: number;
  averageGrade: number;
}

interface Assignment {
  id: number;
  title: string;
  deadline: string;
  status: 'not-started' | 'submitted' | 'graded' | 'overdue';
  grade?: number;
  maxGrade: number;
  submittedAt?: string;
}

const mockStudent: Student = {
  id: '3',
  name: 'John Smith',
  email: 'john.smith@student.edu',
  group: 'CS-301',
  enrollmentDate: '2024-09-01',
  lastActivity: '2024-12-21',
  status: 'active',
  totalAssignments: 8,
  completedAssignments: 6,
  averageGrade: 85
};

const mockAssignments: Assignment[] = [
  {
    id: 1,
    title: 'Creating Tables in PostgreSQL',
    deadline: '2024-12-25',
    status: 'graded',
    grade: 85,
    maxGrade: 100,
    submittedAt: '2024-12-20'
  },
  {
    id: 2,
    title: 'SELECT Queries and JOINs',
    deadline: '2024-12-28',
    status: 'submitted',
    maxGrade: 100,
    submittedAt: '2024-12-27'
  },
  {
    id: 3,
    title: 'Database Indexing and Optimization',
    deadline: '2025-01-05',
    status: 'not-started',
    maxGrade: 100
  },
  {
    id: 4,
    title: 'REST API with Actix Web',
    deadline: '2025-01-15',
    status: 'not-started',
    maxGrade: 100
  },
  {
    id: 5,
    title: 'Database Transactions',
    deadline: '2024-12-20',
    status: 'overdue',
    maxGrade: 100
  }
];

export default function StudentProfilePage() {
  const { user } = useAuth();
  const params = useParams();
  const studentId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    // Simulate loading student data
    setTimeout(() => {
      if (studentId === '3') {
        setStudent(mockStudent);
        setAssignments(mockAssignments);
      }
      setIsLoading(false);
    }, 500);
  }, [studentId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'not-started':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Ещё не начато</Badge>;
      case 'submitted':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Сдано</Badge>;
      case 'graded':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Проверено</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Срок истёк</Badge>;
      default:
        return <Badge variant="secondary">Неизвестно</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not-started':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      case 'submitted':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'graded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletionPercentage = () => {
    if (!student) return 0;
    return Math.round((student.completedAssignments / student.totalAssignments) * 100);
  };

  const getGradedAssignments = () => {
    return assignments.filter(a => a.status === 'graded' && a.grade !== undefined);
  };

  const calculateGradeDistribution = () => {
    const gradedAssignments = getGradedAssignments();
    if (gradedAssignments.length === 0) return { A: 0, B: 0, C: 0, D: 0, F: 0 };

    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    gradedAssignments.forEach(assignment => {
      const percentage = (assignment.grade! / assignment.maxGrade) * 100;
      if (percentage >= 90) distribution.A++;
      else if (percentage >= 80) distribution.B++;
      else if (percentage >= 70) distribution.C++;
      else if (percentage >= 60) distribution.D++;
      else distribution.F++;
    });

    return distribution;
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['teacher', 'admin']}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!student) {
    return (
      <ProtectedRoute allowedRoles={['teacher', 'admin']}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardContent className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Студент не найден</h2>
                <p className="text-gray-600 mb-4">Студент, которого вы ищете, не найден.</p>
                <Link href="/students">
                  <Button>Вернуться к списку студентов</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const gradeDistribution = calculateGradeDistribution();

  return (
    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/students">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Вернуться к списку студентов
              </Button>
            </Link>
            
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{student.name}</h1>
                <div className="space-y-1 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>Группа {student.group}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Зарегистрирован(ы): {new Date(student.enrollmentDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <Badge variant="secondary" className="bg-green-100 text-green-800 mb-2">
                  {student.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
                <p className="text-sm text-gray-600">
                  Последняя активность: {new Date(student.lastActivity).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Задания</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {student.completedAssignments}/{student.totalAssignments}
                </div>
                <p className="text-xs text-muted-foreground">
                  {getCompletionPercentage()}% Завершено
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Средний балл</CardTitle>
                <Award className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getGradeColor(student.averageGrade, 100)}`}>
                  {student.averageGrade}
                </div>
                <p className="text-xs text-muted-foreground">
                  Из 100 баллов
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Сдано</CardTitle>
                <CheckCircle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Отправленные работы
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Успеваемость</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${student.averageGrade >= 80 ? 'text-green-600' : student.averageGrade >= 70 ? 'text-yellow-600' :   'text-red-600'}`}>
                  {student.averageGrade >= 90 ? 'A' : student.averageGrade >= 80 ? 'B' : student.averageGrade >= 70 ? 'C' : student.averageGrade >= 60 ? 'D' : 'F'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Оценка буквами
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="assignments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assignments">Задания</TabsTrigger>
              <TabsTrigger value="grades">История оценок</TabsTrigger>
              <TabsTrigger value="analytics">Анализ данных</TabsTrigger>
            </TabsList>

            <TabsContent value="assignments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Прогресс выполнения задания</CardTitle>
                  <CardDescription>
                    Отслеживать прогресс студента по всем заданиям
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(assignment.status)}
                          <div>
                            <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                            <p className="text-sm text-gray-600">
                              Срок сдачи: {new Date(assignment.deadline).toLocaleDateString()}
                              {assignment.submittedAt && (
                                <span className="ml-2">
                                  • Сдано: {new Date(assignment.submittedAt).toLocaleDateString()}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {assignment.grade !== undefined && (
                            <div className="text-right">
                              <div className={`text-lg font-bold ${getGradeColor(assignment.grade, assignment.maxGrade)}`}>
                                {assignment.grade}/{assignment.maxGrade}
                              </div>
                            </div>
                          )}
                          {getStatusBadge(assignment.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grades" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>История оценок</CardTitle>
                  <CardDescription>
                    Детальный обзор всех проверенных заданий
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getGradedAssignments().map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                          <p className="text-sm text-gray-600">
                            Сдано: {assignment.submittedAt && new Date(assignment.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getGradeColor(assignment.grade!, assignment.maxGrade)}`}>
                            {assignment.grade}/{assignment.maxGrade}
                          </div>
                          <div className="text-sm text-gray-600">
                            {Math.round((assignment.grade! / assignment.maxGrade) * 100)}%
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {getGradedAssignments().length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Пока нет оценённых заданий
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Статистика оценок</CardTitle>
                    <CardDescription>
                      Анализ оценок по буквенным оценкам
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(gradeDistribution).map(([grade, count]) => (
                        <div key={grade} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded ${
                              grade === 'A' ? 'bg-green-500' :
                              grade === 'B' ? 'bg-blue-500' :
                              grade === 'C' ? 'bg-yellow-500' :
                              grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
                            }`}></div>
                            <span className="font-medium">Оценка {grade}</span>
                          </div>
                          <span className="text-gray-600">{count} Задания</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Обзор прогресса</CardTitle>
                    <CardDescription>
                     Статус выполнения задания
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Уровень завершения</span>
                        <span className="font-medium">{getCompletionPercentage()}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${getCompletionPercentage()}%` }}
                        ></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {assignments.filter(a => a.status === 'graded').length}
                          </div>
                          <div className="text-sm text-gray-600">Проверено</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {assignments.filter(a => a.status === 'overdue').length}
                          </div>
                          <div className="text-sm text-gray-600">Срок истёк</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}