import { useState } from "react";
import QuantumSimulation from "../components/interactive/QuantumSimulation";
import { useTheme } from "../context/ThemeContext";

// ─── Tailwind Components replacing Styled Components ────────────────

const PageContainer = ({ children }) => <div className="py-8">{children}</div>;

const IntroSection = ({ children }) => (
  <section className="text-center mb-12">{children}</section>
);

const ColoredSpan = ({ children }) => (
  <span className="text-primary">{children}</span>
);

const GameHeader = ({ children }) => (
  <div className="p-8 mb-12 bg-gradient-to-br from-primary/10 to-secondary/10 bg-card rounded-2xl shadow-neumorphic">
    {children}
  </div>
);

const StatsContainer = ({ children }) => (
  <div className="flex justify-between mb-8 flex-col md:flex-row gap-4">
    {children}
  </div>
);

const StatCard = ({ children }) => (
  <div className="p-4 text-center min-w-[120px] bg-card rounded-xl shadow-neumorphic">
    {children}
  </div>
);

const StatValue = ({ children }) => (
  <div className="text-xl font-bold text-primary mb-1 font-heading">
    {children}
  </div>
);

const StatLabel = ({ children }) => (
  <div className="text-sm text-secondary">{children}</div>
);

const ChallengeSection = ({ children }) => (
  <div className="p-8 mb-12 bg-card rounded-2xl shadow-neumorphic">
    {children}
  </div>
);

const ChallengeCard = ({ $active, $completed, onClick, children }) => {
  let bgClass = "bg-card";
  let borderClass = "border-transparent";

  if ($completed) {
    bgClass = "bg-success/10";
  } else if ($active) {
    bgClass = "bg-primary/10";
    borderClass = "border-primary";
  }

  return (
    <div
      onClick={onClick}
      className={`
        p-6 m-4 cursor-pointer transition-all duration-300 border-2 rounded-xl shadow-neumorphic hover:-translate-y-1 hover:shadow-lg
        ${bgClass} ${borderClass}
      `}
    >
      {children}
    </div>
  );
};

const ChallengeDifficulty = ({ children }) => (
  <div className="flex items-center mb-2">{children}</div>
);

const DifficultyDot = ({ level }) => {
  let colorClass = "bg-secondary";
  if (level === "easy") colorClass = "bg-success";
  if (level === "medium") colorClass = "bg-warning";
  if (level === "hard") colorClass = "bg-danger";

  return <div className={`w-2 h-2 rounded-full mr-1 ${colorClass}`} />;
};

const AchievementBadge = ({ children }) => (
  <div className="inline-flex items-center px-3 py-1 bg-success/20 text-success rounded text-xs font-semibold m-1">
    {children}
  </div>
);

const CelebrationMessage = ({ children }) => (
  <div className="p-8 text-center bg-gradient-to-br from-success/20 to-primary/20 border-2 border-success rounded-xl shadow-neumorphic mb-8 animate-celebration">
    {children}
  </div>
);

// Typography & Layout Helpers
const Heading = ({ size, style, children, ...props }) => (
  <h2
    className={`font-bold text-text font-heading ${size === "lg" ? "text-3xl" : size === "md" ? "text-2xl" : "text-xl"}`}
    style={style}
    {...props}
  >
    {children}
  </h2>
);

const Text = ({
  size,
  weight,
  margin,
  $center,
  $maxWidth,
  style,
  children,
  ...props
}) => (
  <p
    className={`
      ${size === "lg" ? "text-lg" : size === "sm" ? "text-sm" : size === "xs" ? "text-xs" : "text-base"}
      ${weight === "semiBold" ? "font-semibold" : ""}
      ${$center ? "text-center" : ""}
      text-text
    `}
    style={{ ...style, margin, maxWidth: $maxWidth }}
    {...props}
  >
    {children}
  </p>
);

const Section = ({ children }) => <section>{children}</section>;

const FlexContainer = ({
  justify,
  align,
  gap,
  direction,
  wrap,
  style,
  children,
  ...props
}) => (
  <div
    className={`flex ${wrap ? "flex-wrap" : ""} ${direction === "column" ? "flex-col" : ""}`}
    style={{
      justifyContent: justify === "space-between" ? "space-between" : justify,
      alignItems: align === "center" ? "center" : align,
      gap: gap === "md" ? "1rem" : gap,
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

const NeumorphicButton = ({ size, onClick, children }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-xl font-medium bg-background text-text shadow-neumorphic hover:-translate-y-1 hover:shadow-neumorphic-hover transition-all duration-300
      ${size === "small" ? "text-sm px-3 py-1.5" : ""}
    `}
  >
    {children}
  </button>
);

const NeumorphicContainer = ({ style, children }) => (
  <div className="p-4 bg-card rounded-xl shadow-neumorphic" style={style}>
    {children}
  </div>
);

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
                  challenge.id,
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
