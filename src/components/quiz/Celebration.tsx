import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Team } from '../QuizApp';

interface CelebrationProps {
  teams: Team[];
  onRestart: () => void;
}

interface ConfettiPiece {
  id: number;
  color: string;
  left: number;
  delay: number;
  size: number;
}

export const Celebration: React.FC<CelebrationProps> = ({ teams, onRestart }) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  // Sort teams by score to determine winner
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];
  const isMultipleWinners = sortedTeams.filter(team => team.score === winner.score).length > 1;

  useEffect(() => {
    // Generate confetti
    const pieces: ConfettiPiece[] = [];
    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
    
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100,
        delay: Math.random() * 3,
        size: Math.random() * 8 + 4
      });
    }
    
    setConfetti(pieces);
  }, []);

  const getScorePercentage = (score: number) => {
    const maxScore = Math.max(...teams.map(team => team.score));
    return maxScore > 0 ? (score / maxScore) * 100 : 0;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Confetti Animation */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute animate-bounce-in"
            style={{
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}s`,
              animationDuration: '3s',
              animationName: 'confetti'
            }}
          >
            <div
              className="rounded-full"
              style={{
                backgroundColor: piece.color,
                width: `${piece.size}px`,
                height: `${piece.size}px`
              }}
            />
          </div>
        ))}
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 relative z-20">
        <Card className="w-full max-w-4xl shadow-card animate-fade-in">
          <CardHeader className="text-center space-y-4">
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="text-4xl md:text-6xl font-bold gradient-success bg-clip-text text-transparent">
              {isMultipleWinners ? 'It\'s a Tie!' : 'Congratulations!'}
            </CardTitle>
            
            {isMultipleWinners ? (
              <div className="space-y-2">
                <p className="text-2xl text-foreground">
                  Multiple teams scored {winner.score} points!
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {sortedTeams
                    .filter(team => team.score === winner.score)
                    .map(team => (
                      <Badge key={team.id} className="gradient-success text-lg px-4 py-2">
                        🏆 {team.name}
                      </Badge>
                    ))
                  }
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-2xl text-foreground">
                  🏆 <span className="text-primary font-bold">{winner.name}</span> wins!
                </p>
                <p className="text-lg text-muted-foreground">
                  With a perfect score of {winner.score} out of 3!
                </p>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Final Leaderboard */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-center gradient-primary bg-clip-text text-transparent">
                Final Leaderboard
              </h3>
              
              <div className="space-y-3">
                {sortedTeams.map((team, index) => (
                  <div
                    key={team.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                      index === 0 && !isMultipleWinners
                        ? 'gradient-success shadow-success'
                        : index <= 2 && team.score === winner.score
                        ? 'gradient-success shadow-success'
                        : 'bg-card border border-border'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📊'}
                      </span>
                      <div>
                        <div className="font-bold text-lg">{team.name}</div>
                        <div className="text-sm opacity-75">
                          {team.score} correct out of 3 questions
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold">{team.score}</div>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-primary transition-all duration-1000"
                          style={{ width: `${getScorePercentage(team.score)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiz Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{teams.length}</div>
                <div className="text-sm text-muted-foreground">Teams Participated</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {teams.reduce((sum, team) => sum + team.questions.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {teams.reduce((sum, team) => sum + team.score, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onRestart}
                size="lg"
                className="gradient-primary text-lg px-8 py-3 shadow-primary hover:shadow-lg transition-all duration-300"
              >
                🔄 Play Again
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>🌪️ Thanks for playing the Winds & Storms Quiz!</p>
              <p>Hope you learned something new about weather and cyclones.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};