'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { GitHubSignIn } from '@/components/auth/github-signin';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRight, Github, Rocket } from 'lucide-react';

export function HeroSection() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center px-4 py-20 text-center space-y-10"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div className="space-y-4" variants={item}>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Deploy Your <span className="text-primary">GitHub</span> Repositories
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect to your GitHub account, select a repository, and deploy with a single click.
        </p>
      </motion.div>

      <motion.div className="flex flex-col space-y-4 w-full max-w-md" variants={item}>
        {isLoading ? (
          <Button disabled size="lg" className="w-full">
            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Loading...
          </Button>
        ) : session ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Signed in as <strong>{session.user?.name}</strong>
            </p>
            <Button asChild size="lg">
              <Link href="/dashboard">
                <Rocket className="mr-2 h-5 w-5" />
                Go to Dashboard
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <GitHubSignIn />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Why connect with GitHub?
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 text-left text-sm">
              <div className="flex items-start space-x-3">
                <Github className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Access Your Repositories</h3>
                  <p className="text-muted-foreground">
                    View and select from all your public and private repositories
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Rocket className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">One-Click Deployment</h3>
                  <p className="text-muted-foreground">
                    Deploy your code to production with a single click
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}