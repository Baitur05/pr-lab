'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
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
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock data - in real app, this would come from API
  const mockStats = {
    admin: {
      totalUsers: 247,
      totalAssignments: 18,
      totalGroups: 8,
      activeSubmissions: 142
    },
    teacher: {
      totalAssignments: 12,
      totalStudents: 45,
      pendingGrades: 23,
      completedSubmissions: 89
    },
    student: {
      totalAssignments: 8,
      completedAssignments: 5,
      pendingAssignments: 2,
      upcomingDeadlines: 3
    }
  };

  const mockRecentActivity = {
    admin: [
      { id: 1, action: 'New user registered', user: 'John Smith', time: '2 hours ago', type: 'user' },
      { id: 2, action: 'Assignment created', user: 'Dr. Johnson', time: '4 hours ago', type: 'assignment' },
      { id: 3, action: 'Group updated', user: 'Admin', time: '1 day ago', type: 'group' }
    ],
    teacher: [
      { id: 1, action: 'Assignment submitted', user: 'Emma Wilson', time: '1 hour ago', type: 'submission' },
      { id: 2, action: 'Grade given', user: 'Michael Chen', time: '3 hours ago', type: 'grade' },
      { id: 3, action: 'New assignment created', user: 'You', time: '1 day ago', type: 'assignment' }
    ],
    student: [
      { id: 1, action: 'Grade received', assignment: 'PostgreSQL Tables', time: '2 hours ago', type: 'grade' },
      { id: 2, action: 'Assignment submitted', assignment: 'JOIN Queries', time: '1 day ago', type: 'submission' },
      { id: 3, action: 'New assignment', assignment: 'Database Optimization', time: '2 days ago', type: 'assignment' }
    ]
  };

  const upcomingDeadlines = [
    { id: 1, title: 'Database Optimization', deadline: 'Dec 25, 2024', status: 'pending' },
    { id: 2, title: 'API Development', deadline: 'Dec 28, 2024', status: 'in-progress' },
    { id: 3, title: 'Final Project', deadline: 'Jan 15, 2025', status: 'not-started' }
  ];

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${timeGreeting}, ${user?.name}!`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4" />;
      case 'assignment': return <BookOpen className="h-4 w-4" />;
      case 'submission': return <FileText className="h-4 w-4" />;
      case 'grade': return <CheckCircle className="h-4 w-4" />;
      case 'group': return <Users className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'not-started':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Not Started</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const renderStatsCards = () => {
    if (user?.role === 'admin') {
      const stats = mockStats.admin;
      return (
        <>
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12 from last month</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <BookOpen className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.totalAssignments}</div>
              <p className="text-xs text-muted-foreground">+3 this week</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.totalGroups}</div>
              <p className="text-xs text-muted-foreground">All groups active</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Submissions</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.activeSubmissions}</div>
              <p className="text-xs text-muted-foreground">+18 today</p>
            </CardContent>
          </Card>
        </>
      );
    } else if (user?.role === 'teacher') {
      const stats = mockStats.teacher;
      return (
        <>
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Assignments</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalAssignments}</div>
              <p className="text-xs text-muted-foreground">Active assignments</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Students</CardTitle>
              <Users className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Across 3 groups</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingGrades}</div>
              <p className="text-xs text-muted-foreground">Need review</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.completedSubmissions}</div>
              <p className="text-xs text-muted-foreground">Graded submissions</p>
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
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalAssignments}</div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.completedAssignments}</div>
              <p className="text-xs text-muted-foreground">{Math.round((stats.completedAssignments / stats.totalAssignments) * 100)}% progress</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingAssignments}</div>
              <p className="text-xs text-muted-foreground">Need submission</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.upcomingDeadlines}</div>
              <p className="text-xs text-muted-foreground">Next 7 days</p>
            </CardContent>
          </Card>
        </>
      );
    }
  };

  const renderQuickActions = () => {
    if (user?.role === 'admin') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-blue-600 hover:bg-blue-700">
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
          </Link>
          <Link href="/assignments">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-emerald-600 hover:bg-emerald-700">
              <BookOpen className="h-6 w-6" />
              <span>View Assignments</span>
            </Button>
          </Link>
          <Link href="/reports">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-orange-600 hover:bg-orange-700">
              <BarChart3 className="h-6 w-6" />
              <span>System Reports</span>
            </Button>
          </Link>
        </div>
      );
    } else if (user?.role === 'teacher') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/assignments/create">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-6 w-6" />
              <span>Create Assignment</span>
            </Button>
          </Link>
          <Link href="/assignments">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-emerald-600 hover:bg-emerald-700">
              <BookOpen className="h-6 w-6" />
              <span>View Assignments</span>
            </Button>
          </Link>
          <Link href="/students">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-orange-600 hover:bg-orange-700">
              <Users className="h-6 w-6" />
              <span>My Students</span>
            </Button>
          </Link>
          <Link href="/reports">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-purple-600 hover:bg-purple-700">
              <BarChart3 className="h-6 w-6" />
              <span>Grade Reports</span>
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
              <span>My Assignments</span>
            </Button>
          </Link>
          <Link href="/assignments">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle className="h-6 w-6" />
              <span>My Grades</span>
            </Button>
          </Link>
          <Link href="/assignments">
            <Button className="w-full h-20 flex flex-col space-y-2 bg-orange-600 hover:bg-orange-700">
              <Calendar className="h-6 w-6" />
              <span>Deadlines</span>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getWelcomeMessage()}</h1>
            <p className="text-gray-600">
              {user?.role === 'admin' && 'Manage the laboratory practicum system and oversee all activities.'}
              {user?.role === 'teacher' && 'Create assignments, grade submissions, and track student progress.'}
              {user?.role === 'student' && 'Complete your database laboratory assignments and track your progress.'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {renderStatsCards()}
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used features for your role</CardDescription>
            </CardHeader>
            <CardContent>
              {renderQuickActions()}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(mockRecentActivity[user?.role as keyof typeof mockRecentActivity] || []).map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-500">
                          {'user' in activity ? activity.user : 'assignment' in activity ? activity.assignment : ''}
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
            {user?.role === 'student' ? (
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>Don't miss these important dates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingDeadlines.map((deadline) => (
                      <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{deadline.title}</p>
                          <p className="text-sm text-gray-600">{deadline.deadline}</p>
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
                  <CardTitle>System Overview</CardTitle>
                  <CardDescription>Key metrics at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Active Assignments</span>
                      </div>
                      <span className="text-blue-600 font-bold">
                        {user?.role === 'admin' ? '18' : '12'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-emerald-600" />
                        <span className="font-medium">Active Students</span>
                      </div>
                      <span className="text-emerald-600 font-bold">
                        {user?.role === 'admin' ? '247' : '45'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                        <span className="font-medium">Completion Rate</span>
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