import nodeMailer from "nodemailer";
import ejs from "ejs";

const transpoter = nodeMailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "josefina.johns66@ethereal.email",
      pass: "RnKv81JjHPJk2MnxSn",
    },
})

export const emailService = ({from,to,subject,text,html}) => {
   transpoter.sendMail({from,to,subject, text, html});
};



export const otpService = (email)=>{
    const code = Math.trunc(Math.random() * 1000000);
    console.log("--otp--",code);
    
    let path = __dirname + "/otptemplate/otpTemplate.ejs"

    ejs.renderFile(path,{code},(err,res) =>{
      let obj = {
        from:"admin@gmail.com",
        to: email,
        subject: "OTP for login",
        html:res,
      };
      emailService(obj);
    });

    return code;
};
