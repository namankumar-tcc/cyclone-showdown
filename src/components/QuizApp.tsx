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
    question: "How do weather reports help in predicting cyclone formation?",
    options: [
      "By measuring soil temperature",
      "By monitoring wind speed and air pressure patterns",
      "By observing the color of clouds",
      "By tracking the movement of animals"
    ],
    correctAnswer: "By monitoring wind speed and air pressure patterns"
  },
  {
    question: "Which factor in a weather report is crucial in identifying the development of a cyclone?",
    options: [
      "Wind direction change",
      "Decrease in air pressure",
      "Cloud color",
      "Temperature of the ground"
    ],
    correctAnswer: "Decrease in air pressure"
  },
  {
    question: "How does a cyclone form in the atmosphere according to weather reports?",
    options: [
      "When high-pressure air sinks into the Earth’s surface",
      "When cold, dry air combines with warm, moist air",
      "When warm, moist air rises and cools, creating a low-pressure system",
      "When clouds freeze at the ground level"
    ],
    correctAnswer: "When warm, moist air rises and cools, creating a low-pressure system"
  },
  {
    question: "What is the primary factor that influences the formation of local winds?",
    options: [
      "The moon’s gravitational pull",
      "Differences in air pressure caused by temperature variations",
      "The Earth's rotation speed",
      "The presence of clouds in the atmosphere"
    ],
    correctAnswer: "Differences in air pressure caused by temperature variations"
  },
  {
    question: "How does the wind speed change as a cyclone intensifies?",
    options: [
      "It decreases as the cyclone reaches land",
      "It remains constant regardless of the cyclone's development",
      "It increases due to the stronger low-pressure system",
      "It fluctuates randomly based on temperature"
    ],
    correctAnswer: "It increases due to the stronger low-pressure system"
  },
  {
    question: "What is the role of wind speed in the intensity of a cyclone?",
    options: [
      "High wind speeds decrease the intensity of cyclones",
      "Low wind speeds cause cyclones to dissipate quickly",
      "High wind speeds intensify the cyclone’s impact, causing more destruction",
      "Wind speed has no role in the intensity of cyclones"
    ],
    correctAnswer: "High wind speeds intensify the cyclone’s impact, causing more destruction"
  },
  {
    question: "How does air pressure contribute to the formation of cyclones?",
    options: [
      "Low air pressure causes warm, moist air to rise, forming a cyclone",
      "High air pressure pushes air upwards, cooling the atmosphere",
      "Low air pressure causes air to condense into clouds",
      "Air pressure has no role in cyclone formation"
    ],
    correctAnswer: "Low air pressure causes warm, moist air to rise, forming a cyclone"
  },
  {
    question: "What happens to air pressure at the center of a cyclone?",
    options: [
      "It increases drastically",
      "It remains the same as the surrounding area",
      "It decreases, creating the 'eye' of the storm",
      "It fluctuates between high and low"
    ],
    correctAnswer: "It decreases, creating the 'eye' of the storm"
  },
  {
    question: "Which statement is true about air pressure and cyclone formation?",
    options: [
      "High pressure at the center prevents cyclone formation",
      "Low pressure at the center allows cyclonic winds to form",
      "Air pressure is not important in cyclone formation",
      "Air pressure only affects the direction of winds, not cyclone intensity"
    ],
    correctAnswer: "Low pressure at the center allows cyclonic winds to form"
  },
  {
    question: "How does wind speed change as a cyclone moves over land?",
    options: [
      "It decreases rapidly because of the loss of moisture",
      "It stays constant regardless of the location",
      "It increases due to higher temperatures on land",
      "It fluctuates due to changes in the Earth's rotation speed"
    ],
    correctAnswer: "It decreases rapidly because of the loss of moisture"
  },
  {
    question: "What is the role of wind speed in the formation of cyclones over oceans?",
    options: [
      "Wind speed has no role in oceanic cyclone formation",
      "High wind speeds increase evaporation, which feeds the cyclone",
      "Low wind speeds prevent cyclones from forming",
      "Wind speed causes the ocean to cool, weakening cyclones"
    ],
    correctAnswer: "High wind speeds increase evaporation, which feeds the cyclone"
  },
  {
    question: "What happens during the formative stage of a cyclone?",
    options: [
      "The cyclone’s intensity decreases rapidly",
      "Warm air rises and begins to cool, creating a low-pressure system",
      "Air pressure remains constant, and winds die down",
      "The cyclone reaches its peak and begins to move toward land"
    ],
    correctAnswer: "Warm air rises and begins to cool, creating a low-pressure system"
  },
  {
    question: "How does the intensity of a cyclone change during its mature stage?",
    options: [
      "It loses strength as it moves away from warm waters",
      "It reaches its maximum strength with high winds and low pressure",
      "It becomes weaker, causing fewer damages",
      "It stabilizes and remains consistent in intensity"
    ],
    correctAnswer: "It reaches its maximum strength with high winds and low pressure"
  },
  {
    question: "What is the 'eye' of a cyclone, and how does it form?",
    options: [
      "It is a high-pressure zone where the winds are calm, forming when warm air condenses",
      "It is a low-pressure zone with very strong winds, forming from the rising warm air",
      "It is the center of the cyclone with no wind and low temperatures",
      "It forms when water vapor in the air freezes at high altitudes"
    ],
    correctAnswer: "It is a high-pressure zone where the winds are calm, forming when warm air condenses"
  },
  {
    question: "During the mature stage of a cyclone, what causes the high winds and heavy rainfall?",
    options: [
      "Warm air in the center cooling down",
      "The rapid rising of air and condensation of water vapor",
      "The weakening of the cyclone’s central pressure",
      "The cooling of ocean waters that feeds the cyclone’s energy"
    ],
    correctAnswer: "The rapid rising of air and condensation of water vapor"
  },
  {
    question: "Which of the following actions is NOT recommended during a cyclone?",
    options: [
      "Taking shelter in a strong, well-built structure",
      "Staying away from windows and glass areas",
      "Evacuating to higher ground if you live near a coastline",
      "Standing outside to observe the storm’s formation"
    ],
    correctAnswer: "Standing outside to observe the storm’s formation"
  },
  {
    question: "What is the first thing to do when a cyclone warning is issued?",
    options: [
      "Check the temperature outside",
      "Monitor the speed of the wind",
      "Secure windows and doors and prepare for evacuation",
      "Start cooking food for the storm duration"
    ],
    correctAnswer: "Secure windows and doors and prepare for evacuation"
  },
  {
    question: "Why is it dangerous to stay near the coastline during a cyclone?",
    options: [
      "High winds cause heavy rainfall and flooding in coastal areas",
      "Coastal areas have less wind speed, making them safe",
      "The cyclone loses strength near the coast",
      "Coastal areas are unaffected by cyclones"
    ],
    correctAnswer: "High winds cause heavy rainfall and flooding in coastal areas"
  },
  {
    question: "How does wind pressure change during the formation of a cyclone?",
    options: [
      "Wind pressure stays constant during the formation",
      "Wind pressure increases at the center of the cyclone",
      "Wind pressure decreases, which leads to more intense winds",
      "Wind pressure is irrelevant to cyclone formation"
    ],
    correctAnswer: "Wind pressure decreases, which leads to more intense winds"
  },
  {
    question: "In a cyclone, which of the following typically happens to air pressure and wind speed?",
    options: [
      "Both air pressure and wind speed increase",
      "Air pressure decreases and wind speed increases",
      "Air pressure increases and wind speed decreases",
      "Both air pressure and wind speed decrease"
    ],
    correctAnswer: "Air pressure decreases and wind speed increases"
  },
  {
    question: "Explain the role of water vapor in increasing the intensity of wind and air pressure in a cyclone's formative stage.",
    options: ["Water vapor has no effect", "Condensation releases latent heat reducing air density and strengthening winds", "Water vapor only creates humidity", "Water vapor prevents wind formation"],
    correctAnswer: "Condensation releases latent heat reducing air density and strengthening winds"
  },
  {
    question: "Using thermodynamics, why does temperature inside a cyclone decrease despite warm, moist air presence?",
    options: ["Temperature always increases", "Rising air expands and cools following thermodynamic principles", "Chemical reactions cool the air", "Pressure has no effect on temperature"],
    correctAnswer: "Rising air expands and cools following thermodynamic principles"
  },
  {
    question: "How do chemical interactions between warm, moist air and cold air contribute to storm development?",
    options: ["No chemical interactions occur", "Condensation releases energy fueling storm development", "Only temperature differences matter", "Chemical reactions prevent storms"],
    correctAnswer: "Condensation releases energy fueling storm development"
  },
  {
    question: "How do temperature and humidity levels affect chemical reactions in cloud formation during cyclone maturity?",
    options: ["No chemical reactions in clouds", "High humidity and temperature differences accelerate condensation reactions", "Only physical processes occur", "Chemical reactions slow down cyclones"],
    correctAnswer: "High humidity and temperature differences accelerate condensation reactions"
  },
  {
    question: "What chemical process releases energy in the eye of a cyclone, influencing wind speed and direction?",
    options: ["No energy release occurs", "Latent heat release during condensation warms air and strengthens the cyclone", "Only mechanical processes involved", "Chemical reactions weaken cyclones"],
    correctAnswer: "Latent heat release during condensation warms air and strengthens the cyclone"
  },
  {
    question: "Discuss the chemical processes in structural destruction during cyclones related to wind and pressure.",
    options: ["Only physical forces involved", "Pressure differences and wind forces break chemical bonds in materials", "No chemical changes occur", "Chemical processes strengthen structures"],
    correctAnswer: "Pressure differences and wind forces break chemical bonds in materials"
  },
  {
    question: "In soil chemistry context, how do moisture content and temperature influence air pressure and wind speed?",
    options: ["Soil has no atmospheric effect", "Soil moisture affects evaporation creating pressure differences and local winds", "Only soil temperature matters", "Soil chemistry prevents wind formation"],
    correctAnswer: "Soil moisture affects evaporation creating pressure differences and local winds"
  },
  {
    question: "How do chemical reactions in the atmosphere cause temperature decrease at higher altitudes?",
    options: ["No chemical reactions at altitude", "Reduced condensation reactions and expansion cooling at higher altitudes", "Chemical reactions increase temperature", "Altitude doesn't affect chemistry"],
    correctAnswer: "Reduced condensation reactions and expansion cooling at higher altitudes"
  },
  {
    question: "Calculate the impact of varying wind speeds on water evaporation rate during cyclone formation.",
    options: ["Wind speed doesn't affect evaporation", "Higher wind speeds increase evaporation by removing water vapor", "Wind speeds decrease evaporation", "Only temperature affects evaporation"],
    correctAnswer: "Higher wind speeds increase evaporation by removing water vapor"
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
