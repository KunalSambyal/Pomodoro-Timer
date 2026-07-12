import { useEffect, useState } from "react";
import { FontAwesomeIcon, faClock, faXmark } from "../assets/icons";
import { useSettings } from "../context/SettingsContext";

interface ToggleSwitchProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const ToggleSwitch = ({ id, label, checked, onChange }: ToggleSwitchProps) => {
    return (
        <button
            type="button"
            id={id}
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full items-center px-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 ${
                checked ? "bg-neutral-400" : "bg-neutral-300"
            }`}
        >
            <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                    checked ? "translate-x-5" : "translate-x-0"
                }`}
            />
        </button>
    );
};

interface TimeInputProps {
    id: string;
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

const TimeInput = ({ id, label, value, onChange, min = 1, max = 180 }: TimeInputProps) => {
    const [inputValue, setInputValue] = useState(value.toString());

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setInputValue(rawValue);

        if (rawValue !== "") {
            const numVal = Number(rawValue);
            if (!isNaN(numVal)) {
                const clamped = Math.max(min, Math.min(max, numVal));
                onChange(clamped);
            }
        }
    };

    const handleBlur = () => {
        if (inputValue === "" || isNaN(Number(inputValue))) {
            setInputValue(value.toString());
        }
    };

    return (
        <div className="flex flex-col">
            <label
                htmlFor={id}
                className="text-xs font-bold text-neutral-400 mb-1.5 whitespace-nowrap"
            >
                {label}
            </label>
            <input
                type="number"
                id={id}
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                min={min}
                max={max}
                className="w-full bg-[#efefef] text-neutral-600 font-semibold py-2.5 px-3 rounded-lg focus:outline-none focus:bg-neutral-200/60 transition-colors text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
        </div>
    );
};

const IntervalInput = ({
    value,
    onChange,
    min = 1,
    max = 12,
}: {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}) => {
    const [inputValue, setInputValue] = useState(value.toString());

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setInputValue(rawValue);

        if (rawValue !== "") {
            const numVal = Number(rawValue);
            if (!isNaN(numVal)) {
                const clamped = Math.max(min, Math.min(max, numVal));
                onChange(clamped);
            }
        }
    };

    const handleBlur = () => {
        if (inputValue === "" || isNaN(Number(inputValue))) {
            setInputValue(value.toString());
        }
    };

    return (
        <input
            type="number"
            id="long-break-interval"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            min={min}
            max={max}
            className="w-16 bg-[#efefef] text-neutral-600 font-semibold py-2 px-3 rounded-lg focus:outline-none focus:bg-neutral-200/60 transition-colors text-sm text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
    );
};

interface SettingsProps {
    onClose?: () => void;
}

const Settings = ({ onClose }: SettingsProps) => {
    const { settings, updateSettings } = useSettings();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose?.();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        const previouslyFocusedElement = document.activeElement as HTMLElement | null;
        const firstInput = document.getElementById("pomodoro-time");
        if (firstInput) {
            firstInput.focus();
        }
        return () => {
            if (previouslyFocusedElement) {
                previouslyFocusedElement.focus();
            }
        };
    }, []);

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="bg-white text-neutral-800 rounded-2xl w-full max-w-md shadow-lg border border-neutral-100 flex flex-col font-sans overflow-hidden"
        >
            <div className="relative flex justify-center items-center py-4 border-b border-neutral-100">
                <h2 className="text-sm font-bold tracking-widest text-neutral-400">
                    SETTING
                </h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-6 text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none cursor-pointer"
                    aria-label="Close settings"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-neutral-400 text-[11px] font-bold tracking-wider">
                        <FontAwesomeIcon icon={faClock} className="text-sm" />
                        <span>TIMER</span>
                    </div>

                    <h3 className="text-sm font-bold text-neutral-700 mt-3 mb-2">
                        Time (minutes)
                    </h3>

                    <div className="grid grid-cols-3 gap-3.5">
                        <TimeInput
                            id="pomodoro-time"
                            label="Pomodoro"
                            value={settings.workTime}
                            onChange={(val) => updateSettings({ workTime: val })}
                            min={1}
                            max={180}
                        />
                        <TimeInput
                            id="short-break-time"
                            label="Short Break"
                            value={settings.shortBreak}
                            onChange={(val) => updateSettings({ shortBreak: val })}
                            min={1}
                            max={60}
                        />
                        <TimeInput
                            id="long-break-time"
                            label="Long Break"
                            value={settings.longBreak}
                            onChange={(val) => updateSettings({ longBreak: val })}
                            min={1}
                            max={120}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-neutral-600">
                            Auto Start Breaks
                        </span>
                        <ToggleSwitch
                            id="auto-start-breaks"
                            label="Auto Start Breaks"
                            checked={settings.autoStartBreaks}
                            onChange={(checked) =>
                                updateSettings({ autoStartBreaks: checked })
                            }
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-neutral-600">
                            Auto Start Pomodoros
                        </span>
                        <ToggleSwitch
                            id="auto-start-pomodoros"
                            label="Auto Start Pomodoros"
                            checked={settings.autoStartPomodoros}
                            onChange={(checked) => {
                                updateSettings({ autoStartPomodoros: checked });
                            }}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-neutral-600">
                            Long Break interval
                        </span>
                        <IntervalInput
                            value={settings.longBreakInterval}
                            onChange={(val) =>
                                updateSettings({
                                    longBreakInterval: val,
                                })
                            }
                            min={1}
                            max={12}
                        />
                    </div>
                </div>

                <div className="border-t border-neutral-100/70 pt-2" />
            </div>
        </form>
    );
};

export default Settings;
