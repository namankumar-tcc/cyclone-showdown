import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { type Team, type Question } from '../QuizApp';

interface QuizGameProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  onComplete: () => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ teams, setTeams, onComplete }) => {
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentTeam = teams[currentTeamIndex];
  const currentQuestion = currentTeam?.questions?.[currentTeam.currentQuestionIndex];
  const totalQuestions = teams.reduce((sum, team) => sum + team.questions.length, 0);
  const answeredQuestions = teams.reduce((sum, team) => 
    sum + team.questions.filter(q => q.answered).length, 0
  );

  // If current question is undefined, find next team with questions
  useEffect(() => {
    if (!currentQuestion && teams.length > 0) {
      let nextTeamIndex = currentTeamIndex;
      let attempts = 0;
      
      while (attempts < teams.length) {
        const team = teams[nextTeamIndex];
        if (team.currentQuestionIndex < team.questions.length) {
          setCurrentTeamIndex(nextTeamIndex);
          break;
        }
        nextTeamIndex = (nextTeamIndex + 1) % teams.length;
        attempts++;
      }
      
      // If no team has questions left, complete the quiz
      if (attempts === teams.length) {
        onComplete();
      }
    }
  }, [currentQuestion, currentTeamIndex, teams, onComplete]);

  // Don't render if no current question
  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    // Update team data
    setTeams(prevTeams => {
      const newTeams = [...prevTeams];
      const teamIndex = currentTeamIndex;
      const questionIndex = newTeams[teamIndex].currentQuestionIndex;
      
      // Mark question as answered
      newTeams[teamIndex].questions[questionIndex] = {
        ...newTeams[teamIndex].questions[questionIndex],
        answered: true,
        isCorrect: correct
      };

      // Update score
      if (correct) {
        newTeams[teamIndex].score += 1;
      }

      return newTeams;
    });
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer('');

    // Update current team's question index
    setTeams(prevTeams => {
      const newTeams = [...prevTeams];
      newTeams[currentTeamIndex].currentQuestionIndex += 1;
      return newTeams;
    });

    // Move to next team
    const nextTeamIndex = (currentTeamIndex + 1) % teams.length;
    setCurrentTeamIndex(nextTeamIndex);

    // Check if quiz is complete (all teams finished all questions)
    const allTeamsFinished = teams.every(team => 
      team.currentQuestionIndex >= team.questions.length - 1
    );
    
    if (allTeamsFinished && nextTeamIndex === 0) {
      onComplete();
    }
  };

  const handleSkipQuestion = () => {
    // Mark question as answered but incorrect
    setTeams(prevTeams => {
      const newTeams = [...prevTeams];
      const teamIndex = currentTeamIndex;
      const questionIndex = newTeams[teamIndex].currentQuestionIndex;
      
      newTeams[teamIndex].questions[questionIndex] = {
        ...newTeams[teamIndex].questions[questionIndex],
        answered: true,
        isCorrect: false
      };

      return newTeams;
    });

    handleNextQuestion();
  };

  const getAnswerButtonClass = (option: string) => {
    const baseClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-300 min-h-[60px] flex items-center";
    
    if (!showResult) {
      if (selectedAnswer === option) {
        return `${baseClass} border-primary bg-primary/20 shadow-primary`;
      }
      return `${baseClass} border-border hover:border-primary/50 hover:bg-primary/10`;
    }

    // Show results
    if (option === currentQuestion.correctAnswer) {
      return `${baseClass} border-success bg-success/20 shadow-success`;
    }
    if (selectedAnswer === option && !isCorrect) {
      return `${baseClass} border-destructive bg-destructive/20 shadow-error`;
    }
    return `${baseClass} border-muted bg-muted/10 opacity-60`;
  };

  // Sort teams by score for leaderboard
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header with progress */}
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            🌪️ Winds & Storms Quiz
          </h1>
          <Badge variant="secondary" className="text-sm">
            Question {answeredQuestions + 1} of {totalQuestions}
          </Badge>
        </div>
        
        <Progress 
          value={(answeredQuestions / totalQuestions) * 100} 
          className="h-2"
        />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Question Card */}
        <div className="lg:col-span-2">
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  Team: <span className="text-primary">{currentTeam.name}</span>
                </CardTitle>
                <Badge className="gradient-primary">
                  Question {currentTeam.currentQuestionIndex + 1}/3
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-lg font-medium bg-muted p-4 rounded-lg">
                {currentQuestion.question}
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showResult}
                    className={getAnswerButtonClass(option)}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </span>
                  </button>
                ))}
              </div>

              {showResult && (
                <div className={`p-4 rounded-lg animate-bounce-in ${isCorrect ? 'bg-success/20 border border-success' : 'bg-destructive/20 border border-destructive'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{isCorrect ? '🎉' : '❌'}</span>
                    <span className="font-medium">
                      {isCorrect ? 'Correct! Well done!' : `Wrong! The correct answer is: ${currentQuestion.correctAnswer}`}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                {!showResult && (
                  <Button
                    onClick={handleSkipQuestion}
                    variant="outline"
                    className="px-6"
                  >
                    Skip Question
                  </Button>
                )}
                
                <div className="flex gap-2 ml-auto">
                  {!showResult ? (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer}
                      className="gradient-primary shadow-primary px-6"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      className="gradient-primary shadow-primary px-6"
                    >
                      Next Team
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <div>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                🏆 Leaderboard
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {sortedTeams.map((team, index) => (
                  <div
                    key={team.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      team.id === currentTeam.id 
                        ? 'bg-primary/20 border border-primary' 
                        : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📊'}
                      </span>
                      <span className="font-medium">{team.name}</span>
                    </div>
                    <Badge variant={index === 0 ? 'default' : 'secondary'}>
                      {team.score}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};