import { prisma } from "../config/database.js"

const addShowWatchList = async(req,res) =>{
    try {
        const userId = req.user.id;
        const { show } = req.body;
        
        if(Array.isArray(show) && show.length === 0){
            return res.status(400).json({message: "Some required information is missing"});
        };
        if(!show){
            return res.status(400).json({message: "Some required information is missing"});
        }



        if(Array.isArray(show)){
            const showIDs = show.map(item => item.showID);
            const watchListShows = await prisma.show.findMany({
                where: {
                    id: {
                        in: showIDs
                    }
                },
                select: {
                    id:true
                }
            });

            const existingIDs = new Set (watchListShows.map((item)=> item.id));
            const invalidShows = showIDs.filter(id=> !existingIDs.has(id));
            
            if(invalidShows.length > 0){
                return res.status(400).json({message: "One or more shows doesn't exists"});
            }

            await prisma.watchlistShowsItem.createMany({
                data: show.map(item=>({
                    userID: req.user.id,
                    showID: item.showID,
                    status: item.status
                })),
                skipDuplicates: true
            });
            return res.status(201).json({message: "Successfully added shows"});
            
        }else{
            if(!show.id){
                return res.status(400).json({message: "Something is missing"});
            }
            const showExists = await prisma.show.findUnique({
                where: {id: show.id}
            });

            if(!showExists){
                return res.status(400).json({message:"Show not found"});
            }

            
            const userWatchList = await prisma.watchlistShowsItem.create({
                data:{
                    userID: req.user.id,
                    showID: show.id,
                    status: show.status
                }
            })
            return res.status(201).json({ message: `Success in adding ${showExist.title} to the watchList`, info: userWatchList})
        }
    } catch (error) {
        console.error(`Failed to add shows to watchlist: ${error}`);
        return res.status(500).json({message: "Failed adding shows to watchlist"});
    }
    /*try {
        const userId = req.user.id;
        const { showId, status } = req.body;

        if(!userId, !showId, !status){
            return res.status(400).json({message: "Some required information is missing"});
        }

        const userExist = await prisma.user.findUnique({
            where: {id: userId}
        });
        if(!userExist){
            return res.status(400).json({message: "This user doesn't exists"});
        }
        const showExist = await prisma.show.findUnique({
            where: {id: showId}
        });

        if(!showExist){
            return res.status(400).json({message: "Show doesn't exists"});
        }

        try{
            const userWatchList = await prisma.watchlistShowsItem.create({
                data:{
                    userID: req.user.id,
                    showID,
                    status
                }
            })
            return res.status(201).json({ message: `Success in adding ${showExist.title} to the watchList`, info: userWatchList})
        }catch(error){
            if(error instanceof prisma.PrismaClientKnownRequestError && error.code === "P2002"){
                return res.status(409).json({message: "Already in watchlist"});
            }
            return res.status(500).json({message: "Failed to add show to watchlist in database"})
        }

    } catch (error) {
        console.error(`Failed to add show to watchlist: ${error}`)
        return res.status(500).json({message: "Failed to add show to watchlist. Please try later"});
    }*/
}


const getShowWatchList = async(req,res) =>{
    try {
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({message: "Some required information is missing"});
        }

        const watchListShows = await prisma.watchlistShowsItem.findMany({
            where:{
                userID: userId
            },
            include:{
                show:true
            }
        });
        
        if(watchListShows.length === 0){
            return res.status(200).json({message: "No shows in watchlist"});
        }

        return res.status(200).json({message: "Got user's watchlist successfully", watchList: watchListShows});


    } catch (error) {
        console.error(`Failed getting user's watchlist: ${error}`);
        return res.status(500).json({message: "Unable to get watchlist. Try again later"});
    }
}

const updateWatchList = async(req,res) =>{
    try {
        const userId = req.user.id;
        const { showId } = req.params.showId;
        const { status } = req.body;

        if(!userId || !showId || !status || !watchListId){
            return res.status(400).json({message: "Some required information is missing"});
        }

        if(status !== "PLANNED" || status !== "WATCHING" || status !== "COMPLETED" || status !== "DROPPED"){
            return res.status(400).json({message: "Incorrect status"});
        }
        
        const userExist = await prisma.user.findUnique({
            where: {id: userId}
        });
        if(!userExist){
            return res.status(400).json({message: "This user doesn't exists"});
        }
        const showExist = await prisma.show.findUnique({
            where: {id: showId}
        });

        if(!showExist){
            return res.status(400).json({message: "Show doesn't exists"});
        } 

        const findShow = await prisma.watchlistShowsItem.findUnique({
            where: {
                userID_showID:{
                    userID: userId,
                    showID: showId
                }
            }
        })

        if(!findShow){
            return res.status(400).json({message: "This show is not in the list"});
        }
        try {
            const updatedList = await prisma.watchlistShowsItem.update({
                where:{
                    id: findShow.id
                },
                data:{
                    status
                }
            });
            return res.status(200).json({message: "Success in updating watchlist", list: updatedList});
        } catch (error) {
            return res.status(400).json({message: "Failed to update database with new update"});
        }
    

    } catch (error) {
        console.error(`Failed to update show in watchlist: ${error}`);
        return res.status(500).json({message: "Failed to update. Please try again later"});
    }
}

const deleteWatchList = async(req,res) =>{
    try {
        const userId = req.user.id;
        const { showId } = req.params.showId;

        if(!userId || !showId){
            return res.status(400).json({message: "There's some required information that's missing."});
        }

        const userExist = await prisma.user.findUnique({
            where: {id: userId}
        });
        if(!userExist){
            return res.status(400).json({message: "Couldn't find user"});
        }
        const showExist = await prisma.show.findUnique({
            where: {id: showId}
        })
        if(!showExist){
            return res.status(400).json({message: "Couldn't find show"});
        }

        const findShow = await prisma.watchlistShowsItem.findUnique({
            where: {
                userID_showID:{
                    userID: userId,
                    showID: showId
                }
            }
        })
        if(!findShow){
            return res.status(400).json({message: "This show isn't in your watchlist"});
        }
        try {
            await prisma.watchlistShowsItem.delete({
                where: {id: findShow.id}
            });
            return res.status(200).json({message: "Success in removing show from watchlist"});
        } catch (error) {
            return res.status(400).json({message: "Failed to delete show from watchlist"});
        }


    } catch (error) {
        console.error(`Failed to remove show from watchlist: ${error}`);
        return res.status(500).json({message: "Failed to remove show from watchlist. Please try again later."});
    }
}

export{
    addShowWatchList,
    getShowWatchList,
    updateWatchList,
    deleteWatchList
}