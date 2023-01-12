import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (typeof req.query.token !== "string") {
    return res.status(400).json({ error: "Bad request" });
  }

  const invitation = await prisma.invitationToGroup.findFirst({
    where: {
      token: req.query.token,
    },
  });

  if (!invitation) {
    return res.status(404).json({ error: "Not found" });
  }

  if (invitation.expires < new Date()) {
    return res.status(400).json({ error: "Invitation expired" });
  }

  let user = await prisma.user.findFirst({
    where: {
      email: invitation.email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: invitation.email,
      },
    });
  }

  if (!user) return res.status(500).json({ error: "Internal server error" });

  await prisma.group.update({
    where: {
      id: invitation.groupId,
    },
    data: {
      users: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  return res.redirect("/");
};

export default handler;
