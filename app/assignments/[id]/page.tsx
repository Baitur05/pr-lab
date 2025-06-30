'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useParams } from 'next/navigation';
import { 
  BookOpen, 
  Calendar,
  FileText,
  Download,
  Upload,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Edit,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

interface Assignment {
  id: number;
  title: string;
  description: string;
  deadline: string;
  maxGrade: number;
  materialsFileName?: string;
  createdAt: string;
  createdBy: string;
}

interface Submission {
  id: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  fileName: string;
  grade?: number;
  comment?: string;
  status: 'submitted' | 'graded';
}

const mockAssignment: Assignment = {
  id: 1,
  title: 'Creating Tables in PostgreSQL',
  description: `In this assignment, you will learn to create and manage database tables with proper constraints and relationships. 

**Learning Objectives:**
- Understand DDL (Data Definition Language) statements
- Learn to create tables with appropriate data types
- Implement primary keys, foreign keys, and constraints
- Practice database normalization principles

**Requirements:**
1. Create a database schema for a library management system
2. Implement at least 5 related tables
3. Include proper constraints and relationships
4. Write sample INSERT statements with test data
5. Document your design decisions

**Deliverables:**
- SQL file with table creation statements
- Documentation explaining your design
- Sample data insertion queries

**Grading Criteria:**
- Correct table structure (40%)
- Proper constraints and relationships (30%)
- Code quality and documentation (20%)
- Test data and examples (10%)`,
  deadline: '2024-12-25T23:59',
  maxGrade: 100,
  materialsFileName: 'postgresql_tables_guide.pdf',
  createdAt: '2024-12-15T10:00:00Z',
  createdBy: 'Dr. Sarah Johnson'
};

const mockSubmissions: Submission[] = [
  {
    id: 1,
    studentId: '3',
    studentName: 'John Smith',
    studentEmail: 'john.smith@student.edu',
    submittedAt: '2024-12-20T14:30:00Z',
    fileName: 'library_schema.sql',
    grade: 85,
    comment: 'Good work on the table structure. Consider adding more detailed constraints for the book ISBN field.',
    status: 'graded'
  },
  {
    id: 2,
    studentId: '4',
    studentName: 'Emma Wilson',
    studentEmail: 'emma.wilson@student.edu',
    submittedAt: '2024-12-21T09:15:00Z',
    fileName: 'database_design.zip',
    status: 'submitted'
  }
];

export default function AssignmentDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const assignmentId = parseInt(params.id as string);

  const [isLoading, setIsLoading] = useState(true);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userSubmission, setUserSubmission] = useState<Submission | null>(null);

  // Grading states
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeValue, setGradeValue] = useState('');
  const [gradeComment, setGradeComment] = useState('');
  const [isGrading, setIsGrading] = useState(false);

  useEffect(() => {
    // Simulate loading assignment data
    setTimeout(() => {
      setAssignment(mockAssignment);
      setSubmissions(mockSubmissions);
      
      // Find user's submission if student
      if (user?.role === 'student') {
        const submission = mockSubmissions.find(s => s.studentId === user.id);
        setUserSubmission(submission || null);
      }
      
      setIsLoading(false);
    }, 500);
  }, [assignmentId, user?.id]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadFile(file);
  };

  const handleSubmission = async () => {
    if (!uploadFile) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newSubmission: Submission = {
        id: Date.now(),
        studentId: user?.id || '',
        studentName: user?.name || '',
        studentEmail: user?.email || '',
        submittedAt: new Date().toISOString(),
        fileName: uploadFile.name,
        status: 'submitted'
      };

      setUserSubmission(newSubmission);
      setSubmissions(prev => [...prev, newSubmission]);
      setUploadFile(null);
      
    } catch (err) {
      console.error('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGradeSubmission = async () => {
    if (!gradingSubmission || !gradeValue) return;

    setIsGrading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSubmissions = submissions.map(sub => 
        sub.id === gradingSubmission.id 
          ? { ...sub, grade: parseInt(gradeValue), comment: gradeComment, status: 'graded' as const }
          : sub
      );
      
      setSubmissions(updatedSubmissions);
      setGradingSubmission(null);
      setGradeValue('');
      setGradeComment('');
      
    } catch (err) {
      console.error('Grading failed');
    } finally {
      setIsGrading(false);
    }
  };

  const isDeadlinePassed = () => {
    return new Date() > new Date(assignment?.deadline || '');
  };

  const getDaysUntilDeadline = () => {
    if (!assignment) return 0;
    const now = new Date();
    const deadline = new Date(assignment.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
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

  if (!assignment) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardContent className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Задание не найдено</h2>
                <p className="text-gray-600 mb-4">Задание, которое вы ищете, не существует.</p>
                <Link href="/assignments">
                  <Button>Назад к заданиям</Button>
                </Link>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/assignments">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад к заданиям
              </Button>
            </Link>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Создано{assignment.createdBy}</span>
                  <span>•</span>
                  <span>Дедлайн: {new Date(assignment.deadline).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Максимальный балл: {assignment.maxGrade} баллов</span>
                </div>
              </div>
              
              {(user?.role === 'teacher' || user?.role === 'admin') && (
                <Link href={`/assignments/edit/${assignment.id}`}>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Редактировать задание
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Assignment Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Описание задания</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {assignment.description}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Materials */}
              {assignment.materialsFileName && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Материалы задания</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">{assignment.materialsFileName}</p>
                          <p className="text-sm text-blue-600">Материалы и инструкции к заданию</p>
                        </div>
                      </div>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Скачать
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Student Submission Section */}
              {user?.role === 'student' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Upload className="h-5 w-5" />
                      <span>Ваше отправленное задание</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userSubmission ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <div>
                              <p className="font-medium text-green-900">Отправлено: {userSubmission.fileName}</p>
                              <p className="text-sm text-green-600">
                                Сдано {new Date(userSubmission.submittedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {userSubmission.status === 'graded' && userSubmission.grade !== undefined && (
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${getGradeColor(userSubmission.grade, assignment.maxGrade)}`}>
                                {userSubmission.grade}/{assignment.maxGrade}
                              </div>
                              <div className="text-sm text-gray-600">Оценка</div>
                            </div>
                          )}
                        </div>

                        {userSubmission.comment && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Отзыв преподавателя</h4>
                            <p className="text-gray-700">{userSubmission.comment}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {isDeadlinePassed() ? (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              Срок сдачи этого задания истёк. Вы больше не можете отправлять работу.
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <Label htmlFor="submission" className="cursor-pointer">
                                <span className="text-lg font-medium text-gray-900">Загрузите вашу работу</span>
                                <p className="text-gray-600 mt-1">Выберите файл для загрузки</p>
                                <Input
                                  id="submission"
                                  type="file"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                  accept=".sql,.zip,.pdf,.doc,.docx"
                                />
                              </Label>
                              {uploadFile && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                  <p className="text-blue-800 font-medium">Выбранный файл: {uploadFile.name}</p>
                                </div>
                              )}
                            </div>
                            
                            {uploadFile && (
                              <Button 
                                onClick={handleSubmission} 
                                disabled={isSubmitting}
                                className="w-full"
                              >
                                {isSubmitting ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                   Отправка...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Отправить задание
                                  </>
                                )}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Teacher/Admin Submissions View */}
              {(user?.role === 'teacher' || user?.role === 'admin') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Работы студентов</span>
                      </div>
                      <Badge variant="secondary">
                        {submissions.length} Работы

                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {submissions.map((submission) => (
                        <div key={submission.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{submission.studentName}</h4>
                              <p className="text-sm text-gray-600">{submission.studentEmail}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {submission.status === 'graded' && submission.grade !== undefined ? (
                                <div className="text-right">
                                  <div className={`text-lg font-bold ${getGradeColor(submission.grade, assignment.maxGrade)}`}>
                                    {submission.grade}/{assignment.maxGrade}
                                  </div>
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Проверено
                                  </Badge>
                                </div>
                              ) : (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                  В ожидании
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium">{submission.fileName}</span>
                              <span className="text-xs text-gray-500">
                                Отправлено {new Date(submission.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              {submission.status !== 'graded' && (
                                <Button 
                                  size="sm"
                                  onClick={() => {
                                    setGradingSubmission(submission);
                                    setGradeValue('');
                                    setGradeComment('');
                                  }}
                                >
                                  <Star className="h-4 w-4 mr-1" />
                                  Оценка
                                </Button>
                              )}
                            </div>
                          </div>

                          {submission.comment && (
                            <div className="mt-3 p-3 bg-gray-50 rounded">
                              <p className="text-sm text-gray-700">{submission.comment}</p>
                            </div>
                          )}
                        </div>
                      ))}

                      {submissions.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          Пока нет сдач от студентов.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Deadline Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Дедлайн</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Срок выполнения</span>
                      <span className="font-medium">
                        {new Date(assignment.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Время</span>
                      <span className="font-medium">
                        {new Date(assignment.deadline).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      {isDeadlinePassed() ? (
                        <Badge variant="destructive" className="w-full justify-center">
                          Дедлайн истёк
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="w-full justify-center">
                          {getDaysUntilDeadline()} осталось дней
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assignment Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Данные по заданию</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Максимальная оценка</span>
                      <span className="font-medium">{assignment.maxGrade} баллы</span>
                    </div>
                    {(user?.role === 'teacher' || user?.role === 'admin') && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Работы</span>
                          <span className="font-medium">{submissions.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Оценено</span>
                          <span className="font-medium">
                            {submissions.filter(s => s.status === 'graded').length}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Создано</span>
                      <span className="font-medium">
                        {new Date(assignment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Grading Modal */}
          {gradingSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Поставить оценку</CardTitle>
                  <CardDescription>
                    Поставить оценку работе {gradingSubmission.studentName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="grade">Оценка (out of {assignment.maxGrade})</Label>
                    <Input
                      id="grade"
                      type="number"
                      value={gradeValue}
                      onChange={(e) => setGradeValue(e.target.value)}
                      min="0"
                      max={assignment.maxGrade}
                      placeholder="Enter grade"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="comment">Отзыв (optional)</Label>
                    <Textarea
                      id="comment"
                      value={gradeComment}
                      onChange={(e) => setGradeComment(e.target.value)}
                      placeholder="Provide feedback to the student..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setGradingSubmission(null)}
                      disabled={isGrading}
                    >
                      Отмена
                    </Button>
                    <Button 
                      onClick={handleGradeSubmission}
                      disabled={!gradeValue || isGrading}
                    >
                      {isGrading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Сохранение...
                        </>
                      ) : (
                        'Save Grade'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}