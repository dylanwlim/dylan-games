"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  advanceSnakeClock,
  createSnakeState,
  isSnakeMode,
  queueDirection,
  restartSnake,
  snakeModeDefinitions,
  stepSnake,
  toggleSnakePlay,
} from "./snake-engine";
import { snakeModes, type Direction, type SnakeMode, type SnakeState } from "./snakeTypes";

const bestScoresKey = "dylan-games:snake-best-scores";
const lastModeKey = "dylan-games:snake-last-mode";

type SnakeViewState = {
  game: SnakeState;
  bestScores: Record<SnakeMode, number>;
};

const initialBestScores = Object.fromEntries(snakeModes.map((mode) => [mode, 0])) as Record<
  SnakeMode,
  number
>;

export function useSnakeGame() {
  const [viewState, setViewState] = useState<SnakeViewState>(() => ({
    game: createSnakeState(),
    bestScores: initialBestScores,
  }));
  const stateRef = useRef(viewState.game);
  const storageLoadedRef = useRef(false);
  const state = viewState.game;
  const bestScore = viewState.bestScores[state.mode] ?? 0;

  const updateGame = useCallback((updater: (previousState: SnakeState) => SnakeState) => {
    setViewState((previousViewState) => {
      const game = updater(previousViewState.game);
      const currentBest = previousViewState.bestScores[game.mode] ?? 0;
      const bestScores =
        game.score > currentBest
          ? {
              ...previousViewState.bestScores,
              [game.mode]: game.score,
            }
          : previousViewState.bestScores;

      stateRef.current = game;

      return {
        game,
        bestScores,
      };
    });
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    let storedMode: SnakeMode | undefined;
    let storedBestScores = { ...initialBestScores };

    const rawMode = window.localStorage.getItem(lastModeKey);
    const rawBestScores = window.localStorage.getItem(bestScoresKey);

    if (rawMode && isSnakeMode(rawMode)) {
      storedMode = rawMode;
    }

    storedBestScores = parseStoredBestScores(rawBestScores);

    setViewState((previousViewState) => {
      const game =
        storedMode && storedMode !== previousViewState.game.mode
          ? createSnakeState({ mode: storedMode })
          : previousViewState.game;

      stateRef.current = game;

      return {
        game,
        bestScores: storedBestScores,
      };
    });
    storageLoadedRef.current = true;
  }, []);

  useEffect(() => {
    if (!storageLoadedRef.current) {
      return;
    }

    window.localStorage.setItem(bestScoresKey, JSON.stringify(viewState.bestScores));
  }, [viewState.bestScores]);

  useEffect(() => {
    if (!storageLoadedRef.current) {
      return;
    }

    window.localStorage.setItem(lastModeKey, state.mode);
  }, [state.mode]);

  const queueMove = useCallback(
    (direction: Direction) => {
      updateGame((previousState) => queueDirection(previousState, direction));
    },
    [updateGame],
  );

  const togglePlay = useCallback(() => {
    updateGame((previousState) => toggleSnakePlay(previousState));
  }, [updateGame]);

  const restart = useCallback(() => {
    updateGame((previousState) => restartSnake(previousState));
  }, [updateGame]);

  const pause = useCallback(() => {
    updateGame((previousState) =>
      previousState.status === "playing" ? { ...previousState, status: "paused" } : previousState,
    );
  }, [updateGame]);

  const selectMode = useCallback(
    (mode: SnakeMode) => {
      updateGame((previousState) =>
        previousState.mode === mode ? restartSnake(previousState) : createSnakeState({ mode }),
      );
    },
    [updateGame],
  );

  const advanceFrame = useCallback(
    ({ clockDeltaMs, shouldStep }: { clockDeltaMs: number; shouldStep: boolean }) => {
      updateGame((previousState) => {
        let nextState =
          clockDeltaMs > 0 ? advanceSnakeClock(previousState, clockDeltaMs) : previousState;

        if (shouldStep && nextState.status === "playing") {
          nextState = stepSnake(nextState);
        }

        return nextState;
      });
    },
    [updateGame],
  );

  const actions = useMemo(
    () => ({
      advanceFrame,
      pause,
      queueMove,
      restart,
      selectMode,
      togglePlay,
    }),
    [advanceFrame, pause, queueMove, restart, selectMode, togglePlay],
  );

  return {
    state,
    stateRef,
    bestScore,
    modeDefinition: snakeModeDefinitions[state.mode],
    actions,
  };
}

function parseStoredBestScores(rawBestScores: string | null): Record<SnakeMode, number> {
  if (!rawBestScores) {
    return { ...initialBestScores };
  }

  return snakeModes.reduce<Record<SnakeMode, number>>(
    (scores, mode) => {
      const match = rawBestScores.match(new RegExp(`"${mode}"\\s*:\\s*(\\d+)`));
      const parsedScore = match ? Number(match[1]) : 0;

      return {
        ...scores,
        [mode]: Number.isFinite(parsedScore) ? parsedScore : 0,
      };
    },
    { ...initialBestScores },
  );
}
