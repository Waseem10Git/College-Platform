import { useContext } from "react";
import UserContext from "../../context/UserContext";
import "./SearchBar.css";

const SearchBar = ({ filter, setFilter, searchText }) => {
    const { isDarkMode } = useContext(UserContext); // Get theme & language from context

    const handleInputChange = (e) => {
        setFilter(e.target.value.toLowerCase());
    };

    return (
        <div className={`SearchBar_container ${isDarkMode ? "dark" : "light"}`}>
            <input
                type="text"
                className={`SearchBar_input ${isDarkMode ? "dark" : "light"}`}
                placeholder={searchText}
                value={filter}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default SearchBar;
