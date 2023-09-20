import { useEffect, useState } from "react";
import Stars from "./Stars";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];
const url = 'https://movie-database-alternative.p.rapidapi.com/?s=Avengers%20Endgame&r=json&page=1';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '7a1d28eff2mshd0564754f24daefp151268jsnafcdecf85a81',
		'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
	}
};


const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
const KEY = "7a1d28eff2mshd0564754f24daefp151268jsnafcdecf85a81";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const [isSelected, setIsSelected] = useState(null);
  const tempquery = 'interstellar';

  function HandelSelectedId(id) {
    setIsSelected(id);
  }
  function HandelCloseSelectedId() {
    setIsSelected(null);
  }
  useEffect(function () {
    async function fetchMovies() {
      try {
        setIsLoding(true);
        setError('');
        const res = await fetch(url, options);
        if (!res.ok) throw new Error("Something went wrong with fetching movies");
        const data = await res.json();
        if (data.Response === 'False') throw new Error('No movies found . ')
        setMovies(data.Search);
      } catch (err) {
        console.log(err.message);
        setError(err.message);
      } finally {
        setIsLoding(false);
      }
    }
    fetchMovies();
  }, [query])
  return (
    <div>
      <NavBar>
        <Search query={query} setQuery={setQuery}> </Search>
        <NumResult movies={movies}></NumResult>
      </NavBar>
      <Main>
        <Box>
          {/* {
            (isLoding)?<Loader></Loader>:<MovieList movies={movies}></MovieList>
          } */}
          {(isLoding && <Loader />)}
          {(!isLoding && !error && <MovieList selectedId={isSelected} setIsSelected={HandelSelectedId} movies={movies}></MovieList>)}
          {(error && <ErrorMessage message={error}></ErrorMessage>)}
        </Box>
        <Box>
          {
            (!isSelected) ?
              <>
                <WatchedSummary watched={watched}></WatchedSummary>
                <WatchedMovieList watched={watched}></WatchedMovieList>
              </> : <MovieDeltaile id={isSelected} closeID={HandelCloseSelectedId}></MovieDeltaile>
          }
        </Box>
      </Main>
    </div>
  );
}

function MovieDeltaile({ id, closeID }) {
  const [movie, setMovies] = useState({});

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre
  } = movie;
  useEffect(function () {
    async function getMovieDeltaile() {
      const res = await fetch(`https://moviesdatabase.p.rapidapi.com/titles/series/%7BseriesId%7D?apikey=${KEY}&i=${id}`);
      const data = await res.json();
      setMovies(data);
      console.log(data, id);
    }
    getMovieDeltaile();
  }, [])
  console.log(movie);
  return <div className="details">
    <header>
      <button className="btn-back" onClick={() => closeID()} >&larr;</button>
      <img src={poster} alt="image" />
    </header>
    {id}
  </div>;
}

function Loader() {
  return <p className="loader">Loading...</p>
}

function ErrorMessage({ message }) {
  return <p className="error">{message}</p>
}

function NavBar({ children }) {
  return (
    <>
      <nav className="nav-bar">
        <Logo></Logo>
        {children}
      </nav>
    </>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {

  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      ></input>
    </>
  );
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}


function MovieList({ movies, selectedId, setIsSelected }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} selectedId={selectedId} setIsSelected={setIsSelected} ></Movie>
      ))}
    </ul>
  );
}


function Movie({ movie, selectedId, setIsSelected }) {
  return (
    <li onClick={() => setIsSelected(movie.imdbID)} style={{ cursor: 'pointer' }}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie key={movie.imdbID} movie={movie}></WatchedMovie>
      ))}
    </ul>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
