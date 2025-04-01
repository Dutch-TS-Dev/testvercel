// import { Attachment } from "nodemailer/lib/mailer";

// import nodemailer from "nodemailer";
// import path from "path";
// import dotenv from "dotenv";
// dotenv.config({ path: path.resolve(__dirname, "../.env") });

// const { GOOGLE_APP_CODE } = process.env;

// if (!GOOGLE_APP_CODE) {
//   throw new Error("please set your google app code in process.env");
// }

// type MailOptions = {
//   from: string;
//   to: string;
//   subject: string;
//   text: string;
//   attachments: Attachment[];
// };

// let mailOptions: MailOptions = {
//   from: "oavanvelsen@gmail.com",
//   to: "oscar.vanvelsen@gmail.com",
//   subject: "Test Email",
//   text: `


// `,
// };

// const sendMail = (options: MailOptions): void => {
//   // Create a transporter using Gmail service
//   let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: options.from, // Replace with your Gmail address
//       pass: GOOGLE_APP_CODE, // Replace with your Gmail app password
//     },
//   });

//   // Send email
//   console.log("sending email...");
//   transporter.sendMail(mailOptions, (error: any, info: any) => {
//     if (error) {
//       return console.error("Error occurred: ", error);
//     }
//     console.log("Email sent: " + info.response);
//   });
// };


// import { Attachment } from "nodemailer/lib/mailer";
// import nodemailer from "nodemailer";
// import path from "path";
// import dotenv from "dotenv";
// //  dotenv.config({ path: path.resolve(__dirname, "../.env") });
//  dotenv.config({ path: './.env.local' });

// const { GOOGLE_APP_PASSWORD } = process.env;

// console.log(GOOGLE_APP_PASSWORD);
// if (!GOOGLE_APP_PASSWORD) {
//   throw new Error("please set your google app password in process.env");
// }

// type MailOptions = {
//   from: string;
//   to: string;
//   subject: string;
//   text: string;
//   attachments: Attachment[];
// };

// export const sendMail = async (options: MailOptions): Promise<void> => {
//   let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: options.from,
//       pass: GOOGLE_APP_PASSWORD,
//     },
//   });

//   try {
//     console.log("sending email...");
//     let info = await transporter.sendMail(options);
//     console.log("Email sent: " + info.response);
//   } catch (error) {
//     console.error("Error occurred: ", error);
//   }
// };

// // Example usage
// const mailOptions: MailOptions = {
//   from: "teamworkforever2025@gmail.com",
//   to: "oscar.vanvelsen@gmail.com",
//   subject: "Test Email from Jian",
//   text: "This is a test email.",
//   attachments: [],
// };

// sendMail(mailOptions);


import { Attachment } from "nodemailer/lib/mailer";
 type MailOptions = {   from: string;
   to: string;
   subject: string;
   text: string;
   attachments: Attachment[];
 };

 export const sendMail = async (options: MailOptions): Promise<void> => {
  try {
    const response = await fetch("/api/sendMail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    if (response.ok) {
      console.log("Email sent successfully");
    } else {
      console.error("Failed to send email");
    }
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};