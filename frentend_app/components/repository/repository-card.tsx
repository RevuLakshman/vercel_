'use client';

import { useState } from 'react';
import { Repository, deployRepository } from '@/lib/github';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  GitFork, 
  AlertCircle, 
  Clock, 
  Lock, 
  Globe,
  Rocket
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface RepositoryCardProps {
  repository: Repository;
  onSelect: (repository: Repository) => void;
  isSelected: boolean;
}

export function RepositoryCard({ repository, onSelect, isSelected }: RepositoryCardProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const result = await deployRepository(session?.accessToken, repository);
      
      if (result.success) {
        toast({
          title: "Deployment Successful",
          description: result.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Deployment Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Deployment Error",
        description: "There was an error deploying your repository",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card 
        className={`h-full transition-colors ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => onSelect(repository)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold line-clamp-1">{repository.name}</CardTitle>
            <Badge variant={repository.private ? "outline" : "secondary"}>
              {repository.private ? (
                <><Lock className="h-3 w-3 mr-1" /> Private</>
              ) : (
                <><Globe className="h-3 w-3 mr-1" /> Public</>
              )}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2 min-h-[40px]">
            {repository.description || "No description provided"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-wrap gap-2 mb-3">
            {repository.language && (
              <Badge variant="outline" className="bg-secondary/30">
                {repository.language}
              </Badge>
            )}
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 mr-1" />
              <span>{repository.stargazers_count}</span>
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <GitFork className="h-3.5 w-3.5 mr-1" />
              <span>{repository.forks_count}</span>
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              <span>{repository.open_issues_count}</span>
            </div>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>Updated {formatDistanceToNow(new Date(repository.updated_at))} ago</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleDeploy();
            }}
            disabled={isDeploying}
          >
            {isDeploying ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Deploying...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                Deploy
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}