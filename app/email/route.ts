import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const smtpOptions = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };
  try {
    const transporter = nodemailer.createTransport(smtpOptions);
    const data = await request.json();
    console.log("body:", data);
    // const formData = await request.json();

    if (data) {
      await transporter.sendMail({
        from: process.env.SMTP_USER || "willieclassroom@gmail.com",
        to: data.email || "willieyu0123@gmail.com",
        subject: data.subject || "歡迎加入輔大資管大家庭",
        html: data.html || "<h1>歡迎加入輔大資管大家庭</h1>",
      });
      return NextResponse.json({ message: "成功送出信件" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "error" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}