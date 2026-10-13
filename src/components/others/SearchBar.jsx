export default function SearchBar({ searchTerm, setSearchTerm, id }) {
    
    return (
        <div className="explorer-search">
            <input
                type="text"
                id={id}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por autor, título, editora ou descrição..."
            />
            <button className="search-btn" type="button" aria-label="Buscar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
            </button>
        </div>
    );
}
