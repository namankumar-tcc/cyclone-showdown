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
    question: "Explain how the composition of the Earth's atmosphere affects the formation of cyclones. What role do gases like carbon dioxide play in this process?",
    options: ["CO2 blocks cyclone formation", "CO2 creates greenhouse effect leading to warming and cyclone formation", "CO2 has no effect on cyclones", "CO2 only affects wind direction"],
    correctAnswer: "CO2 creates greenhouse effect leading to warming and cyclone formation"
  },
  {
    question: "How does the greenhouse effect relate to the chemical composition of the atmosphere and the formation of global winds?",
    options: ["It cools the Earth reducing winds", "It creates uneven heating patterns driving wind formation", "It only affects ocean currents", "It prevents wind formation"],
    correctAnswer: "It creates uneven heating patterns driving wind formation"
  },
  {
    question: "Discuss how the interaction between nitrogen and oxygen molecules in the atmosphere influences the air pressure needed for cyclonic activity.",
    options: ["They prevent pressure changes", "Their heat interactions cause pressure variations needed for cyclones", "They only affect temperature", "They create constant pressure"],
    correctAnswer: "Their heat interactions cause pressure variations needed for cyclones"
  },
  {
    question: "What chemical reactions take place when water vapor condenses in clouds during the cyclone formation process?",
    options: ["Hydrogen bonds break releasing cold", "Hydrogen bonds form releasing latent heat", "No chemical reactions occur", "Only physical changes happen"],
    correctAnswer: "Hydrogen bonds form releasing latent heat"
  },
  {
    question: "How does the heat from the sun cause changes in atmospheric pressure, and what is the chemical basis for this change?",
    options: ["Sun only affects temperature", "Heating causes water evaporation and air rising, reducing surface pressure", "Sun creates constant pressure", "Sun prevents pressure changes"],
    correctAnswer: "Heating causes water evaporation and air rising, reducing surface pressure"
  },
  {
    question: "Using the ideal gas law, what happens to air pressure as a cyclone moves through a region with increasing humidity?",
    options: ["Pressure increases significantly", "Pressure decreases due to water vapor displacing air molecules", "Pressure remains constant", "Humidity doesn't affect pressure"],
    correctAnswer: "Pressure decreases due to water vapor displacing air molecules"
  },
  {
    question: "What chemical processes occur when a cyclone causes the breakdown of minerals and organic material in coastal areas?",
    options: ["Only physical erosion occurs", "Hydrolysis and salt water reactions break down minerals", "No chemical changes happen", "Only temperature changes occur"],
    correctAnswer: "Hydrolysis and salt water reactions break down minerals"
  },
  {
    question: "Explain the role of sulfur dioxide (SO2) emissions in the formation of acid rain and how this affects local wind patterns.",
    options: ["SO2 has no effect on weather", "SO2 forms sulfuric acid causing cooling and altering wind patterns", "SO2 only affects air quality", "SO2 prevents rain formation"],
    correctAnswer: "SO2 forms sulfuric acid causing cooling and altering wind patterns"
  },
  {
    question: "How does the chemical composition of water in the atmosphere contribute to the formation of clouds and the movement of local winds?",
    options: ["Water vapor only creates humidity", "Water vapor condensation releases heat driving wind patterns", "Water has no effect on winds", "Water only creates precipitation"],
    correctAnswer: "Water vapor condensation releases heat driving wind patterns"
  },
  {
    question: "How do temperature variations in different layers of the atmosphere contribute to cyclone formation?",
    options: ["Temperature has no effect", "Temperature differences create density and pressure variations driving cyclones", "Only surface temperature matters", "Temperature only affects visibility"],
    correctAnswer: "Temperature differences create density and pressure variations driving cyclones"
  },
  {
    question: "How does the chemical composition of seawater affect the development of cyclones?",
    options: ["Seawater composition is irrelevant", "Salt content affects evaporation rates and humidity levels", "Only water temperature matters", "Chemical composition prevents cyclones"],
    correctAnswer: "Salt content affects evaporation rates and humidity levels"
  },
  {
    question: "Discuss the chemical basis for the formation of the eye of a cyclone and the process of temperature stabilization.",
    options: ["No chemical processes involved", "Rapid condensation releases latent heat stabilizing the eye temperature", "Only pressure changes create the eye", "Chemical reactions prevent eye formation"],
    correctAnswer: "Rapid condensation releases latent heat stabilizing the eye temperature"
  },
  {
    question: "What role do carbon compounds, such as methane, play in altering wind patterns and cyclonic activity?",
    options: ["Methane has no atmospheric effect", "Methane enhances greenhouse effect intensifying cyclonic activity", "Methane only affects air quality", "Methane prevents wind formation"],
    correctAnswer: "Methane enhances greenhouse effect intensifying cyclonic activity"
  },
  {
    question: "Describe the chemical processes that contribute to the evaporation of seawater during cyclone formation.",
    options: ["Only temperature causes evaporation", "Heat breaks hydrogen bonds converting liquid to vapor", "No chemical processes involved", "Salt prevents evaporation"],
    correctAnswer: "Heat breaks hydrogen bonds converting liquid to vapor"
  },
  {
    question: "How do pollutants like nitrogen oxides affect wind patterns and the intensity of cyclones?",
    options: ["Pollutants have no effect", "NOx creates ozone increasing heat and disrupting wind patterns", "Pollutants only affect air quality", "NOx prevents cyclone formation"],
    correctAnswer: "NOx creates ozone increasing heat and disrupting wind patterns"
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