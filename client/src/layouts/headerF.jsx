import { useState } from "react";
import { Bell, ChevronsLeft, Search } from "lucide-react";
import profileImg from "@/assets/profile-image.jpg";
import PropTypes from "prop-types";

export const HeaderF = ({ collapsed, setCollapsed, onFactureClientClick }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between dashboard-bg px-4 shadow-md transition-colors">
            <div className="flex items-center gap-x-3 justify-start w-full">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
                <div className="input flex items-center gap-x-2">
                    <Search size={20} className="text-white" />
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search..."
                        className="w-full bg-transparent text-white outline-0 placeholder:text-white"
                    />
                </div>

               
            </div>
            <div className="flex items-center gap-x-3">
                <button className="btn-ghost size-10">
                    <Bell size={20} className="text-white" />
                </button>
                <button className="size-10 overflow-hidden rounded-full">
                    <img
                        src={profileImg}
                        alt="profile image"
                        className="size-full object-cover"
                    />
                </button>
            </div>
        </header>
    );
};

// Ajoute cette ligne pour spécifier les props attendues
HeaderF.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
    onFactureClientClick: PropTypes.func, // Ajoute cette ligne
};
