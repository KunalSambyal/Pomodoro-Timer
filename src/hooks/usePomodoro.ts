import { useState, useEffect } from "react";

export type Mode = "work" | "short-break" | "long-break";

const WORK_TIME = 2;
const SHORT_BREAK_TIME = 3;
const LONG_BREAK_TIME = 5;

export const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function usePomodoro() {
    const [currentMode, setCurrentMode] = useState<Mode>("work");
    const [remainingTime, setRemainingTime] = useState(WORK_TIME);
    const [isTimeRunning, setIsTimeRunning] = useState(false);
    const [completedWorkSessions, setCompletedWorkSessions] = useState(0);

    const getModeTime = (mode: Mode) => {
        if (mode === "work") {
            return WORK_TIME;
        } else if (mode === "short-break") {
            return SHORT_BREAK_TIME;
        } else {
            return LONG_BREAK_TIME;
        }
    };

    const getNextMode = (mode: Mode) => {
        if (mode === "work") {
            const nextCount = completedWorkSessions + 1;
            if (nextCount === 4) {
                setCompletedWorkSessions(0);
                return "long-break";
            }
            setCompletedWorkSessions(nextCount);
            return "short-break";
        } else {
            return "work";
        }
    };

    useEffect(() => {
        let intervalId: number | undefined;

        if (isTimeRunning) {
            intervalId = window.setInterval(() => {
                setRemainingTime((prevTime) => {
                    if (prevTime <= 1) {
                        setIsTimeRunning(false);
                        const nextMode = getNextMode(currentMode);
                        setCurrentMode(nextMode);
                        return getModeTime(nextMode);
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isTimeRunning, currentMode]);

    const toggleTimer = () => setIsTimeRunning((prev) => !prev);

    const resetTimer = () => {
        setIsTimeRunning(false);
        setRemainingTime(getModeTime(currentMode));
    };

    const changeMode = (mode: Mode) => {
        setIsTimeRunning(false);
        setCurrentMode(mode);
        setRemainingTime(getModeTime(mode));
    };

    return {
        currentMode,
        setIsTimeRunning,
        formatTime: formatTime(remainingTime),
        toggleTimer,
        resetTimer,
        changeMode,
        completedWorkSessions,
    };
}
