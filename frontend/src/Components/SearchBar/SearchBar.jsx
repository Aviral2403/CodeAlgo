// import { useState } from "react";
// import axios from "axios";
// import { IoMdSearch } from "react-icons/io";
// import "./SearchBar.css";

// const SearchBar = () => {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);

//   const handleSearch = async () => {
//     try {
//       const response = await axios.get("/api/questions/search", {
//         params: { query }, // Pass query as parameter
//       });
//       setResults(response.data);
//     } catch (error) {
//       console.error("Error fetching search results:", error);
//     }
//   };

//   return (
//     <div className="search-container">
//       <div className="input-box">
//         <input
//           className="search-input"
//           type="text"
//           placeholder="Search A Question or Topic"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <p className="search-icon" onClick={handleSearch}>
//           <IoMdSearch />
//         </p>
//       </div>
//       <div className="search-results">
//         {results.map((question) => (
//           <div key={question._id} className="result-item">
//             <h4>{question.titleSm}</h4>
//             <p>{question.difficulty}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SearchBar;


import { useState } from "react";
import axios from "axios";
import { IoMdSearch } from "react-icons/io";
import "./SearchBar.css";

const SearchBar = ({ onSearchResults }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) {
      onSearchResults(null);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/api/questions/search`, {
        params: {
          query: query.trim()
        }
      });
      
      if (response.data) {
        onSearchResults(response.data);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      onSearchResults([]);
    }
  };

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (!newQuery.trim()) {
      onSearchResults(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <div className="input-box">
        <input
          className="search-input"
          type="text"
          placeholder="Search A Question or Topic"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <p className="search-icon" onClick={handleSearch}>
          <IoMdSearch />
        </p>
      </div>
    </div>
  );
};

export default SearchBar;