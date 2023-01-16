import { env } from "../env/server.mjs";
import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = (opts: SendEmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_SERVER_HOST,
    port: Number(env.EMAIL_SERVER_PORT),
    auth: {
      user: env.EMAIL_SERVER_USERNAME,
      pass: env.EMAIL_SERVER_PASSWORD,
    },
  });

  transporter
    .sendMail({
      from: env.EMAIL_FROM,
      ...opts,
    })
    .catch((err) => {
      console.error(err);
    });
};

interface SendInviteEmailOptions {
  to: string | string[];
  token: string;
  groupName: string;
}

export const sendGroupInvitationEmail = ({
  to,
  token,
  groupName,
}: SendInviteEmailOptions) => {
  const host = env.DEV ? "http://localhost:3000" : "https://woofspy.com";
  sendEmail({
    to,
    subject: `Woofspy invitation to ${groupName}`,
    text: `You have been invited to join the group ${groupName}\nJoin group`,
    html: `<p>You have been invited to join the group ${groupName}</p>
<a href="${host}/api/invitation?token=${token}">Join group</a>`,
  });
};
