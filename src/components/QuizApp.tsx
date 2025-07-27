import React, { useState, useCallback } from 'react';
import { TeamSetup } from './quiz/TeamSetup';
import { QuizGame } from './quiz/QuizGame';
import { Celebration } from './quiz/Celebration';

export type Team = {
  id: number;
  name: string;
  score: number;
  questions: Question[];
  currentQuestionIndex: number;
};

export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  answered?: boolean;
  isCorrect?: boolean;
};

export type GameState = 'setup' | 'playing' | 'celebration';

const QUESTIONS_POOL: Omit<Question, 'id'>[] = [
  {
    question: "What causes air to move?",
    options: ["Uneven heating", "Rain", "Wind", "Clouds"],
    correctAnswer: "Uneven heating"
  },
  {
    question: "Which gas is the major component of air?",
    options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: "Nitrogen"
  },
  {
    question: "The instrument used to measure wind speed is called:",
    options: ["Barometer", "Thermometer", "Anemometer", "Hygrometer"],
    correctAnswer: "Anemometer"
  },
  {
    question: "Cyclones are caused due to:",
    options: ["High pressure zones", "Low pressure zones", "Temperature", "Humidity"],
    correctAnswer: "Low pressure zones"
  },
  {
    question: "High-speed winds and air pressure differences can cause:",
    options: ["Rain", "Snow", "Storms", "Fog"],
    correctAnswer: "Storms"
  },
  {
    question: "Which of these is a safety measure during a cyclone?",
    options: ["Go outside", "Stay indoors", "Climb trees", "Go to beach"],
    correctAnswer: "Stay indoors"
  },
  {
    question: "Which statement is true about wind?",
    options: ["Wind moves from low to high pressure", "Wind is movement of air from high to low pressure", "Wind has no direction", "Wind moves randomly"],
    correctAnswer: "Wind is movement of air from high to low pressure"
  },
  {
    question: "The center of a cyclone is called:",
    options: ["Eye", "Heart", "Core", "Center"],
    correctAnswer: "Eye"
  },
  {
    question: "Cyclone warnings are broadcast through:",
    options: ["Only TV", "Only radio", "Radio, TV & sirens", "Only sirens"],
    correctAnswer: "Radio, TV & sirens"
  },
  {
    question: "Tornadoes are funnel-shaped clouds formed by:",
    options: ["Rain", "Snow", "Thunderstorms", "Sunshine"],
    correctAnswer: "Thunderstorms"
  },
  {
    question: "Which of these is a human-made cyclone warning system?",
    options: ["Natural signs", "Animal behavior", "Cyclone alert system", "Weather changes"],
    correctAnswer: "Cyclone alert system"
  },
  {
    question: "Air moves from:",
    options: ["Low to high pressure", "High to low pressure", "North to south", "East to west"],
    correctAnswer: "High to low pressure"
  },
  {
    question: "The speed of wind increases with:",
    options: ["Lesser pressure difference", "Greater pressure difference", "Temperature", "Humidity"],
    correctAnswer: "Greater pressure difference"
  },
  {
    question: "What is the full form of IMD?",
    options: ["Indian Meteorological Department", "Indian Medical Department", "Indian Military Department", "Indian Mineral Department"],
    correctAnswer: "Indian Meteorological Department"
  },
  {
    question: "The air above land heats up faster than air above:",
    options: ["Mountains", "Water", "Forests", "Cities"],
    correctAnswer: "Water"
  },
  {
    question: "Which of these is not a cyclone-prone state in India?",
    options: ["Odisha", "West Bengal", "Rajasthan", "Tamil Nadu"],
    correctAnswer: "Rajasthan"
  },
  {
    question: "Warm air is:",
    options: ["Heavier", "Lighter", "Same weight", "Denser"],
    correctAnswer: "Lighter"
  },
  {
    question: "What to avoid during a cyclone if you're outside?",
    options: ["Stay under trees", "Find shelter", "Go indoors", "Call for help"],
    correctAnswer: "Stay under trees"
  },
  {
    question: "Sea breeze occurs during:",
    options: ["Night", "Daytime", "Evening", "Morning only"],
    correctAnswer: "Daytime"
  },
  {
    question: "Land breeze occurs during:",
    options: ["Daytime", "Night", "Afternoon", "Morning only"],
    correctAnswer: "Night"
  },
  {
    question: "Which cloud formation leads to thunderstorms and heavy rain?",
    options: ["Cirrus", "Stratus", "Cumulonimbus", "Nimbus"],
    correctAnswer: "Cumulonimbus"
  },
  {
    question: "Which type of cyclone hits coastal areas in India?",
    options: ["Arctic cyclones", "Tropical cyclones", "Desert cyclones", "Mountain cyclones"],
    correctAnswer: "Tropical cyclones"
  },
  {
    question: "Evacuation during a cyclone is done to:",
    options: ["Save property", "Save lives", "Save animals", "Save crops"],
    correctAnswer: "Save lives"
  },
  {
    question: "Which side of the cyclone eye is most dangerous?",
    options: ["Left-front", "Front-right", "Back-left", "Back-right"],
    correctAnswer: "Front-right"
  }
];

const QuizApp: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [teams, setTeams] = useState<Team[]>([]);

  const assignRandomQuestions = useCallback((teamNames: string[]): Team[] => {
    const shuffledQuestions = [...QUESTIONS_POOL].sort(() => Math.random() - 0.5);
    
    return teamNames.map((name, index) => ({
      id: index + 1,
      name,
      score: 0,
      currentQuestionIndex: 0,
      questions: shuffledQuestions
        .slice(index * 3, (index * 3) + 3)
        .map((q, qIndex) => ({
          ...q,
          id: qIndex + 1
        }))
    }));
  }, []);

  const handleStartQuiz = useCallback((teamNames: string[]) => {
    const teamsWithQuestions = assignRandomQuestions(teamNames);
    setTeams(teamsWithQuestions);
    setGameState('playing');
  }, [assignRandomQuestions]);

  const handleQuizComplete = useCallback(() => {
    setGameState('celebration');
  }, []);

  const handleRestart = useCallback(() => {
    setGameState('setup');
    setTeams([]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {gameState === 'setup' && (
        <TeamSetup onStartQuiz={handleStartQuiz} />
      )}
      
      {gameState === 'playing' && (
        <QuizGame 
          teams={teams} 
          setTeams={setTeams}
          onComplete={handleQuizComplete}
        />
      )}
      
      {gameState === 'celebration' && (
        <Celebration 
          teams={teams}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default QuizApp;