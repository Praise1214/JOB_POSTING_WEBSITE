import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  //Read Email from request Body
  const { email } = await req.json();

  //return email required if no email
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  //Generate a 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  //Delete Old OTPs for this email
  await prisma.emailOTP.deleteMany({ where: { email } });

  //save neww OTP to the database
  await prisma.emailOTP.create({
    data: {
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
    },
  });

  //send OTP Email
  await transporter.sendMail({
    from: `"FluxJobs" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your FluxJobs OTP",
    html: `<h2>Your OTP is: <b>${otp}</b></h2><p>Expires in 10 minutes.</p>`,
  });
  return NextResponse.json({ success: true });
}
