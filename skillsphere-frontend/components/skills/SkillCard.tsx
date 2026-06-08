'use client';

import Link from 'next/link';
import { Star, Users, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Skill } from '@/lib/skills-data';

interface SkillCardProps {
  skill: Skill;
}

export default function SkillCard({ skill }: SkillCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  return (
    <Link href={`/skills/${skill.id}`}>
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {/* Header with emoji and difficulty */}
        <div className="bg-muted p-6 flex items-center justify-between border-b border-border">
          <div className="text-5xl">{skill.image}</div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${difficultyColors[skill.difficulty]}`}>
            {skill.difficulty}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
            {skill.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
            {skill.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {skill.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {skill.tags.length > 2 && (
              <span className="text-xs text-muted-foreground">+{skill.tags.length - 2} more</span>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4 py-4 border-t border-b border-border">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{skill.lessons} lessons</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{skill.projects} projects</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{skill.students.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-muted-foreground">{skill.rating}</span>
            </div>
          </div>

          {/* Footer info */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{skill.duration}</span>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
