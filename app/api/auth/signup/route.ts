import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password, otp } = await req.json();

  if (!name || !email || !password || !otp) {
    return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
  }

  const record = await prisma.emailOTP.findFirst({
    where: {
      email,
      otp,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) {
    return NextResponse.json(
      { error: "Invalid or expired OTP" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return NextResponse.json({ error: "User Already Exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  await prisma.emailOTP.deleteMany({ where: { email } });

  return NextResponse.json({ success: true });
}
