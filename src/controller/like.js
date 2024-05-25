
import { modal } from "../models";

export const getByUser = (req, res) => {
  modal?.Post?.find({ userId: req?.me?.userId })
    .then((resData) => {
      res.status(200).send({ data: resData, success: true, message: "" });
    })
    .catch((err) => {
      res.status(400).send(
        { data: null,
          success: false,
          message: err.message });
    });
};

export const getAll = (req, res) => {
  modal?.Post?.find({})
    .then((resData) => {
      res.status(200).send({ data: resData, success: true, message: "" });
    })
    .catch((err) => {
      res.status(400).send(
        { data: null,
         success: false,
         message: err.message });
    });
};

export const LikeDisLike = async (req, res) => {
  let input = req?.body;
  input.userId = req?.me?.userId;

  const existingLike = await modal?.Like?.findOne({
    userId: input.userId,
    postId: input.postId,
  });

  if(existingLike){
    await modal?.Like?.findByIdAndDelete(existingLike._id);
    await modal?.Post?.findByIdAndUpdate(input.postId, {
      $inc: { likeCount: -1 }, 
    });
    res.status(200).send({
      data: null,
      success: true,
      message: "Like removed successfully",
    });
  }
  else{

    modal?.Like?.create(input)
    .then(async (resData) => {
      await modal?.Post?.findByIdAndUpdate(resData.postId, {
        $inc: { likeCount: 1 },
      });
      res.status(200).send(
        { data: resData,
          success: true,
          message: "Create succesfully"
        }
      );
    })
    .catch((err) => {
      res
      .status(400)
      .send({ data: null, success: false, message: err.message });
    });
  }
};