'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Calendar,
  FileText,
  Upload,
  Save,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function CreateAssignmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    maxGrade: 100,
    materials: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      materials: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setIsLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      setIsLoading(false);
      return;
    }

    if (!formData.deadline) {
      setError('Deadline is required');
      setIsLoading(false);
      return;
    }

    const deadlineDate = new Date(formData.deadline);
    const now = new Date();
    if (deadlineDate <= now) {
      setError('Deadline must be in the future');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, this would be an API call
      console.log('Creating assignment:', {
        ...formData,
        materials: formData.materials?.name || null,
        createdBy: user?.id,
        createdAt: new Date().toISOString()
      });

      setSuccess(true);
      
      // Redirect after successful creation
      setTimeout(() => {
        router.push('/assignments');
      }, 2000);

    } catch (err) {
      setError('Failed to create assignment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Tomorrow
    return today.toISOString().split('T')[0];
  };

  if (success) {
    return (
      <ProtectedRoute allowedRoles={['teacher', 'admin']}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="text-center">
              <CardContent className="pt-16 pb-16">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Задание успешно создано!</h2>
                <p className="text-gray-600 mb-6">
                  "{formData.title}" было создано и теперь доступно для студентов.
                </p>
                <div className="space-x-4">
                  <Link href="/assignments">
                    <Button>Просмотреть все задания</Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSuccess(false);
                      setFormData({
                        title: '',
                        description: '',
                        deadline: '',
                        maxGrade: 100,
                        materials: null
                      });
                    }}
                  >
                    Создать другое
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/assignments">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
               Назад к заданиям
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Создать новое задание</h1>
            <p className="text-gray-600">
              Создайте новое лабораторное задание для выполнения вашими студентами.
            </p>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Детали задания</span>
              </CardTitle>
              <CardDescription>
                Заполните информацию для вашего нового лабораторного задания
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Название задания *</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Database Normalization and Design"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Описание *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what students need to do, learning objectives, and any special instructions..."
                    rows={6}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Deadline */}
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Крайний срок *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="deadline"
                        name="deadline"
                        type="datetime-local"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        min={getMinDate()}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Max Grade */}
                  <div className="space-y-2">
                    <Label htmlFor="maxGrade">Максимальный балл</Label>
                    <Input
                      id="maxGrade"
                      name="maxGrade"
                      type="number"
                      value={formData.maxGrade}
                      onChange={handleInputChange}
                      min="1"
                      max="1000"
                      placeholder="100"
                    />
                  </div>
                </div>

                {/* Materials Upload */}
                <div className="space-y-2">
                  <Label htmlFor="materials">Материалы для задания</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <Label htmlFor="materials" className="cursor-pointer">
                      <span className="text-sm text-gray-600">
                        Нажмите, чтобы загрузить материалы задания (PDF, DOC, ZIP)
                      </span>
                      <Input
                        id="materials"
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.zip,.rar"
                        className="hidden"
                      />
                    </Label>
                    {formData.materials && (
                      <div className="mt-2 text-sm text-blue-600">
                        Выбрано:{formData.materials.name}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Загрузите материалы, такие как инструкции, стартовые файлы или справочные документы (максимум 10 МБ)
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Link href="/assignments">
                    <Button type="button" variant="outline">
                      Отмена
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                       Создание...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Создать задание
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}