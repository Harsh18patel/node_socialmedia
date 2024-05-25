import { modal } from "../models";


export const createPost = async (req, res) => {
    try {
        req.body.userId = req?.me?.userId;
        console.log("🚀 ~ createPost ~  req.body.userId:",  req.body);

        const newPost = await modal?.Post.create(req?.body); 

        await modal.User.findByIdAndUpdate(
            req?.me?.userId,
            { $inc: { postCount: 1 } }
        );

        res.status(200).send({
            success: true,
            data: newPost,
            message: "Post created successfully"
        });
    } catch (err) {
        res.status(400).send({
            success: false,
            data: null,
            message: err.message
        });
    }
};



// export const getAllPost = async (req, res) => {
//     try {
//         const { userId } = req.body;
//         console.log("Received userID:", userId);
        
//         if (!userId) {
//           return res.status(400).json({ success: false, message: "User ID is required" });
//         }
    
//         const posts = await modal?.Post?.find({ userId }); // Adjust this query to match your data schema
//         console.log("🚀 ~ getAllPost ~ posts:", posts)
//         res.json({ success: true, data: posts, message: "All posts of the user retrieved successfully" });
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//         res.status(500).json({ success: false, message: "Error fetching posts" });
//       }
// };


export const uploadImage = async (req, res) => {
  try {
    // Assuming the Cloudinary URL is in the req.body.data field
    const cloudinaryURL = req.body.data;
    console.log("🚀 ~ uploadImage ~ cloudinaryURL:", cloudinaryURL)

    
    const { userId } = req.body;

    // Create a new Post instance
    const newPost = new modal.Post({
      postType: 'post', // Assuming it's always a post
      post: cloudinaryURL,
      userId,
    });

    // Save the new post to the database
    const savedPost = await newPost.save();

    res.json({ success: true, data: savedPost, message: "Post created successfully" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, message: "Error creating post" });
  }
};


export const getAllPost = async (req, res) => {
    try {
      const { userId } = req.query; // Change to req.query to get query parameters
      console.log("Received userId:", userId);
      
      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
      }
  
      const posts = await modal?.Post?.find({ userId });
      console.log("🚀 ~ getAllPost ~ posts:", posts);
      res.json({ success: true, data: posts, message: "All posts of the user retrieved successfully" });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ success: false, message: "Error fetching posts" });
    }
  };
  


export const deletePost = (req, res) => {
    modal?.Post.findOneAndDelete({ _id: req?.params?.id, userId: req.me.userId })
      .then((deletedPost) => {
        if (!deletedPost) {
          return res.status(404).send({ success: false, message: "Post not found" });
        }
        res.status(200).send({ data: null, success: true, message: "Post deleted successfully" });
      })
      .catch((err) => {
        res.status(400).send({ data: null, success: false, message: err.message });
      });
};


