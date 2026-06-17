"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Buscar por nombre o SKU...",
  className,
}: SearchBarProps) {
  const [query, setQuery] = React.useState("");

  const onSearchRef = React.useRef(onSearch);
  
  React.useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Debounce the user input to prevent excessive re-rendering of catalog grids
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onSearchRef.current(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Search className="h-4 w-4 text-text-muted" />
      </div>
      <input
        type="text"
        className="block w-full rounded-full border border-hairline bg-canvas-card py-3 pl-10 pr-10 text-base sm:text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 outline-none focus:border-accent-electric focus:ring-1 focus:ring-accent-electric/25"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
