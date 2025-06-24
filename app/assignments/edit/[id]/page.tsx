'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter, useParams } from 'next/navigation';
import { 
  BookOpen, 
  Calendar,
  FileText,
  Upload,
  Save,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

interface Assignment {
  id: number;
  title: string;
  description: string;
  deadline: string;
  maxGrade: number;
  materialsFileName?: string;
  createdAt: string;
  updatedAt?: string;
}

const mockAssignments: Assignment[] = [
  {
    id: 1,
    title: 'Creating Tables in PostgreSQL',
    description: 'Learn to create and manage database tables with proper constraints and relationships. This assignment covers DDL statements, primary keys, foreign keys, and data types.',
    deadline: '2024-12-25T23:59',
    maxGrade: 100,
    materialsFileName: 'postgresql_tables_guide.pdf',
    createdAt: '2024-12-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'SELECT Queries and JOINs',
    description: 'Master complex SELECT statements and various types of JOIN operations.',
    deadline: '2024-12-28T23:59',
    maxGrade: 100,
    createdAt: '2024-12-18T14:30:00Z'
  },
  {
    id: 3,
    title: 'Database Indexing and Optimization',
    description: 'Understand indexing strategies and query optimization techniques.',
    deadline: '2025-01-05T23:59',
    maxGrade: 100,
    materialsFileName: 'indexing_tutorial.zip',
    createdAt: '2024-12-20T09:15:00Z'
  }
];

export default function EditAssignmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const assignmentId = parseInt(params.id as string);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    maxGrade: 100,
    materials: null as File | null,
    removeMaterials: false
  });

  useEffect(() => {
    // Simulate loading assignment data
    setIsLoading(true);
    setTimeout(() => {
      const foundAssignment = mockAssignments.find(a => a.id === assignmentId);
      if (foundAssignment) {
        setAssignment(foundAssignment);
        setFormData({
          title: foundAssignment.title,
          description: foundAssignment.description,
          deadline: foundAssignment.deadline,
          maxGrade: foundAssignment.maxGrade,
          materials: null,
          removeMaterials: false
        });
      } else {
        setError('Assignment not found');
      }
      setIsLoading(false);
    }, 500);
  }, [assignmentId]);

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
      materials: file,
      removeMaterials: false
    }));
  };

  const handleRemoveMaterials = () => {
    setFormData(prev => ({
      ...prev,
      materials: null,
      removeMaterials: true
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setIsSaving(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      setIsSaving(false);
      return;
    }

    if (!formData.deadline) {
      setError('Deadline is required');
      setIsSaving(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Updating assignment:', {
        id: assignmentId,
        ...formData,
        materials: formData.materials?.name || null,
        updatedBy: user?.id,
        updatedAt: new Date().toISOString()
      });

      setSuccess(true);
      
      // Redirect after successful update
      setTimeout(() => {
        router.push('/assignments');
      }, 2000);

    } catch (err) {
      setError('Failed to update assignment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Deleting assignment:', assignmentId);
      
      router.push('/assignments');
    } catch (err) {
      setError('Failed to delete assignment. Please try again.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['teacher', 'admin']}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <ProtectedRoute allowedRoles={['teacher', 'admin']}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardContent className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Assignment Not Found</h2>
                <p className="text-gray-600 mb-4">The assignment you're looking for doesn't exist.</p>
                <Link href="/assignments">
                  <Button>Back to Assignments</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Assignment Updated Successfully!</h2>
                <p className="text-gray-600 mb-6">
                  "{formData.title}" has been updated and changes are now live.
                </p>
                <Link href="/assignments">
                  <Button>Back to Assignments</Button>
                </Link>
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
                Back to Assignments
              </Button>
            </Link>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Assignment</h1>
                <p className="text-gray-600">
                  Update the details for "{assignment.title}"
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Assignment
              </Button>
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Assignment Details</span>
              </CardTitle>
              <CardDescription>
                Update the information for this laboratory assignment
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
                  <Label htmlFor="title">Assignment Title *</Label>
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
                  <Label htmlFor="description">Description *</Label>
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
                    <Label htmlFor="deadline">Deadline *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="deadline"
                        name="deadline"
                        type="datetime-local"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Max Grade */}
                  <div className="space-y-2">
                    <Label htmlFor="maxGrade">Maximum Grade</Label>
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

                {/* Current Materials */}
                {assignment.materialsFileName && !formData.removeMaterials && (
                  <div className="space-y-2">
                    <Label>Current Materials</Label>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          {assignment.materialsFileName}
                        </span>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleRemoveMaterials}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}

                {/* Materials Upload */}
                <div className="space-y-2">
                  <Label htmlFor="materials">
                    {assignment.materialsFileName && !formData.removeMaterials 
                      ? 'Replace Assignment Materials' 
                      : 'Assignment Materials'}
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <Label htmlFor="materials" className="cursor-pointer">
                      <span className="text-sm text-gray-600">
                        Click to upload assignment materials (PDF, DOC, ZIP)
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
                        Selected: {formData.materials.name}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload materials like instructions, starter files, or reference documents (Max 10MB)
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Link href="/assignments">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
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