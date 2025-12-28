"use server";
import { signIn, signOut } from "@/auth";

export const loginGithub = async () => {
  await signIn("github", { redirectTo: "/" });
};

export const loginX = async () => {
  await signIn("twitter", { redirectTo: "/" });
};

export const loginGoogle = async () => {
  await signIn("google", { redirectTo: "/" });
};


export const logout = async () => {
  await signOut({ redirectTo: "/auth/signin" });
};
