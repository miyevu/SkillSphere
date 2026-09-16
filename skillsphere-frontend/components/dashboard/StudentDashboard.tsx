'use client';

import { useState, useEffect } from 'react';
import { StudentProgress, getStudentProgress } from '@/lib/student-data';
import EnrolledCourseCard from './EnrolledCourseCard';
import { BookOpen, Target, Trophy, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface StudentDashboardProps {
  userEmail?: string;
}

export default function StudentDashboard({ userEmail }: StudentDashboardProps) {
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentProgress()
      .then(setStudentProgress)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-200 h-24 rounded-lg" />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-200 h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!studentProgress) {
    return null;
  }

  const overallProgress = Math.round(studentProgress.averageProgress);
  const completedLessons = studentProgress.enrolledCourses.reduce(
    (sum, course) => sum + course.completedLessons,
    0
  );
  const totalLessons = studentProgress.enrolledCourses.reduce(
    (sum, course) => sum + course.totalLessons,
    0
  );
  const completedProjects = studentProgress.enrolledCourses.reduce(
    (sum, course) => sum + course.completedProjects,
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Welcome back! 👋</h1>
        <p className="text-slate-600">Here's your learning progress at a glance</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 bg-blue-200 px-2 py-1 rounded">Active</span>
          </div>
          <p className="text-sm text-slate-600 mb-1">Active Courses</p>
          <p className="text-3xl font-bold text-blue-900">{studentProgress.totalCoursesEnrolled}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <Trophy className="w-8 h-8 text-green-600" />
            <span className="text-xs font-semibold text-green-600 bg-green-200 px-2 py-1 rounded">Completed</span>
          </div>
          <p className="text-sm text-slate-600 mb-1">Completed Courses</p>
          <p className="text-3xl font-bold text-green-900">{studentProgress.totalCoursesCompleted}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <Zap className="w-8 h-8 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600 bg-purple-200 px-2 py-1 rounded">Lessons</span>
          </div>
          <p className="text-sm text-slate-600 mb-1">Lessons Completed</p>
          <p className="text-3xl font-bold text-purple-900">{completedLessons}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <Target className="w-8 h-8 text-orange-600" />
            <span className="text-xs font-semibold text-orange-600 bg-orange-200 px-2 py-1 rounded">Projects</span>
          </div>
          <p className="text-sm text-slate-600 mb-1">Projects Completed</p>
          <p className="text-3xl font-bold text-orange-900">{completedProjects}</p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Overall Progress</h2>
            <p className="text-slate-600">Your learning journey across all courses</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-primary">{overallProgress}%</p>
          </div>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div>
            <p className="text-sm text-slate-600 mb-1">Total Lessons</p>
            <p className="text-xl font-bold text-slate-900">
              {completedLessons} <span className="text-slate-400 font-normal">/ {totalLessons}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Modules Completed</p>
            <p className="text-xl font-bold text-slate-900">
              {studentProgress.enrolledCourses.reduce((sum, c) => sum + c.completedModules, 0)} <span className="text-slate-400 font-normal">/ {studentProgress.enrolledCourses.reduce((sum, c) => sum + c.totalModules, 0)}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Next Goal</p>
            <p className="text-xl font-bold text-slate-900">
              Complete <span className="text-primary">1 Module</span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Your Courses</h2>
            <p className="text-slate-600">Continue where you left off or start a new course</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/skills" className="flex items-center gap-2">
              Explore More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {studentProgress.enrolledCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentProgress.enrolledCourses.map((course) => (
              <EnrolledCourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed rounded-lg p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses yet</h3>
            <p className="text-slate-600 mb-4">Start learning by exploring our skill areas</p>
            <Button asChild>
              <Link href="/skills">Browse Courses</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border rounded-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">🎉 Achievements</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-3xl mb-2">🔥</p>
            <p className="font-semibold text-slate-900">Learning Streak</p>
            <p className="text-sm text-slate-600">5 days in a row</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-3xl mb-2">⭐</p>
            <p className="font-semibold text-slate-900">Quick Learner</p>
            <p className="text-sm text-slate-600">Completed 10% in 1 week</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-3xl mb-2">🎯</p>
            <p className="font-semibold text-slate-900">Project Master</p>
            <p className="text-sm text-slate-600">5 projects completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}