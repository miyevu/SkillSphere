'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { skillsData } from '@/lib/skills-data';
import { getCompletedLessonIds, markLessonComplete, markLessonIncomplete } from '@/lib/lesson-progress';
import { ArrowLeft, ArrowRight, CheckCircle, Circle, PlayCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const skillId = params.id as string;
  const lessonId = params.lessonId as string;

  const skill = skillsData.find((s) => s.id === skillId);

  const flatLessons = skill
    ? skill.modules.flatMap((module) =>
        module.lessons.map((lesson) => ({ ...lesson, moduleId: module.id, moduleTitle: module.title }))
      )
    : [];

  const currentIndex = flatLessons.findIndex((l) => l.id === lessonId);
  const lesson = flatLessons[currentIndex];
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null;

  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    if (skill) {
      getCompletedLessonIds(skill.id).then((ids) => {
        setCompletedIds(ids);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skill?.id, lessonId]);

  if (!skill || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Lesson not found</h1>
          <Link href="/skills" className="text-primary hover:underline">
            Back to Skills
          </Link>
        </div>
      </div>
    );
  }

  const completed = completedIds.includes(lesson.id);

  const toggleComplete = async () => {
    const success = completed
      ? await markLessonIncomplete(skill.id, lesson.id)
      : await markLessonComplete(skill.id, lesson.id);
    if (success) refresh();
  };

  const goToNext = async () => {
    if (!completed) {
      await markLessonComplete(skill.id, lesson.id);
    }
    if (nextLesson) {
      router.push(`/skills/${skill.id}/lessons/${nextLesson.id}`);
    } else {
      router.push(`/skills/${skill.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href={`/skills/${skill.id}`}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            {skill.title}
          </Link>
          <span className="text-sm text-slate-500">
            Lesson {currentIndex + 1} of {flatLessons.length}
          </span>
        </div>
        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((currentIndex + 1) / flatLessons.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <p className="text-sm font-medium text-primary mb-1">{lesson.moduleTitle}</p>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{lesson.title}</h1>
            <p className="text-slate-600">{lesson.description}</p>
          </div>

          <div className="bg-slate-900 rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center text-white/70">
              <PlayCircle className="w-16 h-16 mx-auto mb-3 opacity-60" />
              <p className="text-sm">Lesson content ({lesson.duration}) goes here</p>
              <p className="text-xs text-white/40 mt-1">
                Replace this block once you add real video/text/quiz content
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-slate-900">About this lesson</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">{lesson.description}</p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              disabled={!prevLesson}
              onClick={() => prevLesson && router.push(`/skills/${skill.id}/lessons/${prevLesson.id}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <Button variant={completed ? 'outline' : 'default'} onClick={toggleComplete} className="gap-2" disabled={loading}>
              {completed ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              {completed ? 'Completed' : 'Mark as complete'}
            </Button>

            <Button onClick={goToNext}>
              {nextLesson ? 'Next Lesson' : 'Finish Course'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-4 sticky top-24">
            <h3 className="font-semibold text-slate-900 mb-3 px-2">Course Content</h3>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {skill.modules.map((module) => (
                <div key={module.id}>
                  <p className="text-xs font-semibold text-slate-500 uppercase px-2 mb-1">{module.title}</p>
                  <div className="space-y-1">
                    {module.lessons.map((l) => {
                      const isCurrent = l.id === lesson.id;
                      const isDone = completedIds.includes(l.id);
                      return (
                        <Link
                          key={l.id}
                          href={`/skills/${skill.id}/lessons/${l.id}`}
                          className={`flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors ${
                            isCurrent ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                          )}
                          <span className="line-clamp-1">{l.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}