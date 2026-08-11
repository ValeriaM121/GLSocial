import { prisma, connectDB, disconnectDB } from "../src/config/database.js";

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

main().catch((error)=>{
    console.error(error);
    process.exit(1);
}).finally(async()=> {
    await disconnectDB();
});