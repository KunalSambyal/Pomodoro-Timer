interface Props {
    label: string;
    onClick: () => void;
    isActive: boolean;
}

const ModeButton = ({ label, onClick, isActive }: Props) => {
    return (
        <button
            className={`${isActive ? "bg-[#0000002f]" : "bg-transparent"} px-2 py-0.5 rounded-sm flex justify-center items-center text-md cursor-pointer hover:border-gray-400 border-transparent border transition whitespace-nowrap`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default ModeButton;
