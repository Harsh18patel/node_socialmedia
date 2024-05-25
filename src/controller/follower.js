import { modal } from "../models";


// ------ follow ----------

export const sendRequest = async(req,res)=>{
    let input = req?.body;
    input.senderId = req?.me?.userId;

    let match = await modal?.Follower.findOne(input);
    console.log("🚀 ~ sendRequest ~ match:", match)
    if(match) {
        return res.status(400).send({
            data: null,
            message: "Request already sent",
            success: false
        });
    };

    const user = await modal?.User?.findById(input.reciverId);
    console.log("🚀 ~ sendRequest ~ user:", user)

    if (!user) {
        return res.status(404).send({
            data: null,
            message: "User not found",
            success: false
        });
    }

    if(user.isPrivate) 
    user.followers = user.followers + 1;
    await user.save();

    input.status = "accepted";
    user.following = user.following + 1;
    await user.save();
    
    modal.Follower.create(input)
    .then((resData)=>{
        res.status(200).send({
            data:resData,
            message:"create succefully",
            success: true
        })
    })
    .catch((err)=>{
        res.status(400).send({
            data:null,
            message:err.message,
            success:false
        })
    })
}


// ----------- unfollow ---------
export const unFollow = async(req,res)=>{
    try {
        let input = req?.body;
        input.senderId = req?.me?.userId;

        // Find and delete the existing follower relationship
        const deletedFollower = await modal?.Follower.findOneAndDelete(input);
        if(!deletedFollower) {
            return res.status(400).send({
                data: null,
                message: "You are not following this user",
                success: false
            });
        };

        // Find the user being unfollowed
        const user = await modal?.User?.findById(input.reciverId);
        if (!user) {
            return res.status(404).send({
                data: null,
                message: "User not found",
                success: false
            });
        }

        if(user.isPrivate && user.followers > 0 ) {
             user.followers -= 1;
            await user.save();
        }

        const currentUser = await modal?.User?.findById(input.senderId);
        if (!currentUser) {
            return res.status(404).send({
                data: null,
                message: "User not found",
                success: false
            });
        }

        if (currentUser.following > 0) {
            currentUser.following -= 1;
            await currentUser.save();
        }

        return res.status(200).send({
            data: null,
            message: "Unfollowed successfully",
            success: true
        });
    } catch (err) {
        return res.status(400).send({
            data: null,
            message: err.message,
            success: false
        });
    }
}

export const getFollowerandFollowing = async (req, res) => {
    try {
        const { userId } = req.body;

        const following = await modal?.Follower?.find({
            senderId: userId,
            status: "accepted"
        });
        console.log("🚀 ~ getFollowerandFollowing ~ following:", following)

        const followers = await modal?.Follower?.find({
            reciverId: userId,
            status: "accepted"
        });
        console.log("🚀 ~ getFollowerandFollowing ~ followers:", followers)

        res.status(200).send({
            following: following,
            followers: followers, 
            message: "Followers and Following found successfully",
            success: true
        });
    } catch (error) {
        res.status(400).send({
            following: null,
            followers: null,
            message: error.message,
            success: false
        });
    }
};


