import { createContext, useContext, useState, type ReactNode } from "react";

export interface PomodoroSettings {
    workTime: number;
    shortBreak: number;
    longBreak: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    longBreakInterval: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: true,
    autoStartPomodoros: true,
    longBreakInterval: 4,
};

interface SettingsContextType {
    settings: PomodoroSettings;
    updateSettings: (newSettings: Partial<PomodoroSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined,
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<PomodoroSettings>(() => {
        const saved = localStorage.getItem("pomodoro-settings");
        return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    });

    const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
        setSettings((prev) => {
            const updated = { ...prev, ...newSettings };
            localStorage.setItem("pomodoro-settings", JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};
