'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Filter,
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  User,
  GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Student {
  id: string;
  name: string;
  email: string;
  group: string;
  totalAssignments: number;
  completedAssignments: number;
  averageGrade: number;
  lastActivity: string;
  status: 'active' | 'inactive';
}

const mockStudents: Student[] = [
  {
    id: '3',
    name: 'John Smith',
    email: 'john.smith@student.edu',
    group: 'CS-301',
    totalAssignments: 8,
    completedAssignments: 6,
    averageGrade: 85,
    lastActivity: '2024-12-21',
    status: 'active'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.wilson@student.edu',
    group: 'CS-301',
    totalAssignments: 8,
    completedAssignments: 7,
    averageGrade: 92,
    lastActivity: '2024-12-22',
    status: 'active'
  },
  {
    id: '5',
    name: 'Michael Chen',
    email: 'michael.chen@student.edu',
    group: 'CS-301',
    totalAssignments: 8,
    completedAssignments: 5,
    averageGrade: 78,
    lastActivity: '2024-12-20',
    status: 'active'
  },
  {
    id: '6',
    name: 'Sarah Davis',
    email: 'sarah.davis@student.edu',
    group: 'CS-302',
    totalAssignments: 8,
    completedAssignments: 8,
    averageGrade: 95,
    lastActivity: '2024-12-22',
    status: 'active'
  },
  {
    id: '7',
    name: 'David Miller',
    email: 'david.miller@student.edu',
    group: 'CS-302',
    totalAssignments: 8,
    completedAssignments: 4,
    averageGrade: 72,
    lastActivity: '2024-12-18',
    status: 'inactive'
  },
  {
    id: '8',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@student.edu',
    group: 'CS-302',
    totalAssignments: 8,
    completedAssignments: 6,
    averageGrade: 88,
    lastActivity: '2024-12-21',
    status: 'active'
  }
];

export default function StudentsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const getCompletionPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge variant="secondary" className="bg-green-100 text-green-800">Активный</Badge>
      : <Badge variant="secondary" className="bg-gray-100 text-gray-800">Неактивный</Badge>;
  };

  const getProgressIcon = (completed: number, total: number) => {
    const percentage = getCompletionPercentage(completed, total);
    if (percentage === 100) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (percentage >= 50) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = groupFilter === 'all' || student.group === groupFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesGroup && matchesStatus;
  });

  const groups = Array.from(new Set(mockStudents.map(s => s.group)));

  // Calculate summary stats
  const totalStudents = filteredStudents.length;
  const activeStudents = filteredStudents.filter(s => s.status === 'active').length;
  const averageCompletion = filteredStudents.length > 0 
    ? Math.round(filteredStudents.reduce((acc, student) => 
        acc + getCompletionPercentage(student.completedAssignments, student.totalAssignments), 0
      ) / filteredStudents.length)
    : 0;
  const averageGrade = filteredStudents.length > 0
    ? Math.round(filteredStudents.reduce((acc, student) => acc + student.averageGrade, 0) / filteredStudents.length)
    : 0;

  return (
    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Студенты</h1>
            <p className="text-gray-600">
              {user?.role === 'admin' ? 'Manage all students in the system' : 'View and manage your students'}
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего студентов</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  {groups.length} группы
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Активные Студенты</CardTitle>
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{activeStudents}</div>
                <p className="text-xs text-muted-foreground">
                  {totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}% Процент активности
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Среднее выполнение</CardTitle>
                <BookOpen className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{averageCompletion}%</div>
                <p className="text-xs text-muted-foreground">Выполнение задания</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Средняя оценка</CardTitle>
                <GraduationCap className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getGradeColor(averageGrade)}`}>{averageGrade}</div>
                <p className="text-xs text-muted-foreground">Общая успеваемость</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={groupFilter} onValueChange={setGroupFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все группы</SelectItem>
                    {groups.map(group => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все Студенты</SelectItem>
                    <SelectItem value="active">Активный</SelectItem>
                    <SelectItem value="inactive">Неактивный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{student.email}</span>
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(student.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Group */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Группа</span>
                    <Badge variant="outline">{student.group}</Badge>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Прогресс</span>
                      <div className="flex items-center space-x-1">
                        {getProgressIcon(student.completedAssignments, student.totalAssignments)}
                        <span className="text-sm font-medium">
                          {student.completedAssignments}/{student.totalAssignments}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${getCompletionPercentage(student.completedAssignments, student.totalAssignments)}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Average Grade */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Средняя оценка</span>
                    <span className={`text-lg font-bold ${getGradeColor(student.averageGrade)}`}>
                      {student.averageGrade}
                    </span>
                  </div>

                  {/* Last Activity */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Последняя активность</span>
                    <span className="text-gray-900">
                      {new Date(student.lastActivity).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Action Button */}
                  <Link href={`/students/${student.id}`} className="block">
                    <Button variant="outline" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Просмотреть профиль
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredStudents.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Студенты не найдены</h3>
                <p className="text-gray-600">
                  {searchTerm || groupFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No students have been enrolled yet.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}