'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  Upload,
  Edit,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Assignment {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'graded' | 'overdue';
  grade?: number;
  maxGrade: number;
  submittedAt?: string;
  hasFiles: boolean;
  submissionCount?: number;
  totalStudents?: number;
}

const mockAssignments: Assignment[] = [
  {
    id: 1,
    title: 'Creating Tables in PostgreSQL',
    description: 'Learn to create and manage database tables with proper constraints and relationships.',
    deadline: '2024-12-25',
    status: 'graded',
    grade: 85,
    maxGrade: 100,
    submittedAt: '2024-12-20',
    hasFiles: true,
    submissionCount: 20,
    totalStudents: 25
  },
  {
    id: 2,
    title: 'SELECT Queries and JOINs',
    description: 'Master complex SELECT statements and various types of JOIN operations.',
    deadline: '2024-12-28',
    status: 'submitted',
    maxGrade: 100,
    submittedAt: '2024-12-27',
    hasFiles: true,
    submissionCount: 15,
    totalStudents: 25
  },
  {
    id: 3,
    title: 'Database Indexing and Optimization',
    description: 'Understand indexing strategies and query optimization techniques.',
    deadline: '2025-01-05',
    status: 'in-progress',
    maxGrade: 100,
    hasFiles: true,
    submissionCount: 8,
    totalStudents: 25
  },
  {
    id: 4,
    title: 'REST API with Actix Web',
    description: 'Build a complete REST API using Rust and Actix Web framework.',
    deadline: '2025-01-15',
    status: 'not-started',
    maxGrade: 100,
    hasFiles: false,
    submissionCount: 2,
    totalStudents: 25
  },
  {
    id: 5,
    title: 'Database Transactions',
    description: 'Learn about ACID properties and implement transaction handling.',
    deadline: '2024-12-20',
    status: 'overdue',
    maxGrade: 100,
    hasFiles: true,
    submissionCount: 18,
    totalStudents: 25
  }
];

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('list');

  const getStatusBadge = (status: string, deadline?: string) => {
    switch (status) {
      case 'not-started':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Не начато</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">В процессе</Badge>;
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
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'submitted':
        return <Upload className="h-4 w-4 text-yellow-500" />;
      case 'graded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const isDeadlineSoon = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

  const filteredAssignments = mockAssignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const deadlineData = mockAssignments.map(assignment => ({
    ...assignment,
    daysUntilDeadline: Math.ceil((new Date(assignment.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  })).sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Лабораторные работы</h1>
              <p className="text-gray-600 mt-1">
                {user?.role === 'student' ? 'Complete your database laboratory assignments' : 
                 user?.role === 'teacher' ? 'Manage and grade student assignments' :
                 'Overview of all system assignments'}
              </p>
            </div>
            {(user?.role === 'teacher' || user?.role === 'admin') && (
              <Link href="/assignments/create">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Создать задание
                </Button>
              </Link>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Список заданий</TabsTrigger>
              <TabsTrigger value="deadlines">Дедлайны</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              {/* Search and Filter */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search assignments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все статусы</SelectItem>
                        <SelectItem value="not-started">Ещё не начато</SelectItem>
                        <SelectItem value="in-progress">В процессе</SelectItem>
                        <SelectItem value="submitted">Сдано</SelectItem>
                        <SelectItem value="graded">Проверено</SelectItem>
                        <SelectItem value="overdue">Срок истёк</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Assignments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssignments.map((assignment) => (
                  <Card key={assignment.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(assignment.status)}
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        </div>
                        {(user?.role === 'teacher' || user?.role === 'admin') && (
                          <div className="flex space-x-1">
                            <Link href={`/assignments/edit/${assignment.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {assignment.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Срок сдачи: {new Date(assignment.deadline).toLocaleDateString()}</span>
                          {isDeadlineSoon(assignment.deadline) && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              Скоро
                            </Badge>
                          )}
                        </div>
                        {getStatusBadge(assignment.status)}
                      </div>

                      {assignment.status === 'graded' && assignment.grade !== undefined && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-800">Оценка</span>
                            <span className="text-lg font-bold text-green-600">
                              {assignment.grade}/{assignment.maxGrade}
                            </span>
                          </div>
                        </div>
                      )}

                      {(user?.role === 'teacher' || user?.role === 'admin') && assignment.submissionCount !== undefined && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-800">Отправленные работы</span>
                            <span className="text-lg font-bold text-blue-600">
                              {assignment.submissionCount}/{assignment.totalStudents}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Link href={`/assignments/${assignment.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            <FileText className="h-4 w-4 mr-2" />
                            Просмотреть детали
                          </Button>
                        </Link>
                        {assignment.hasFiles && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredAssignments.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Задания не найдены</h3>
                    <p className="text-gray-600">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria.' 
                        : 'No assignments have been created yet.'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="deadlines" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Предстоящие дедлайны</CardTitle>
                  <CardDescription>
                    Следите за сроками сдачи заданий
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deadlineData.map((assignment, index) => (
                      <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <Link href={`/assignments/${assignment.id}`}>
                              <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                {assignment.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-600">Дата сдачи: {new Date(assignment.deadline).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            {assignment.daysUntilDeadline > 0 ? (
                              <span className={`text-sm font-medium ${
                                assignment.daysUntilDeadline <= 3 ? 'text-red-600' : 
                                assignment.daysUntilDeadline <= 7 ? 'text-orange-600' : 'text-green-600'
                              }`}>
                                {assignment.daysUntilDeadline} Осталось дней
                              </span>
                            ) : assignment.daysUntilDeadline === 0 ? (
                              <span className="text-sm font-medium text-red-600">Сдача сегодня</span>
                            ) : (
                              <span className="text-sm font-medium text-red-600">
                                {Math.abs(assignment.daysUntilDeadline)} просрочено на дней
                              </span>
                            )}
                            {(user?.role === 'teacher' || user?.role === 'admin') && (
                              <p className="text-xs text-gray-500">
                                {assignment.submissionCount}/{assignment.totalStudents} Сдано
                              </p>
                            )}
                          </div>
                          {getStatusBadge(assignment.status)}
                        </div>
                      </div>
                    ))}
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