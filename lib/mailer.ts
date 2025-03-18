import { Attachment } from "nodemailer/lib/mailer";

import nodemailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { GOOGLE_APP_CODE } = process.env;

if (!GOOGLE_APP_CODE) {
  throw new Error("please set your google app code in process.env");
}

type MailOptions = {
  from: string;
  to: string;
  subject: string;
  text: string;
  attachments: Attachment[];
};

let mailOptions: MailOptions = {
  from: "oavanvelsen@gmail.com",
  to: "oscar.vanvelsen@gmail.com",
  subject: "Test Email",
  text: `


`,
};

const sendMail = (options: MailOptions): void => {
  // Create a transporter using Gmail service
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: options.from, // Replace with your Gmail address
      pass: GOOGLE_APP_CODE, // Replace with your Gmail app password
    },
  });

  // Send email
  console.log("sending email...");
  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      return console.error("Error occurred: ", error);
    }
    console.log("Email sent: " + info.response);
  });
};
