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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-card animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-4xl md:text-6xl font-bold gradient-primary bg-clip-text text-transparent">
            🌪️ Winds & Storms Quiz
          </CardTitle>
          <p className="text-xl text-muted-foreground">
            Enter your team names to start the ultimate weather quiz!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Team {index + 1}
                </label>
                <Input
                  placeholder={`Enter team ${index + 1} name...`}
                  value={teamNames[index]}
                  onChange={(e) => handleTeamNameChange(index, e.target.value)}
                  className="transition-all duration-200 focus:shadow-primary"
                />
              </div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {validTeamCount === 0 && "Enter at least 2 team names to start"}
              {validTeamCount === 1 && "Enter one more team name to start"}
              {validTeamCount >= 2 && `${validTeamCount} teams ready to play!`}
            </p>
            
            <Button
              onClick={handleStartQuiz}
              disabled={validTeamCount < 2}
              size="lg"
              className="gradient-primary text-lg px-8 py-3 shadow-primary hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🚀 Start Quiz
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>📝 Each team gets 3 random questions about winds, storms & cyclones</p>
            <p>🏆 Correct answers earn points for the leaderboard</p>
            <p>🎉 Winner gets a special celebration!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};