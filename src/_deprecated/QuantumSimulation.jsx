import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";

// ─── Tailwind Components replacing Styled Components ────────────────

const SimulationContainer = ({ children, className = "", ...props }) => (
  <div
    className={`p-8 mb-8 bg-card rounded-2xl shadow-neumorphic ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CircuitCanvas = ({ ...props }) => {
  const { theme } = useTheme();
  return (
    <canvas
      className={`w-full max-w-[800px] h-[400px] rounded-lg shadow-inner my-6 ${theme.name === "dark" ? "bg-[#1a1f2e]" : "bg-[#f0f2f5]"}`}
      {...props}
    />
  );
};

const ControlPanel = ({ children, ...props }) => (
  <div className="flex flex-wrap gap-4 mb-6" {...props}>
    {children}
  </div>
);

const GateButton = ({ $active, children, primary, ...props }) => (
  <button
    className={`
      min-w-[80px] text-sm font-bold px-4 py-2 rounded-xl transition-all duration-200
      ${
        $active
          ? "bg-primary text-white shadow-inner"
          : primary
            ? "bg-primary text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
            : "bg-transparent text-text hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-text/10"
      }
    `}
    {...props}
  >
    {children}
  </button>
);

const StateDisplay = ({ children, style, ...props }) => (
  <div
    className="p-4 mt-4 bg-card rounded-2xl shadow-neumorphic"
    style={style}
    {...props}
  >
    {children}
  </div>
);

const ProbabilityBar = ({ children }) => (
  <div className="w-full h-2 bg-background rounded-full overflow-hidden my-1">
    {children}
  </div>
);

const ProbabilityFill = ({ width }) => (
  <div
    className="h-full bg-primary transition-all duration-300"
    style={{ width: `${width}%` }}
  />
);

const QubitState = ({ children }) => (
  <div className="flex justify-between items-center mb-2">{children}</div>
);

const MeasurementResult = ({ children }) => (
  <div className="p-4 mt-4 bg-success/10 border-l-4 border-success rounded-xl shadow-neumorphic">
    {children}
  </div>
);

const ChallengeStatus = ({ children }) => (
  <div className="p-4 mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-l-4 border-primary rounded-xl shadow-neumorphic">
    {children}
  </div>
);

const ProgressIndicator = ({ children }) => (
  <div className="mt-2">{children}</div>
);

// Typography & Layout Helpers
const Heading = ({ children, style, ...props }) => (
  <h2
    className="text-2xl font-bold text-text font-heading"
    style={style}
    {...props}
  >
    {children}
  </h2>
);

const SubHeading = ({ children, style, ...props }) => (
  <h3
    className="text-xl font-semibold text-text font-heading"
    style={style}
    {...props}
  >
    {children}
  </h3>
);

const Text = ({ size, weight, children, style, ...props }) => (
  <p
    className={`
      ${size === "sm" ? "text-sm" : "text-base"}
      ${weight === "semiBold" ? "font-semibold" : weight === "medium" ? "font-medium" : ""}
      text-text
    `}
    style={style}
    {...props}
  >
    {children}
  </p>
);

const FlexContainer = ({ justify, align, gap, children, ...props }) => (
  <div
    className="flex"
    style={{
      justifyContent: justify === "space-between" ? "space-between" : justify,
      alignItems: align === "center" ? "center" : align,
      gap: gap === "sm" ? "0.5rem" : gap,
    }}
    {...props}
  >
    {children}
  </div>
);

// Quantum computing simulation class
class QuantumSimulator {
  constructor() {
    this.qubits = 2;
    this.reset();
  }

  reset() {
    // Initialize in |00⟩ state
    this.amplitudes = new Array(4).fill(0);
    this.amplitudes[0] = 1; // |00⟩ has amplitude 1
    this.gates = [];
    this.gateCount = 0;
    this.measurementCount = 0;
  }

  // Apply Hadamard gate to create superposition
  hadamard(qubit) {
    const newAmplitudes = [...this.amplitudes];
    const sqrt2 = Math.sqrt(2);

    for (let i = 0; i < 4; i++) {
      const bitValue = (i >> qubit) & 1;
      const flippedIndex = i ^ (1 << qubit);

      if (bitValue === 0) {
        newAmplitudes[i] =
          (this.amplitudes[i] + this.amplitudes[flippedIndex]) / sqrt2;
        newAmplitudes[flippedIndex] =
          (this.amplitudes[i] - this.amplitudes[flippedIndex]) / sqrt2;
      }
    }

    this.amplitudes = newAmplitudes;
    this.gates.push({ type: "H", qubit });
    this.gateCount++;
  }

  // Apply Pauli-X gate (NOT gate)
  pauliX(qubit) {
    const newAmplitudes = [...this.amplitudes];

    for (let i = 0; i < 4; i++) {
      const flippedIndex = i ^ (1 << qubit);
      newAmplitudes[i] = this.amplitudes[flippedIndex];
    }

    this.amplitudes = newAmplitudes;
    this.gates.push({ type: "X", qubit });
    this.gateCount++;
  }

  // Apply CNOT gate for entanglement
  cnot(control, target) {
    const newAmplitudes = [...this.amplitudes];

    for (let i = 0; i < 4; i++) {
      const controlBit = (i >> control) & 1;
      if (controlBit === 1) {
        const flippedIndex = i ^ (1 << target);
        newAmplitudes[i] = this.amplitudes[flippedIndex];
      } else {
        newAmplitudes[i] = this.amplitudes[i];
      }
    }

    this.amplitudes = newAmplitudes;
    this.gates.push({ type: "CNOT", control, target });
    this.gateCount++;
  }

  // Get probabilities for each computational basis state
  getProbabilities() {
    return this.amplitudes.map((amp) => Math.abs(amp) ** 2);
  }

  // Simulate measurement
  measure() {
    this.measurementCount++;
    const probabilities = this.getProbabilities();
    const rand = Math.random();
    let cumulative = 0;

    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (rand < cumulative) {
        return i.toString(2).padStart(2, "0");
      }
    }
    return "00";
  }

  // Check if current state matches target
  checkState(targetProbabilities, tolerance = 0.05) {
    const currentProbs = this.getProbabilities();
    return targetProbabilities.every(
      (target, index) => Math.abs(currentProbs[index] - target) < tolerance,
    );
  }
}

const QuantumSimulation = ({
  gameMode = false,
  currentChallenge = null,
  onChallengeComplete = null,
  gameState = null,
  setGameState = null,
}) => {
  const [simulator] = useState(new QuantumSimulator());
  const [probabilities, setProbabilities] = useState([1, 0, 0, 0]);
  const [measurementResult, setMeasurementResult] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [gateOperations, setGateOperations] = useState(0); // Track gate operations for re-renders
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  const updateProbabilities = () => {
    setProbabilities(simulator.getProbabilities());
  };

  const checkChallengeCompletion = useCallback(() => {
    if (!gameMode || !currentChallenge || !gameState || !setGameState) return;

    let completed = false;
    let progress = 0;

    switch (currentChallenge.id) {
      case 1: {
        // First Superposition
        const hasHGate = simulator.gates.some((gate) => gate.type === "H");
        completed = hasHGate;
        progress = hasHGate ? 100 : 0;
        break;
      }

      case 2: {
        // Bell State Creator
        const hasH0 = simulator.gates.some(
          (gate) => gate.type === "H" && gate.qubit === 0,
        );
        const hasCNOT = simulator.gates.some((gate) => gate.type === "CNOT");
        const bellState = hasH0 && hasCNOT;
        completed = bellState && simulator.checkState([0.5, 0, 0, 0.5]);
        progress = hasH0 ? (hasCNOT ? (completed ? 100 : 80) : 50) : 0;
        break;
      }

      case 3: {
        // Quantum Flip Master |00⟩ to |11⟩
        completed =
          simulator.checkState([0, 0, 0, 1]) && simulator.gateCount <= 2;
        progress = simulator.checkState([0, 0, 0, 1])
          ? 100
          : simulator.gates.filter((g) => g.type === "X").length * 50;
        break;
      }

      case 4: {
        // Measurement Master
        const hasSuperposition = simulator.gates.some(
          (gate) => gate.type === "H",
        );
        completed = hasSuperposition && simulator.measurementCount >= 5;
        progress = hasSuperposition
          ? Math.min(simulator.measurementCount * 20, 100)
          : 0;
        break;
      }

      case 5: {
        // Equal Probabilities
        completed = simulator.checkState([0.25, 0.25, 0.25, 0.25]);
        const h0 = simulator.gates.some(
          (gate) => gate.type === "H" && gate.qubit === 0,
        );
        const h1 = simulator.gates.some(
          (gate) => gate.type === "H" && gate.qubit === 1,
        );
        progress = h0 ? (h1 ? (completed ? 100 : 80) : 50) : 0;
        break;
      }

      case 6: {
        // Gate Efficiency Expert
        // This challenge is completed when any other challenge is completed with minimum gates
        const otherChallengeCompleted =
          gameState.completedChallenges.length > 0;
        completed = otherChallengeCompleted && simulator.gateCount <= 2;
        progress = otherChallengeCompleted
          ? simulator.gateCount <= 2
            ? 100
            : 50
          : 0;
        break;
      }

      default:
        break;
    }

    setChallengeProgress(progress);

    if (
      completed &&
      !gameState.completedChallenges.includes(currentChallenge.id)
    ) {
      // Add efficiency bonus
      let bonus = 0;
      if (simulator.gateCount <= 2) bonus += 50;
      if (simulator.gateCount <= 1) bonus += 50;

      const finalPoints = currentChallenge.points + bonus;

      // Update challenge with bonus points
      onChallengeComplete({
        ...currentChallenge,
        points: finalPoints,
      });
    }
  }, [
    gameMode,
    currentChallenge,
    gameState,
    setGameState,
    simulator,
    onChallengeComplete,
  ]);

  const drawCircuit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw quantum wires
    ctx.strokeStyle = theme.colors.text;
    ctx.lineWidth = 2;

    // Qubit 0 wire
    ctx.beginPath();
    ctx.moveTo(50, height / 3);
    ctx.lineTo(width - 50, height / 3);
    ctx.stroke();

    // Qubit 1 wire
    ctx.beginPath();
    ctx.moveTo(50, (2 * height) / 3);
    ctx.lineTo(width - 50, (2 * height) / 3);
    ctx.stroke();

    // Draw qubit labels
    ctx.fillStyle = theme.colors.text;
    ctx.font = "16px Arial";
    ctx.fillText("|q₀⟩", 10, height / 3 + 5);
    ctx.fillText("|q₁⟩", 10, (2 * height) / 3 + 5);

    // Draw gates
    simulator.gates.forEach((gate, index) => {
      const x = 100 + index * 80;

      ctx.fillStyle = theme.colors.primary;
      ctx.strokeStyle = theme.colors.primary;
      ctx.lineWidth = 2;

      if (gate.type === "H") {
        // Hadamard gate
        const y = gate.qubit === 0 ? height / 3 : (2 * height) / 3;
        ctx.fillRect(x - 15, y - 15, 30, 30);
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText("H", x, y + 5);
      } else if (gate.type === "X") {
        // Pauli-X gate
        const y = gate.qubit === 0 ? height / 3 : (2 * height) / 3;
        ctx.fillRect(x - 15, y - 15, 30, 30);
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText("X", x, y + 5);
      } else if (gate.type === "CNOT") {
        // CNOT gate
        const controlY = gate.control === 0 ? height / 3 : (2 * height) / 3;
        const targetY = gate.target === 0 ? height / 3 : (2 * height) / 3;

        // Control dot
        ctx.beginPath();
        ctx.arc(x, controlY, 8, 0, 2 * Math.PI);
        ctx.fill();

        // Target circle
        ctx.beginPath();
        ctx.arc(x, targetY, 15, 0, 2 * Math.PI);
        ctx.stroke();

        // Target cross
        ctx.beginPath();
        ctx.moveTo(x - 10, targetY);
        ctx.lineTo(x + 10, targetY);
        ctx.moveTo(x, targetY - 10);
        ctx.lineTo(x, targetY + 10);
        ctx.stroke();

        // Connection line
        ctx.beginPath();
        ctx.moveTo(x, controlY);
        ctx.lineTo(x, targetY);
        ctx.stroke();
      }
    });

    ctx.textAlign = "left";
  }, [theme, simulator]);

  const applyGate = (gateType, qubit = 0) => {
    setIsAnimating(true);
    setMeasurementResult(null);

    setTimeout(() => {
      switch (gateType) {
        case "H":
          simulator.hadamard(qubit);
          break;
        case "X":
          simulator.pauliX(qubit);
          break;
        case "CNOT":
          simulator.cnot(0, 1);
          break;
        default:
          break;
      }
      updateProbabilities();
      drawCircuit(); // Force circuit redraw after each gate
      setGateOperations((prev) => prev + 1); // Trigger re-render
      setIsAnimating(false);

      // Update game state if in game mode
      if (gameMode && setGameState) {
        setGameState((prev) => ({
          ...prev,
          gatesUsed: simulator.gateCount,
        }));
      }
    }, 300);
  };

  const resetSimulation = () => {
    simulator.reset();
    updateProbabilities();
    drawCircuit(); // Force circuit redraw after reset
    setGateOperations(0); // Reset gate operations counter
    setMeasurementResult(null);
    setChallengeProgress(0);

    if (gameMode && setGameState) {
      setGameState((prev) => ({
        ...prev,
        gatesUsed: 0,
        measurements: 0,
      }));
    }
  };

  const performMeasurement = () => {
    const result = simulator.measure();
    setMeasurementResult(result);

    if (gameMode && setGameState) {
      setGameState((prev) => ({
        ...prev,
        measurements: simulator.measurementCount,
      }));
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawCircuit();
    }
  }, [gateOperations, theme, drawCircuit]);

  useEffect(() => {
    if (gameMode) {
      checkChallengeCompletion();
    }
  }, [
    probabilities,
    simulator.gates,
    simulator.measurementCount,
    gameMode,
    checkChallengeCompletion,
  ]);

  const stateLabels = ["|00⟩", "|01⟩", "|10⟩", "|11⟩"];

  return (
    <SimulationContainer>
      {!gameMode && (
        <Heading
          style={{ textAlign: "center", marginBottom: theme.spacing.lg }}
        >
          Quantum Computing Simulation
        </Heading>
      )}

      {!gameMode && (
        <Text style={{ textAlign: "center", marginBottom: theme.spacing.lg }}>
          Explore quantum superposition, entanglement, and measurement with this
          interactive 2-qubit simulator
        </Text>
      )}

      {/* Challenge Status for Game Mode */}
      {gameMode && currentChallenge && (
        <ChallengeStatus>
          <FlexContainer justify="space-between" align="center">
            <div>
              <Text weight="semiBold" style={{ color: theme.colors.primary }}>
                Current Challenge: {currentChallenge.title}
              </Text>
              <Text size="sm">{currentChallenge.objective}</Text>
            </div>
            <div style={{ textAlign: "right" }}>
              <Text size="sm" style={{ color: theme.colors.secondary }}>
                Gates Used: {simulator.gateCount}
              </Text>
              {simulator.measurementCount > 0 && (
                <Text size="sm" style={{ color: theme.colors.secondary }}>
                  Measurements: {simulator.measurementCount}
                </Text>
              )}
            </div>
          </FlexContainer>

          <ProgressIndicator>
            <Text size="sm" style={{ marginBottom: theme.spacing.xs }}>
              Progress: {challengeProgress}%
            </Text>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${challengeProgress}%` }}
              />
            </div>
          </ProgressIndicator>
        </ChallengeStatus>
      )}

      <CircuitCanvas ref={canvasRef} />

      <ControlPanel>
        {!gameMode && (
          <Text
            weight="semiBold"
            style={{
              width: "100%",
              textAlign: "center",
              marginBottom: theme.spacing.sm,
            }}
          >
            Quantum Gates
          </Text>
        )}

        <GateButton
          onClick={() => applyGate("H", 0)}
          disabled={isAnimating}
          title="Apply Hadamard gate to qubit 0 (creates superposition)"
        >
          H → q₀
        </GateButton>

        <GateButton
          onClick={() => applyGate("H", 1)}
          disabled={isAnimating}
          title="Apply Hadamard gate to qubit 1 (creates superposition)"
        >
          H → q₁
        </GateButton>

        <GateButton
          onClick={() => applyGate("X", 0)}
          disabled={isAnimating}
          title="Apply Pauli-X gate to qubit 0 (bit flip)"
        >
          X → q₀
        </GateButton>

        <GateButton
          onClick={() => applyGate("X", 1)}
          disabled={isAnimating}
          title="Apply Pauli-X gate to qubit 1 (bit flip)"
        >
          X → q₁
        </GateButton>

        <GateButton
          onClick={() => applyGate("CNOT")}
          disabled={isAnimating}
          title="Apply CNOT gate (creates entanglement)"
        >
          CNOT
        </GateButton>

        <GateButton
          onClick={performMeasurement}
          disabled={isAnimating}
          primary
          title="Measure the quantum state"
        >
          Measure
        </GateButton>

        <GateButton
          onClick={resetSimulation}
          disabled={isAnimating}
          title="Reset to initial state |00⟩"
        >
          Reset
        </GateButton>
      </ControlPanel>

      <StateDisplay>
        <SubHeading style={{ marginBottom: theme.spacing.md }}>
          Quantum State Probabilities
        </SubHeading>

        {stateLabels.map((label, index) => (
          <QubitState key={index}>
            <Text size="sm" weight="medium">
              {label}
            </Text>
            <div style={{ flex: 1, margin: `0 ${theme.spacing.md}` }}>
              <ProbabilityBar>
                <ProbabilityFill width={probabilities[index] * 100} />
              </ProbabilityBar>
            </div>
            <Text size="sm" style={{ color: theme.colors.primary }}>
              {(probabilities[index] * 100).toFixed(1)}%
            </Text>
          </QubitState>
        ))}
      </StateDisplay>

      {measurementResult && (
        <MeasurementResult>
          <Text weight="semiBold">
            Measurement Result: |{measurementResult}⟩
          </Text>
          <Text size="sm" style={{ marginTop: theme.spacing.xs }}>
            The quantum state has collapsed to this classical state
          </Text>
        </MeasurementResult>
      )}

      {!gameMode && (
        <StateDisplay style={{ marginTop: theme.spacing.lg }}>
          <SubHeading style={{ marginBottom: theme.spacing.md }}>
            Quick Guide
          </SubHeading>

          <FlexContainer direction="column" gap="sm">
            <Text size="sm">
              <strong>H Gate:</strong> Creates superposition - qubit becomes 50%
              |0⟩ + 50% |1⟩
            </Text>
            <Text size="sm">
              <strong>X Gate:</strong> Bit flip - transforms |0⟩ ↔ |1⟩
            </Text>
            <Text size="sm">
              <strong>CNOT Gate:</strong> Creates entanglement between qubits
            </Text>
            <Text size="sm">
              <strong>Measurement:</strong> Collapses the quantum state to a
              classical outcome
            </Text>
          </FlexContainer>
        </StateDisplay>
      )}
    </SimulationContainer>
  );
};

export default QuantumSimulation;
