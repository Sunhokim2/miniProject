import { useState } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  const clearSearch = () => {
    setKeyword('');
  };

  return (
    <Paper
      component="form"
      elevation={3}
      className="flex items-center w-full px-3 py-1"
      onSubmit={handleSubmit}
    >
      <InputBase
        placeholder="맛집 검색"
        fullWidth
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="ml-1 flex-1"
      />
      {keyword && (
        <IconButton 
          size="small" 
          aria-label="clear" 
          onClick={clearSearch}
          className="text-gray-500"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
      <IconButton 
        type="submit" 
        aria-label="search"
        className="text-primary"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar; 