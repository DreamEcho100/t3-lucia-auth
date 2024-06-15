import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { db } from "~/server/db";
import { emailsVerifications } from "~/server/db/schema";
import { eq } from "drizzle-orm";

// * Gmail SMTP server address: smtp.gmail.com
// * Gmail SMTP name: Your full name
// * Gmail SMTP username: Your full Gmail address (e.g. you@gmail.com)
// * Gmail SMTP password: The password that you use to log in to Gmail
// * Gmail SMTP port (TLS): 587
// * Gmail SMTP port (SSL): 465

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

/**
 * @param {{
 * 	to: string;
 * 	subject: string;
 * 	html: string;
 * }} options
 */
export async function sendEmail(options) {
  await transporter.sendMail({
    from: `"ugur" <${process.env.GMAIL_USER}>`, // sender address
    to: options.to, // list of receivers
    subject: options.subject, // Subject line
    html: options.html, // html body
  });
}

/** @param {{ userId: string; email: string; code: string; env: import("../types").AuthNeededEnv }} data */
function signEmailVerificationTokenData(data) {
  return jwt.sign(data, data.env.JWT_SECRET, {
    expiresIn: "5m",
  });
}
/**
 * @param {string} token
 * @param {string} secret
 */
export function verifyEmailVerificationToken(token, secret) {
  return /** @type {{ userId: string; email: string; code: string; env: import("../types").AuthNeededEnv }} */ (
    jwt.verify(token, secret)
  );
}
/** @param {{ userId: string; email: string; code: string; env: import("../types").AuthNeededEnv }} data */
export async function generateEmailVerificationToken(data) {
  const code = Math.random().toString(36).substring(2, 8);

  await db
    .update(emailsVerifications)
    .set({ code, sentAt: new Date() })
    .where(eq(emailsVerifications.userId, data.userId));

  return signEmailVerificationTokenData({
    userId: data.userId,
    email: data.email,
    code,
    env: data.env,
  });
}
