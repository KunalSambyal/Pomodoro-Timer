import { useState, useEffect } from "react";

export type Mode = "work" | "break" | "long-break";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function usePomodoro() {
    const [currentMode, setCurrentMode] = useState<Mode>("work");
    const [remainingTime, setRemainingTime] = useState(WORK_TIME);
    const [isTimeRunning, setIsTimeRunning] = useState(false);

    useEffect(() => {
        let intervalId: number | undefined;

        if (isTimeRunning) {
            intervalId = window.setInterval(() => {
                setRemainingTime((prevTime) => {
                    if (prevTime <= 1) {
                        setIsTimeRunning(false);
                        const nextMode =
                            currentMode === "work" ? "break" : "work";
                        setCurrentMode(nextMode);
                        return nextMode === "work" ? WORK_TIME : BREAK_TIME;
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
        setRemainingTime(currentMode === "work" ? WORK_TIME : BREAK_TIME);
    };

    const changeMode = (mode: Mode) => {
        setIsTimeRunning(false);
        setCurrentMode(mode);
        setRemainingTime(mode === "work" ? WORK_TIME : BREAK_TIME);
    };

    return {
        currentMode,
        setIsTimeRunning,
        formatTime: formatTime(remainingTime),
        toggleTimer,
        resetTimer,
        changeMode,
    };
}
