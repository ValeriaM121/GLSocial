import { prisma } from "../config/database.js"

const getOnBoarding = async(req,res) =>{
    try{
        const onBoardingShows = await prisma.onboardingShow.findMany({
            where:{
                active: true
            },
            orderBy:{
                position: "asc"
            },
            include: {
                show:true
            }
        })
        return res.status(200).json({message: "Success getting Onboarding shows", data: onBoardingShows});
    }catch(error){
        console.error(`Failed to get onBoarding shows: ${error}`);
        return res.status(500).json({message: `Something went wrong with the server. Try again later`});
    }
}

export {getOnBoarding}