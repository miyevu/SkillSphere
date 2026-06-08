'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { categories, difficulties } from '@/lib/skills-data';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedDifficulty: string | null;
  onDifficultyChange: (difficulty: string | null) => void;
}

export default function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange
}: SearchFiltersProps) {
  const hasFilters = searchQuery || selectedCategory !== 'All Skills' || selectedDifficulty;

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('All Skills');
    onDifficultyChange(null);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search skills by name, tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Level */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Difficulty Level</h3>
        <div className="flex gap-2 flex-wrap">
          {difficulties.map((diff) => (
            <button
              key={diff.value}
              onClick={() => onDifficultyChange(selectedDifficulty === diff.value ? null : diff.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDifficulty === diff.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          onClick={clearFilters}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
