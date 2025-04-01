import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
 
    const { from, to, subject, text } =await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: from,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from,
        to,
        subject,
        text,
      });
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error sending email: ", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 400 });
    }
}