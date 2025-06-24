"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  GraduationCap,
  User,
  Mail,
  Calendar,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  group?: string;
  createdAt: string;
  lastActivity: string;
  status: "active" | "inactive";
}

interface Group {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  teacherName: string;
  studentCount: number;
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@university.edu",
    role: "admin",
    createdAt: "2024-01-15",
    lastActivity: "2024-12-22",
    status: "active",
  },
  {
    id: "2",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: "teacher",
    createdAt: "2024-02-01",
    lastActivity: "2024-12-21",
    status: "active",
  },
  {
    id: "3",
    name: "John Smith",
    email: "john.smith@student.edu",
    role: "student",
    group: "CS-301",
    createdAt: "2024-09-01",
    lastActivity: "2024-12-21",
    status: "active",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma.wilson@student.edu",
    role: "student",
    group: "CS-301",
    createdAt: "2024-09-01",
    lastActivity: "2024-12-22",
    status: "active",
  },
  {
    id: "5",
    name: "Prof. Michael Chen",
    email: "michael.chen@university.edu",
    role: "teacher",
    createdAt: "2024-03-15",
    lastActivity: "2024-12-20",
    status: "active",
  },
];

const mockGroups: Group[] = [
  {
    id: "1",
    name: "CS-301",
    description: "Database Systems - Fall 2024",
    teacherId: "2",
    teacherName: "Dr. Sarah Johnson",
    studentCount: 25,
    createdAt: "2024-08-15",
  },
  {
    id: "2",
    name: "CS-302",
    description: "Advanced Database Concepts - Fall 2024",
    teacherId: "5",
    teacherName: "Prof. Michael Chen",
    studentCount: 20,
    createdAt: "2024-08-15",
  },
];

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // User creation form
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student" as "admin" | "teacher" | "student",
    group: "",
  });

  // Group creation form
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [createGroupError, setCreateGroupError] = useState("");
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    teacherId: "",
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "teacher":
        return <GraduationCap className="h-4 w-4" />;
      case "student":
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Admin
          </Badge>
        );
      case "teacher":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Teacher
          </Badge>
        );
      case "student":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Student
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        Inactive
      </Badge>
    );
  };

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setIsCreating(true);

    // Validation
    if (!newUser.name.trim() || !newUser.email.trim()) {
      setCreateError("Name and email are required");
      setIsCreating(false);
      return;
    }

    if (mockUsers.some((u) => u.email === newUser.email)) {
      setCreateError("Email already exists");
      setIsCreating(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Creating user:", newUser);

      // Reset form
      setNewUser({ name: "", email: "", role: "student", group: "" });
      setShowCreateUser(false);
    } catch (err) {
      setCreateError("Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateGroupError("");
    setIsCreatingGroup(true);

    // Validation
    if (!newGroup.name.trim() || !newGroup.teacherId) {
      setCreateGroupError("Group name and teacher are required");
      setIsCreatingGroup(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Creating group:", newGroup);

      // Reset form
      setNewGroup({ name: "", description: "", teacherId: "" });
      setShowCreateGroup(false);
    } catch (err) {
      setCreateGroupError("Failed to create group");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    console.log("Deleting user:", userId);
    // In real app, this would be an API call
  };

  const teachers = mockUsers.filter((u) => u.role === "teacher");
  const groups = Array.from(
    new Set(mockUsers.filter((u) => u.group).map((u) => u.group!))
  );

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              System Administration
            </h1>
            <p className="text-gray-600">
              Manage users, groups, and system settings
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {mockUsers.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockUsers.filter((u) => u.status === "active").length} active
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Teachers</CardTitle>
                <GraduationCap className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {mockUsers.filter((u) => u.role === "teacher").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active instructors
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <User className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {mockUsers.filter((u) => u.role === "student").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Enrolled students
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Группы</CardTitle>
                <Settings className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {mockGroups.length}
                </div>
                <p className="text-xs text-muted-foreground">Active groups</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="groups">Group Management</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              {/* User Management Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Users</h2>
                <Button
                  onClick={() => setShowCreateUser(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>

              {/* Search and Filter */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Users List */}
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>

                            <div>
                              <div className="flex items-center space-x-2">
                                {getRoleIcon(user.role)}
                                <h3 className="font-medium text-gray-900">
                                  {user.name}
                                </h3>
                                {getRoleBadge(user.role)}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-3 w-3" />
                                  <span>{user.email}</span>
                                </div>
                                {user.group && (
                                  <div>
                                    <span>Group: {user.group}</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    Joined:{" "}
                                    {new Date(
                                      user.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {getStatusBadge(user.status)}
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {user.id !== "1" && ( // Don't allow deleting the main admin
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="groups" className="space-y-6">
              {/* Group Management Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Groups</h2>
                <Button
                  onClick={() => setShowCreateGroup(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>

              {/* Groups Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="hover:shadow-lg transition-shadow duration-200"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {group.name}
                          </CardTitle>
                          <CardDescription>{group.description}</CardDescription>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Teacher</span>
                        <span className="font-medium">{group.teacherName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Students</span>
                        <span className="font-medium">
                          {group.studentCount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Created</span>
                        <span className="font-medium">
                          {new Date(group.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Create User Modal */}
          {showCreateUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Create New User</CardTitle>
                  <CardDescription>
                    Add a new user to the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    {createError && (
                      <Alert variant="destructive">
                        <AlertDescription>{createError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(
                          value: "admin" | "teacher" | "student"
                        ) => setNewUser((prev) => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newUser.role === "student" && (
                      <div className="space-y-2">
                        <Label htmlFor="group">Group</Label>
                        <Select
                          value={newUser.group}
                          onValueChange={(value) =>
                            setNewUser((prev) => ({ ...prev, group: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a group" />
                          </SelectTrigger>
                          <SelectContent>
                            {groups.map((group) => (
                              <SelectItem key={group} value={group}>
                                {group}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateUser(false)}
                        disabled={isCreating}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isCreating}>
                        {isCreating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating...
                          </>
                        ) : (
                          "Create User"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Create Group Modal */}
          {showCreateGroup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Create New Group</CardTitle>
                  <CardDescription>Create a new student group</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateGroup} className="space-y-4">
                    {createGroupError && (
                      <Alert variant="destructive">
                        <AlertDescription>{createGroupError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="groupName">Group Name</Label>
                      <Input
                        id="groupName"
                        value={newGroup.name}
                        onChange={(e) =>
                          setNewGroup((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="e.g., CS-301"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newGroup.description}
                        onChange={(e) =>
                          setNewGroup((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="e.g., Database Systems - Fall 2024"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teacher">Assigned Teacher</Label>
                      <Select
                        value={newGroup.teacherId}
                        onValueChange={(value) =>
                          setNewGroup((prev) => ({ ...prev, teacherId: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                        <SelectContent>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateGroup(false)}
                        disabled={isCreatingGroup}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isCreatingGroup}>
                        {isCreatingGroup ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating...
                          </>
                        ) : (
                          "Create Group"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
