interface Props {
    label: string;
    bgColor: string;
    onClick: () => void;
}

const ActionButton = ({ label, bgColor, onClick }: Props) => {
    return (
        <button
            onClick={onClick}
            className={`${bgColor} px-2 py-1 text-2xl font-semibold rounded-md cursor-pointer hover:scale-[1.05] active:scale-[0.95] transition shadow-md`}
        >
            {label}
        </button>
    );
};

export default ActionButton;
