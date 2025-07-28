import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TeamSetupProps {
  onStartQuiz: (teamNames: string[]) => void;
}

export const TeamSetup: React.FC<TeamSetupProps> = ({ onStartQuiz }) => {
  const [teamNames, setTeamNames] = useState<string[]>(Array(8).fill(''));

  const handleTeamNameChange = (index: number, name: string) => {
    const newTeamNames = [...teamNames];
    newTeamNames[index] = name;
    setTeamNames(newTeamNames);
  };

  const handleStartQuiz = () => {
    const validTeamNames = teamNames.filter(name => name.trim() !== '');
    if (validTeamNames.length >= 2) {
      onStartQuiz(validTeamNames);
    }
  };

  const validTeamCount = teamNames.filter(name => name.trim() !== '').length;

  const teamSymbols = ['🧪', '⚗️', '🔬', '🌪️', '⛈️', '🌊', '💨', '❄️'];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full animate-pulse opacity-80 blur-sm"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-accent/40 to-primary/40 rounded-full animate-bounce opacity-60 blur-sm"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-secondary/30 to-accent/30 rounded-full animate-pulse opacity-50 blur-sm"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-primary/40 to-secondary/40 rounded-full animate-bounce opacity-70 blur-sm"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full animate-pulse opacity-40 blur-lg transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-16 right-1/4 w-20 h-20 bg-gradient-to-r from-secondary/40 to-accent/40 rounded-full animate-bounce opacity-60 blur-sm"></div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-4xl shadow-2xl animate-fade-in border-2 border-primary/20 backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="space-y-4">
              <CardTitle className="text-5xl md:text-7xl font-bold gradient-primary bg-clip-text text-transparent animate-pulse">
                ⚗️ Chemistry Quiz Challenge
              </CardTitle>
              <div className="flex justify-center space-x-4 text-3xl animate-bounce">
                <span>🌪️</span>
                <span>🌊</span>
                <span>⛈️</span>
                <span>🔬</span>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in">
              Explore the <span className="text-primary font-semibold">chemical secrets</span> behind weather, climate & storms!
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center space-x-2">
                    <span className="text-2xl">{teamSymbols[index]}</span>
                    <span>Team {index + 1}</span>
                  </label>
                  <Input
                    placeholder={`Enter team ${index + 1} name...`}
                    value={teamNames[index]}
                    onChange={(e) => handleTeamNameChange(index, e.target.value)}
                    className="h-14 text-lg transition-all duration-300 focus:shadow-lg focus:shadow-primary/25 border-2 hover:border-primary/30 focus:border-primary/50 bg-background/80 backdrop-blur-sm font-medium"
                  />
                </div>
              ))}
            </div>

            <div className="text-center space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-lg font-medium">
                  {validTeamCount === 0 && "🎯 Enter at least 2 team names to start the challenge"}
                  {validTeamCount === 1 && "🔬 Enter one more team to begin the experiment"}
                  {validTeamCount >= 2 && `⚡ ${validTeamCount} teams ready for the chemistry challenge!`}
                </p>
              </div>
              
              <Button
                onClick={handleStartQuiz}
                disabled={validTeamCount < 2}
                size="lg"
                className="gradient-primary text-xl px-12 py-4 shadow-2xl hover:shadow-primary/25 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold"
              >
                {validTeamCount >= 2 ? "🚀 Launch Quiz" : "⏳ Waiting for Teams"}
              </Button>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 space-y-4 backdrop-blur-sm border border-primary/20">
              <h3 className="text-center text-lg font-semibold text-primary mb-4">🔬 What Awaits You</h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl">⚗️</div>
                  <p className="text-sm font-medium">Chemistry & Weather</p>
                  <p className="text-xs text-muted-foreground">Explore molecular interactions in atmospheric phenomena</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl">🏆</div>
                  <p className="text-sm font-medium">3 Questions Per Team</p>
                  <p className="text-xs text-muted-foreground">Test your knowledge of chemical processes</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl">🎉</div>
                  <p className="text-sm font-medium">Victory Celebration</p>
                  <p className="text-xs text-muted-foreground">Winners get confetti & congratulations!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};