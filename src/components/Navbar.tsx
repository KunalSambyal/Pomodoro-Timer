import { FontAwesomeIcon, faGear, faClock } from "../assets/icons";

interface NavbarProps {
    onOpenSettings: () => void;
}

const Navbar = ({ onOpenSettings }: NavbarProps) => {
    return (
        <nav className="bg-slate-500 flex items-center justify-between gap-8 px-2 h-12 rounded-sm shadow-md">
            {/* Logo */}
            <div className="text-xl font-semibold cursor-pointer flex items-center justify-center">
                <FontAwesomeIcon icon={faClock} />
                <p>PomoTimer</p>
            </div>

            {/* Settings */}
            <button
                type="button"
                aria-label="Open Setting"
                onClick={onOpenSettings}
                className="text-xl flex items-center cursor-pointer p-1 rounded-lg hover:bg-slate-600"
            >
                <FontAwesomeIcon icon={faGear} />
            </button>
        </nav>
    );
};

export default Navbar;
