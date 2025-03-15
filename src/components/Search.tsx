'use client';
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { searchMovies } from '@/api/tmdb';
import debounce from 'lodash/debounce';

export interface MovieOption {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

interface SearchProps {
  onSearchComplete: (query: string) => void;
}

// eslint-disable-next-line react/display-name
const Search = forwardRef(({ onSearchComplete }: SearchProps, ref) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<MovieOption[]>([]);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    clearInput() {
      setInputValue('');
    },
  }));

  const debouncedSearch = React.useMemo(() => {
    return debounce(async (query: string) => {
      if (!query) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const data = (await searchMovies(query)) as { results: MovieOption[] };
        const movieOptions = data.results.map((movie: MovieOption) => ({
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          poster_path: movie.poster_path,
        }));
        setOptions(movieOptions);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  useEffect(() => {
    debouncedSearch(inputValue);
    return () => {
      debouncedSearch.cancel();
    };
  }, [inputValue, debouncedSearch]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!loading) {
        onSearchComplete(inputValue);
      }
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) =>
        typeof option === 'string'
          ? option
          : `${option.title} (${new Date(option.release_date).getFullYear()})`
      }
      inputValue={inputValue}
      onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search movies"
          variant="outlined"
          onKeyDown={handleKeyDown}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
});

export default Search;
