import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: "dumooydaf",
    api_key: "329966351888588",
    api_secret: "WDlatzMAsrH7fE-D-XZi1IJ4LTs",
});

export const imageUpload =async (filePath) => {
    try{

        const data = await cloudinary.uploader.upload(filePath);
            console.log("🚀 ~ cloudinary.uploader.upload ~ result:", data)
            return data.secure_url;
        }
        catch(error){
            console.log("🚀 ~ imageUpload ~ error:", error)
            
        }
  
};