'use client';

import Link from 'next/link';
import { EnrolledCourse, calculateProgress, formatDate, getCompletionStatus } from '@/lib/student-data';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, CheckCircle, Clock } from 'lucide-react';

interface EnrolledCourseCardProps {
  course: EnrolledCourse;
}

export default function EnrolledCourseCard({ course }: EnrolledCourseCardProps) {
  const progress = calculateProgress(course.completedLessons, course.totalLessons);
  const { status, color } = getCompletionStatus(progress);
  const lastAccessed = formatDate(course.enrolledDate);

  return (
    <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header with skill image and progress */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 sm:p-6 border-b">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <span className="text-4xl">{course.skillImage}</span>
            <div>
              <h3 className="font-bold text-slate-900 text-lg line-clamp-2">{course.skillTitle}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-600">{course.category}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>
                  {status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress section */}
      <div className="px-4 sm:px-6 py-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">Progress</span>
          <span className="text-sm font-bold text-primary">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-slate-600">
          <span>{course.completedLessons} of {course.totalLessons} lessons</span>
          <span>{course.completedProjects} of {course.totalProjects} projects</span>
        </div>
      </div>

      {/* Module progress */}
      <div className="px-4 sm:px-6 py-4 border-b">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-xs text-slate-600">Modules</span>
            </div>
            <p className="font-semibold text-slate-900">{course.completedModules}/{course.totalModules}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs text-slate-600">Last accessed</span>
            </div>
            <p className="font-semibold text-slate-900 text-sm">{lastAccessed}</p>
          </div>
        </div>
      </div>

      {/* Instructor and stats */}
      <div className="px-4 sm:px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 mb-1">Instructor</p>
            <p className="font-semibold text-slate-900">{course.instructorName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-600 mb-1">Rating</p>
            <div className="flex items-center justify-end gap-1">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold text-slate-900">{course.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 sm:px-6 py-4 flex gap-2">
        <Button className="flex-1" asChild>
          <Link href={`/skills/${course.skillId}`} className="flex items-center justify-center gap-2">
            Continue Learning
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        {progress === 100 && (
          <Button variant="outline" className="flex-1" asChild>
            <Link href={`/dashboard/certificate/${course.id}`} className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Certificate
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
