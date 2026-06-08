// Mock student enrollment and progress data

export interface EnrolledCourse {
  id: string;
  skillId: string;
  skillTitle: string;
  skillImage: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  totalLessons: number;
  completedLessons: number;
  completedProjects: number;
  totalProjects: number;
  enrolledDate: string;
  lastAccessedDate: string;
  instructorName: string;
  rating: number;
  totalModules: number;
  completedModules: number;
}

export interface StudentProgress {
  userId: string;
  enrolledCourses: EnrolledCourse[];
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  averageProgress: number;
}

// Mock data - In a real app, this would come from an API
export const getStudentProgress = (userId?: string): StudentProgress => {
  return {
    userId: userId || 'student-001',
    enrolledCourses: [
      {
        id: 'enrollment-1',
        skillId: 'web-dev-101',
        skillTitle: 'Web Development Fundamentals',
        skillImage: '🌐',
        category: 'Web Development',
        difficulty: 'beginner',
        totalLessons: 24,
        completedLessons: 8,
        completedProjects: 1,
        totalProjects: 4,
        enrolledDate: '2026-05-10',
        lastAccessedDate: '2026-06-08',
        instructorName: 'John Mensah',
        rating: 4.8,
        totalModules: 4,
        completedModules: 1
      },
      {
        id: 'enrollment-2',
        skillId: 'react-advanced',
        skillTitle: 'Advanced React Development',
        skillImage: '⚛️',
        category: 'Web Development',
        difficulty: 'advanced',
        totalLessons: 32,
        completedLessons: 12,
        completedProjects: 2,
        totalProjects: 6,
        enrolledDate: '2026-06-01',
        lastAccessedDate: '2026-06-09',
        instructorName: 'Ama Osei',
        rating: 4.9,
        totalModules: 4,
        completedModules: 1
      },
      {
        id: 'enrollment-3',
        skillId: 'data-analysis-python',
        skillTitle: 'Data Analysis with Python',
        skillImage: '📊',
        category: 'Data Science',
        difficulty: 'intermediate',
        totalLessons: 26,
        completedLessons: 18,
        completedProjects: 3,
        totalProjects: 5,
        enrolledDate: '2026-05-20',
        lastAccessedDate: '2026-06-07',
        instructorName: 'Dr. Yaw Opoku',
        rating: 4.6,
        totalModules: 5,
        completedModules: 3
      }
    ],
    totalCoursesEnrolled: 3,
    totalCoursesCompleted: 0,
    averageProgress: ((8 + 12 + 18) / (24 + 32 + 26)) * 100
  };
};

// Helper function to calculate progress percentage
export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

// Helper function to format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Get completion status badge
export const getCompletionStatus = (progress: number): { status: string; color: string } => {
  if (progress === 100) {
    return { status: 'Completed', color: 'bg-green-100 text-green-800' };
  } else if (progress >= 50) {
    return { status: 'In Progress', color: 'bg-blue-100 text-blue-800' };
  } else if (progress > 0) {
    return { status: 'Started', color: 'bg-yellow-100 text-yellow-800' };
  }
  return { status: 'Not Started', color: 'bg-gray-100 text-gray-800' };
};
