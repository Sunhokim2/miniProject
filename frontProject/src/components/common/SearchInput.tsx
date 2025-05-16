import { useState } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (value: string) => void;
  className?: string;
}

const SearchInput = ({
  placeholder = '검색',
  value,
  onChange,
  onSearch,
  className = '',
}: SearchInputProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const clearSearch = () => {
    onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Paper
      component="form"
      className={`flex items-center w-full px-3 py-1 ${className}`}
      elevation={3}
      onSubmit={handleSubmit}
    >
      <InputBase
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="ml-1 flex-1"
        fullWidth
      />
      {value && (
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

export default SearchInput; 