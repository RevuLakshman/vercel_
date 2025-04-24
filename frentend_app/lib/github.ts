'use client';

import { Octokit } from 'octokit';

export type Repository = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  default_branch: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  language: string | null;
  private: boolean;
};

export async function getUserRepositories(accessToken: string | undefined): Promise<Repository[]> {
  if (!accessToken) return [];

  try {
    const octokit = new Octokit({ auth: accessToken });
    
    const response = await octokit.request('GET /user/repos', {
      sort: 'updated',
      per_page: 100,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    
    return response.data as Repository[];
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
}

export async function getRepositoryBranches(accessToken: string | undefined, owner: string, repo: string) {
  if (!accessToken) return [];

  try {
    const octokit = new Octokit({ auth: accessToken });
    
    const response = await octokit.request('GET /repos/{owner}/{repo}/branches', {
      owner,
      repo,
      per_page: 100,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching branches:', error);
    return [];
  }
}

export async function deployRepository(accessToken: string | undefined, repository: Repository) {
  if (!accessToken) return { success: false, message: 'No access token available' };

  // This is a placeholder for the actual deployment logic
  // In a real application, you would call your deployment service/API
  try {
    // Simulate a deployment process
    return {
      success: true,
      message: `Repository ${repository.full_name} has been deployed successfully`,
      deployUrl: `https://${repository.name}.example.com`
    };
  } catch (error) {
    console.error('Error deploying repository:', error);
    return {
      success: false,
      message: 'Failed to deploy repository'
    };
  }
}