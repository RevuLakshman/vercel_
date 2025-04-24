'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getUserRepositories, Repository } from '@/lib/github';
import { useGitHubStore } from '@/store/github-store';
import { RepositoryCard } from '@/components/repository/repository-card';
import { Input } from '@/components/ui/input';
import { Search, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function RepositoryList() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const {
    repositories,
    selectedRepository,
    isLoading,
    searchQuery,
    setRepositories,
    setSelectedRepository,
    setIsLoading,
    setSearchQuery,
    filteredRepositories,
  } = useGitHubStore();
  const [sortBy, setSortBy] = useState<string>('updated');

  useEffect(() => {
    async function fetchRepositories() {
      if (session?.accessToken) {
        setIsLoading(true);
        try {
          const repos = await getUserRepositories(session.accessToken);
          setRepositories(repos);
        } catch (error) {
          toast({
            title: "Error fetching repositories",
            description: "Please try again later",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchRepositories();
  }, [session, setRepositories, setIsLoading, toast]);

  const handleRepositorySelect = (repository: Repository) => {
    setSelectedRepository(repository);
  };

  const sortedRepositories = (): Repository[] => {
    const filtered = filteredRepositories();
    
    switch (sortBy) {
      case 'name':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case 'stars':
        return [...filtered].sort((a, b) => b.stargazers_count - a.stargazers_count);
      case 'updated':
      default:
        return [...filtered].sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <FilterX className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        
        <div className="w-full sm:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently updated</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="stars">Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index} 
              className="border rounded-lg p-4 h-[230px] animate-pulse"
            >
              <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3 mb-8"></div>
              <div className="h-9 bg-muted rounded w-full mt-auto"></div>
            </div>
          ))}
        </div>
      ) : sortedRepositories().length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedRepositories().map((repo) => (
            <RepositoryCard
              key={repo.id}
              repository={repo}
              onSelect={handleRepositorySelect}
              isSelected={selectedRepository?.id === repo.id}
            />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-2">
            {searchQuery 
              ? "No repositories matching your search criteria" 
              : "No repositories found"}
          </p>
          {searchQuery && (
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}