import { modal } from "../models";

export const savePost = async (req, res) => {
        let input = req.body;
        input.userId = req.me.userId;

        const postAvailable = await modal.SavePost.findOne(input);

        if (postAvailable) {
                await modal?.SavePost?.findByIdAndDelete(postAvailable._id);
                await modal?.Post?.findByIdAndUpdate(postAvailable.postId);
                res.status(200).send({
                  data: null,
                  success: true,
                  message: "post unsaved successfully",
                });
              }
              else{
                modal.SavePost.create(input)
                  .then((resData)=>{

                      res.status(200).send({
                          data: resData,
                          success: true,
                          message: "Post saved successfully"
                        });
                    })
                    .catch((error) =>{
                        res.status(400).send({
                            data: null,
                            success: false,
                            message: error.message
                        });
                    })
    }
}


export const getAll = (req,res) =>{
    modal?.SavePost?.find({})
    .then((resData) => {
      res.status(200).send({ data: resData, success: true, message: "" });
    })
    .catch((err) => {
      res.status(400).send(
        { data: null,
         success: false,
         message: err.message });
    });
}