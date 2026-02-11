import React, { useState } from "react";
import styled from "styled-components";
import {
  Section,
  Heading,
  Text,
  FlexContainer,
  NeumorphicContainer,
  NeumorphicButton,
} from "../styles/StyledComponents";
import QuantumSimulation from "../components/interactive/QuantumSimulation";
import { useTheme } from "../context/ThemeContext";

// Page container
const PageContainer = styled.div`
  padding: ${(props) => props.theme.spacing.lg} 0;
`;

// Intro section
const IntroSection = styled(Section)`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

// Colored span for highlighting
const ColoredSpan = styled.span`
  color: ${(props) => props.theme.colors.primary};
`;

// Game elements
const GameHeader = styled(NeumorphicContainer)`
  padding: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary}10,
    ${(props) => props.theme.colors.secondary}10
  );
`;

const StatsContainer = styled(FlexContainer)`
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${(props) => props.theme.spacing.md};
  }
`;

const StatCard = styled(NeumorphicContainer)`
  padding: ${(props) => props.theme.spacing.md};
  text-align: center;
  min-width: 120px;
  background-color: ${(props) => props.theme.colors.card};
`;

const StatValue = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.secondary};
`;

const ChallengeSection = styled(NeumorphicContainer)`
  padding: ${(props) => props.theme.spacing.xl};
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const ChallengeCard = styled(NeumorphicContainer)`
  padding: ${(props) => props.theme.spacing.lg};
  margin: ${(props) => props.theme.spacing.md};
  cursor: pointer;
  transition: all ${(props) => props.theme.animations.normal};
  border: 2px solid
    ${(props) => (props.$active ? props.theme.colors.primary : "transparent")};
  background-color: ${(props) =>
    props.$completed
      ? props.theme.colors.success + "15"
      : props.$active
      ? props.theme.colors.primary + "10"
      : props.theme.colors.card};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${(props) => props.theme.shadows.large};
  }
`;

const ChallengeDifficulty = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const DifficultyDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: ${(props) => props.theme.spacing.xs};
  background-color: ${(props) => {
    switch (props.level) {
      case "easy":
        return props.theme.colors.success;
      case "medium":
        return props.theme.colors.warning;
      case "hard":
        return props.theme.colors.danger;
      default:
        return props.theme.colors.secondary;
    }
  }};
`;

const AchievementBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  background-color: ${(props) => props.theme.colors.success}20;
  color: ${(props) => props.theme.colors.success};
  border-radius: ${(props) => props.theme.borderRadius.small};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.semiBold};
  margin: ${(props) => props.theme.spacing.xs};

  i {
    margin-right: ${(props) => props.theme.spacing.xs};
  }
