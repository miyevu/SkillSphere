'use client';

import { useState, useMemo } from 'react';
import { skillsData, categories } from '@/lib/skills-data';
import SkillCard from '@/components/skills/SkillCard';
import SearchFilters from '@/components/skills/SearchFilters';
import { BookOpen } from 'lucide-react';

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Skills');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  // Filter skills based on search, category, and difficulty
  const filteredSkills = useMemo(() => {
    return skillsData.filter((skill) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        skill.title.toLowerCase().includes(searchLower) ||
        skill.description.toLowerCase().includes(searchLower) ||
        skill.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        skill.category.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Category filter
      if (selectedCategory !== 'All Skills' && skill.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty && skill.difficulty !== selectedDifficulty) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold text-primary">SkillSphere</span>
            </div>
            <span className="text-sm text-muted-foreground">Browse Skills</span>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Explore Skills</h1>
          <p className="text-lg text-muted-foreground">
            Choose from {skillsData.length} skill areas to accelerate your career
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filters */}
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
        />

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredSkills.length}</span> of{' '}
            <span className="font-semibold text-foreground">{skillsData.length}</span> skills
          </p>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No skills found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
