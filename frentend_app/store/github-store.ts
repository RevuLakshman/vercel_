'use client';

import { create } from 'zustand';
import { Repository } from '@/lib/github';

interface GitHubState {
  repositories: Repository[];
  selectedRepository: Repository | null;
  isLoading: boolean;
  searchQuery: string;
  setRepositories: (repositories: Repository[]) => void;
  setSelectedRepository: (repository: Repository | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSearchQuery: (query: string) => void;
  filteredRepositories: () => Repository[];
}

export const useGitHubStore = create<GitHubState>((set, get) => ({
  repositories: [],
  selectedRepository: null,
  isLoading: false,
  searchQuery: '',
  setRepositories: (repositories) => set({ repositories }),
  setSelectedRepository: (repository) => set({ selectedRepository: repository }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  filteredRepositories: () => {
    const state = get();
    const query = state.searchQuery.toLowerCase();
    
    if (!query) return state.repositories;
    
    return state.repositories.filter(repo => 
      repo.name.toLowerCase().includes(query) || 
      (repo.description && repo.description.toLowerCase().includes(query))
    );
  },
}));