`;

const CelebrationMessage = styled(NeumorphicContainer)`
  padding: ${(props) => props.theme.spacing.lg};
  text-align: center;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.success}20,
    ${(props) => props.theme.colors.primary}20
  );
  border: 2px solid ${(props) => props.theme.colors.success};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  animation: celebration 0.5s ease-in-out;

  @keyframes celebration {
    0% {
      transform: scale(0.9);
      opacity: 0;
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const challenges = [
  {
    id: 1,
    title: "First Superposition",
    description:
      "Apply a Hadamard gate to create your first quantum superposition",
    difficulty: "easy",
    objective: "Apply H gate to any qubit",
    hint: "Click the 'H → q₀' or 'H → q₁' button",
    points: 100,
  },
  {
    id: 2,
    title: "Bell State Creator",
    description: "Create a Bell state by entangling two qubits",
    difficulty: "medium",
    objective: "Apply H gate to q₀, then CNOT",
    hint: "First create superposition on q₀, then use CNOT to entangle",
    points: 250,
  },
  {
    id: 3,
    title: "Quantum Flip Master",
    description: "Transform |00⟩ to |11⟩ using the minimum number of gates",
    difficulty: "easy",
    objective: "Achieve |11⟩ state in 2 gates",
    hint: "Use X gates on both qubits",
    points: 150,
  },
  {
    id: 4,
    title: "Measurement Master",
    description: "Create a superposition and measure it 5 times",
    difficulty: "medium",
    objective: "Measure 5 times after creating superposition",
    hint: "Create superposition first, then click Measure multiple times",
    points: 200,
  },
  {
    id: 5,
    title: "Equal Probabilities",
    description:
      "Create a state where all four outcomes have equal probability",
    difficulty: "hard",
    objective: "Achieve 25% probability for each state",
    hint: "Apply H gates to both qubits",
    points: 300,
  },
  {
    id: 6,
    title: "Gate Efficiency Expert",
    description: "Complete any challenge using the minimum possible gates",
    difficulty: "hard",
    objective: "Complete a challenge optimally",
    hint: "Think about the most direct path to your goal",
    points: 400,
  },
];

const QuantumDemosPage = () => {
  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    achievements: [],
    completedChallenges: [],
    currentChallenge: null,
    gatesUsed: 0,
    measurements: 0,
    showCelebration: false,
  });

  const { theme } = useTheme();

  const handleChallengeSelect = (challenge) => {
    setGameState((prev) => ({
      ...prev,
      currentChallenge: challenge,
      gatesUsed: 0,
      measurements: 0,
      showCelebration: false,
    }));
  };

  const handleChallengeComplete = (challenge) => {
    if (gameState.completedChallenges.includes(challenge.id)) return;

    const newScore = gameState.score + challenge.points;
    const newLevel = Math.floor(newScore / 500) + 1;
    const newAchievements = [...gameState.achievements];

    // Check for new achievements
    if (newLevel > gameState.level) {
      newAchievements.push(`Level ${newLevel} Reached!`);
    }

    if (
      challenge.difficulty === "hard" &&
      !newAchievements.includes("Hard Challenge Master")
    ) {
      newAchievements.push("Hard Challenge Master");
    }

    if (gameState.completedChallenges.length + 1 === challenges.length) {
      newAchievements.push("Quantum Master");
    }

    setGameState((prev) => ({
      ...prev,
      score: newScore,
      level: newLevel,
      achievements: newAchievements,
      completedChallenges: [...prev.completedChallenges, challenge.id],
      showCelebration: true,
    }));

    // Hide celebration after 3 seconds
    setTimeout(() => {
      setGameState((prev) => ({ ...prev, showCelebration: false }));
    }, 3000);
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      level: 1,
      achievements: [],
      completedChallenges: [],
      currentChallenge: null,
      gatesUsed: 0,
      measurements: 0,
      showCelebration: false,
    });
  };

  return (
    <PageContainer>
      <IntroSection>
        <Heading>
          Quantum Computing <ColoredSpan>Challenge</ColoredSpan>
        </Heading>
        <Text size="lg" $center $maxWidth="800px" margin="16px auto">
          Master quantum computing through interactive challenges! Complete
          objectives, earn points, and unlock achievements as you explore the
          quantum world.
        </Text>
      </IntroSection>

      {/* Game Header */}
      <Section>
        <GameHeader>
          <StatsContainer>
            <StatCard>
              <StatValue>{gameState.score}</StatValue>
              <StatLabel>Score</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{gameState.level}</StatValue>
              <StatLabel>Level</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>
                {gameState.completedChallenges.length}/{challenges.length}
              </StatValue>
              <StatLabel>Challenges</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{gameState.achievements.length}</StatValue>
              <StatLabel>Achievements</StatLabel>
            </StatCard>
          </StatsContainer>

          {gameState.achievements.length > 0 && (
            <div>
              <Text
                weight="semiBold"
                style={{ marginBottom: theme.spacing.sm }}
              >
                Recent Achievements:
              </Text>
              <div>
                {gameState.achievements.slice(-3).map((achievement, index) => (
                  <AchievementBadge key={index}>
                    <i className="fas fa-trophy"></i>
                    {achievement}
                  </AchievementBadge>
                ))}
              </div>
            </div>
          )}

          <FlexContainer
            justify="flex-end"
            style={{ marginTop: theme.spacing.md }}
          >
            <NeumorphicButton onClick={resetGame} size="small">
              Reset Progress
            </NeumorphicButton>
          </FlexContainer>
        </GameHeader>
      </Section>

      {/* Celebration Message */}
      {gameState.showCelebration && (
        <Section>
          <CelebrationMessage>
            <Heading
              size="md"
              style={{
                color: theme.colors.success,
                marginBottom: theme.spacing.sm,
              }}
            >
              🎉 Challenge Completed! 🎉
            </Heading>
            <Text>
              You earned {gameState.currentChallenge?.points} points! Keep going
              to unlock more achievements.
            </Text>
          </CelebrationMessage>
        </Section>
      )}

      {/* Challenges */}
      <Section>
        <ChallengeSection>
          <Heading
            size="lg"
            style={{ textAlign: "center", marginBottom: theme.spacing.xl }}
          >
            Quantum Challenges
          </Heading>

          <FlexContainer wrap="wrap" justify="center">
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                onClick={() => handleChallengeSelect(challenge)}
                $active={gameState.currentChallenge?.id === challenge.id}
                $completed={gameState.completedChallenges.includes(
                  challenge.id
                )}
              >
                <FlexContainer
                  justify="space-between"
                  align="center"
                  style={{ marginBottom: theme.spacing.sm }}
                >
                  <Text weight="semiBold">{challenge.title}</Text>
                  {gameState.completedChallenges.includes(challenge.id) && (
                    <i
                      className="fas fa-check-circle"
                      style={{ color: theme.colors.success }}
                    ></i>
                  )}
                </FlexContainer>

                <ChallengeDifficulty>
                  <DifficultyDot level={challenge.difficulty} />
                  <DifficultyDot level={challenge.difficulty} />
                  <DifficultyDot
                    level={
                      challenge.difficulty === "hard"
                        ? challenge.difficulty
                        : challenge.difficulty === "medium"
                        ? challenge.difficulty
                        : "disabled"
                    }
                  />
                  <Text
                    size="sm"
                    style={{
                      marginLeft: theme.spacing.sm,
                      textTransform: "capitalize",
                    }}
                  >
                    {challenge.difficulty}
                  </Text>
                  <Text
                    size="sm"
                    style={{ marginLeft: "auto", color: theme.colors.primary }}
                  >
                    {challenge.points} pts
                  </Text>
                </ChallengeDifficulty>

                <Text size="sm" style={{ marginBottom: theme.spacing.sm }}>
                  {challenge.description}
                </Text>

                <Text size="xs" style={{ color: theme.colors.secondary }}>
                  Objective: {challenge.objective}
                </Text>

                {gameState.currentChallenge?.id === challenge.id && (
                  <Text
                    size="xs"
                    style={{
                      color: theme.colors.primary,
                      marginTop: theme.spacing.xs,
                    }}
                  >
                    💡 Hint: {challenge.hint}
                  </Text>
                )}
              </ChallengeCard>
            ))}
          </FlexContainer>
        </ChallengeSection>
      </Section>

      {/* Quantum Simulator */}
      <Section>
        <QuantumSimulation
          gameMode={true}
          currentChallenge={gameState.currentChallenge}
          onChallengeComplete={handleChallengeComplete}
          gameState={gameState}
          setGameState={setGameState}
        />
      </Section>

      {/* Info Section */}
      <Section>
        <NeumorphicContainer style={{ padding: theme.spacing.xl }}>
          <Heading size="md" style={{ marginBottom: theme.spacing.lg }}>
            How to Play
          </Heading>

          <FlexContainer direction="column" gap="md">
            <Text size="sm">
              <strong>🎯 Objective:</strong> Complete quantum computing
              challenges to earn points and unlock achievements.
            </Text>
            <Text size="sm">
              <strong>🚀 Getting Started:</strong> Select a challenge from the
              list above, then use the quantum simulator to achieve the
              objective.
            </Text>
            <Text size="sm">
              <strong>⚡ Scoring:</strong> Earn points based on challenge
              difficulty. Use fewer gates for bonus efficiency points!
            </Text>
            <Text size="sm">
              <strong>🏆 Achievements:</strong> Unlock special badges by
              completing challenges and reaching new levels.
            </Text>
            <Text size="sm">
              <strong>🎮 Progressive Difficulty:</strong> Start with easy
              challenges and work your way up to quantum master level!
            </Text>
          </FlexContainer>
        </NeumorphicContainer>
      </Section>
    </PageContainer>
  );
};

export default QuantumDemosPage;
