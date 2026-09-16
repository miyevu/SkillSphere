'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { skillsData } from '@/lib/skills-data';
import { isEnrolled, enrollInSkill } from '@/lib/enrollment';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users, Star, CheckCircle, BookOpen, Code, Award, ClipboardList } from 'lucide-react';

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const skillId = params.id as string;
  const skill = skillsData.find(s => s.id === skillId);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string | null>(skill?.modules[0]?.id || null);

  useEffect(() => {
    if (skill && user) {
      isEnrolled(skill.id).then(setEnrolled);
    }
  }, [skill, user]);

  if (!skill) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
        <Link href="/skills" className="flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Skills
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Skill not found</h1>
          <p className="text-slate-600 mt-2">The skill you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const handleEnroll = async () => {
    if (!user) {
      router.push(`/auth/login?next=/skills/${skill.id}`);
      return;
    }
    setEnrolling(true);
    const success = await enrollInSkill(skill.id);
    setEnrolling(false);
    if (success) {
      setEnrolled(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/skills" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Skills
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-5xl">{skill.image}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[skill.difficulty]}`}>
                  {skill.difficulty.charAt(0).toUpperCase() + skill.difficulty.slice(1)}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{skill.title}</h1>
              <p className="text-slate-600 text-lg max-w-2xl">{skill.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Course Overview</h2>
              <p className="text-slate-700 leading-relaxed mb-4">{skill.fullDescription}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-sm text-slate-600">Duration</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{skill.duration}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="text-sm text-slate-600">Lessons</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{skill.lessons}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-1">
                    <Code className="w-5 h-5 text-primary" />
                    <span className="text-sm text-slate-600">Projects</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{skill.projects}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-sm text-slate-600">Students</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{skill.students.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-lg">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5"
                      fill={i < Math.floor(skill.rating) ? 'currentColor' : 'none'}
                      strokeWidth={i < Math.floor(skill.rating) ? 0 : 2}
                    />
                  ))}
                </div>
                <span className="font-semibold text-slate-900">{skill.rating}</span>
                <span className="text-slate-600">({skill.students.toLocaleString()} reviews)</span>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Requirements</h2>
              <div className="space-y-2">
                {skill.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{req}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Skills You'll Learn</h2>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Course Curriculum</h2>
              <div className="space-y-3">
                {skill.modules.map((module, idx) => (
                  <div key={module.id} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                      className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <span className="font-semibold text-slate-900">
                          Module {idx + 1}: {module.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-600">{module.duration}</span>
                        <svg
                          className={`w-5 h-5 text-slate-600 transition-transform ${
                            expandedModule === module.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </button>
                    
                    {expandedModule === module.id && (
                      <div className="px-4 py-3 bg-white border-t space-y-2">
                        {module.lessons.map((lesson, lessonIdx) => (
                          <Link
                            key={lesson.id}
                            href={`/skills/${skill.id}/lessons/${lesson.id}`}
                            className="flex items-start gap-3 py-2 hover:bg-slate-50 rounded-md px-2 -mx-2 transition-colors"
                          >
                            <span className="text-slate-400 text-sm min-w-fit">Lesson {lessonIdx + 1}</span>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{lesson.title}</p>
                              <p className="text-sm text-slate-600">{lesson.description}</p>
                              <span className="text-xs text-slate-500">{lesson.duration}</span>
                            </div>
                          </Link>
                        ))}
                        <Link
                          href={`/skills/${skill.id}/assignments/${module.id}`}
                          className="flex items-center gap-2 py-2 px-2 -mx-2 mt-1 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors text-sm font-medium text-primary"
                        >
                          <ClipboardList className="w-4 h-4" />
                          Module Assignment
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-6 mb-6 sticky top-4">
              <h3 className="font-bold text-slate-900 mb-4">Instructor</h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{skill.instructor.image}</span>
                <div>
                  <p className="font-semibold text-slate-900">{skill.instructor.name}</p>
                  <p className="text-sm text-slate-600">{skill.instructor.role}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Experienced professional dedicated to helping students master this skill.
              </p>
              
              <Button
                onClick={handleEnroll}
                className="w-full mb-3"
                disabled={enrolled || enrolling || authLoading}
              >
                {enrolled ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Enrolled
                  </div>
                ) : enrolling ? (
                  'Enrolling...'
                ) : !user ? (
                  'Log In to Enroll'
                ) : (
                  'Enroll Now'
                )}
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <Link href="/skills">Continue Browsing</Link>
              </Button>
            </div>

            <div className="bg-slate-50 border rounded-lg p-6 space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Category</p>
                <p className="font-semibold text-slate-900">{skill.category}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Difficulty</p>
                <p className="font-semibold text-slate-900 capitalize">{skill.difficulty}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Students</p>
                <p className="font-semibold text-slate-900">{skill.students.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Certificate</p>
                <p className="font-semibold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  Yes, upon completion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}