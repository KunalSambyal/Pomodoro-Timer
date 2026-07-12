import { useState, useEffect, useCallback } from "react";
import { useSettings } from "../context/SettingsContext";

export type Mode = "work" | "short-break" | "long-break";

export const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function usePomodoro() {
    const { settings } = useSettings();
    const [currentMode, setCurrentMode] = useState<Mode>("work");
    const [isTimeRunning, setIsTimeRunning] = useState(false);
    const [completedWorkSessions, setCompletedWorkSessions] = useState(0);

    const getModeTime = useCallback(
        (mode: Mode) => {
            if (mode === "work") {
                return settings.workTime * 60;
            } else if (mode === "short-break") {
                return settings.shortBreak * 60;
            } else {
                return settings.longBreak * 60;
            }
        },
        [settings.workTime, settings.shortBreak, settings.longBreak],
    );

    const [remainingTime, setRemainingTime] = useState(() =>
        getModeTime("work"),
    );

    useEffect(() => {
        if (!isTimeRunning) {
            setRemainingTime(getModeTime(currentMode));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getModeTime, currentMode]);

    useEffect(() => {
        let intervalId: number | undefined;

        if (isTimeRunning) {
            intervalId = window.setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev <= 0) return 0;
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isTimeRunning]);

    useEffect(() => {
        if (remainingTime <= 0) {
            setIsTimeRunning(false);

            let nextMode: Mode = "work";
            if (currentMode === "work") {
                const nextCount = completedWorkSessions + 1;
                if (nextCount >= settings.longBreakInterval) {
                    setCompletedWorkSessions(0);
                    nextMode = "long-break";
                } else {
                    setCompletedWorkSessions(nextCount);
                    nextMode = "short-break";
                }
            } else {
                nextMode = "work";
            }

            setCurrentMode(nextMode);
            setRemainingTime(getModeTime(nextMode));

            const shouldAutoStart =
                nextMode === "work"
                    ? settings.autoStartPomodoros
                    : settings.autoStartBreaks;

            if (shouldAutoStart) {
                setIsTimeRunning(true);
            }
        }
    }, [
        remainingTime,
        currentMode,
        completedWorkSessions,
        settings.longBreakInterval,
        settings.autoStartBreaks,
        settings.autoStartPomodoros,
        getModeTime,
    ]);

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
