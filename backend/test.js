const title="The Handmaiden (아가씨)"

const tmdbId=214942
const response = await fetch(
  //`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}`,
  `https://api.themoviedb.org/3/tv/${encodeURIComponent(tmdbId)}`,
  {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNzBiYjA4NmQ5NTg4ZDZhYmQxMzhmNTU4OGIwZGVhMCIsIm5iZiI6MTc4NjM5NzA0MC4yNDcsInN1YiI6IjZhN2E0MTcwM2Y2M2JiMmU4NDkyYjI4YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kOPpE8eGV6dPTSoK6JYGxcEhiUmfVhcJImx2meXOUZU`,
    },
  }
);

const data = await response.json();

//console.log(data.results);
console.log(data);
console.log(data.genres);
const genreId= {
    28: "Action",
    12: "Adventure",
    16: "Animcation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romeance",
    878: "Science Fiction",
    53: "Thriller",
    10752: "War",
    37: "Western"
}
const genres = data.genres.map((g) => genreId[g.id] ?? "Drama");
console.log(genres);
console.log(typeof Number(data.first_air_date.substring(0,4)));
