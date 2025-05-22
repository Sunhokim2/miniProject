import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

interface Filter {
  id: string;
  label: string;
}

interface FilterChipsProps {
  filters: Filter[];
  selectedFilters: string[];
  onToggle: (filterId: string) => void;
}

const FilterChips = ({ filters, selectedFilters, onToggle }: FilterChipsProps) => {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
      {filters.map((filter) => (
        <Chip
          key={filter.id}
          label={filter.label}
          color={selectedFilters.includes(filter.id) ? "primary" : "default"}
          variant={selectedFilters.includes(filter.id) ? "filled" : "outlined"}
          onClick={() => onToggle(filter.id)}
          className="cursor-pointer"
        />
      ))}
    </Stack>
  );
};

export default FilterChips; 