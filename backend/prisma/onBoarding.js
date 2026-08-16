import { prisma, connectDB, disconnectDB } from "../src/config/database.js";

const showsTMDBID = [214942,155513,253710,252621,238754,291161,307420,282471,258447,216937,257788,312583,278138,237330,284488,283353,95620,135422];

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

/*
Might keep this just if i want to keep my overviews and change it to my database.
const shows = [
    {
        title: "GAP: The Series",
        overview: "Mon, a newly graduated student from university, starts to intern at the company where the CEO is her childhood crush, Sam. She has known Sam before but never really got to know her until now.",
        releaseYear: 2022,
        genres: ["Coming-of-age", "Romantic Comedy", "Drama", "Romance", "Thai"],
        episodes: 12,
        posterURL: "https://media.themoviedb.org/t/p/w116_and_h174_face/1NY4rLU5MQDMEzd9kZWKFgNCR8R.jpg",
        createdBy: "Admin",
        createdAt: new Date(),
    },
    {
        title: "The Secret of Us",
        overview: "Dr. Fahlada crosses paths with Earn, her ex. After a disastrous breakup their love rekindles but there's still some questions about what happened.",
        releaseYear: 2024,
        genres: ["Drama", "Romance", "Thai"],
        episodes: 8,
        posterURL: "https://media.themoviedb.org/t/p/w600_and_h900_face/3GjOfzt4QO0W6TZrNmtxYz1iRuV.jpg",
        createdBy: "Admin",
        createdAt: new Date()
    },
    {
        title: "US",
        overview: "An eighteen year old girl named Dorak is a part timer at a coffee shop. She meets a girl named Pam who's a dentist student. As she gets to know her she develops a crush on her. But her brother goes to the same university as Pam and asks Dorak for her help and she accepts. As time goes on, her feelings keep developing and she can no longer ignore them.",
        releaseYear: 2025,
        genres: ["Drama", "Romance"],
        episodes: 12,
        posterURL: "https://media.themoviedb.org/t/p/w600_and_h900_face/qAI0WVu9LuXhzX1pgz5NbuhSypZ.jpg",
        createdBy: "Admin",
        createdAt: new Date()
    },
    {
        title:"23.5",
        overview: "Ongsa is a high schooler who only has 2 friends. She's usually online and not the most popular. She realizes the girl she has a crush on goes to her school. Catch is that she is the popular girl. Ongsa with the attempts to get closer to her fakes being a guy online named Earth. But as feelings develop she questions if she should reveal her identity.",
        releaseYear:2024,
        genres: ["Comedy", "Romance"],
        episodes: 12,
        posterURL: "https://media.themoviedb.org/t/p/w116_and_h174_face/i8QONrHrhjV9TfiRe3VkVORZlrX.jpg",
        createdBy: "Admin",
        createdAt: new Date()
    }
]
    const main = async() =>{
    await connectDB();
    console.log("Adding shows...");
    for(const show of shows){
        await prisma.show.create({
            data: show,
        });
        console.log(`Created show: ${show.title}`);
    }
    console.log("Completed adding shows for onboarding");
}
*/
const main = async() =>{
    await connectDB();
    console.log("Adding shows...");
    for(let i = 0; i < showsTMDBID.length; i++){
        const tmdbId = showsTMDBID[i];

        const response = await fetch(
            `https://api.themoviedb.org/3/tv/${encodeURIComponent(tmdbId)}`,
            {
                headers: {Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`}
            }
        )
        if(!response.ok){
            console.log(`Could not reach TMDB show ${tmdbID}`);
            continue;
        }

        const data = await response.json();
        console.log(data);


        const specificGenres = data.genres.map((g) => genreId[g.id] ?? "Drama");
        const givenReleaseYear = Number((data.first_air_date ?? "").slice(0, 4) || 0);

        const show = await prisma.show.create({
            data:{
                tmdbId: tmdbId,
                title: data.name,
                originalTitle: data.original_name,
                overview: data.overview,
                releaseYear: givenReleaseYear,
                genres: specificGenres,
                seasons: data.number_of_seasons,
                episodes: data.number_of_episodes ?? 0,
                posterURL: data.poster_path,
                createdBy: "Admin",
                isGL: true,
            }
        })

        await prisma.onboardingShow.create({
            data: {
                showId: show.id,
                position: i + 1
            }
        })

        console.log(`Added : ${show.title}`);
    }

    console.log("Completed adding shows for onboarding");
}

main().catch((error)=>{
    console.error(error);
    process.exit(1);
}).finally(async()=> {
    await disconnectDB();
});