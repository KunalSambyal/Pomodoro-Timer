import ActionButton from "./ActionButton";
import ModeButton from "./ModeButton";
import { type Mode, usePomodoro } from "../hooks/usePomodoro";

const Container = () => {
    const {
        currentMode,
        setIsTimeRunning,
        formatTime,
        resetTimer,
        changeMode,
        completedWorkSessions,
    } = usePomodoro();

    const modes: { id: Mode; label: string }[] = [
        { id: "work", label: "Work" },
        { id: "short-break", label: "Break" },
        { id: "long-break", label: "Long Break" },
    ];

    const handleActionClick = (id: string) => {
        if (id === "reset") resetTimer();
        if (id === "start") setIsTimeRunning(true);
        if (id === "pause") setIsTimeRunning(false);
    };

    const actionButtons: { id: string; label: string; bgColor: string }[] = [
        { id: "reset", label: "Reset", bgColor: "bg-blue-500" },
        { id: "start", label: "Start", bgColor: "bg-green-500" },
        { id: "pause", label: "Pause", bgColor: "bg-orange-500" },
    ];

    return (
        <div className="w-100 bg-[#ffffff1d] h-fit px-6 py-4 rounded-md shadow-xl flex flex-col gap-y-4">
            {/* Modes */}
            <div className="flex justify-between px-4">
                {modes.map((mode) => (
                    <ModeButton
                        key={mode.id}
                        label={mode.label}
                        onClick={() => changeMode(mode.id)}
                        isActive={currentMode === mode.id}
                    />
                ))}
            </div>

            {/* Time */}
            <div className="py-4 text-5xl font-bold text-center text-shadow-md">
                {formatTime}
            </div>

            {/* Work Sessions */}
            <div className="text-slate-300 text-center text-sm py-2">
                {currentMode === "long-break"
                    ? `Time for long break!`
                    : `Completed Work Session: ${completedWorkSessions}`}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
                {actionButtons.map((actionButton) => (
                    <ActionButton
                        key={actionButton.id}
                        label={actionButton.label}
                        bgColor={actionButton.bgColor}
                        onClick={() => handleActionClick(actionButton.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Container;
