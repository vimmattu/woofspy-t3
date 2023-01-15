import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });
  if (!session || !session.user) return res.redirect("/auth/signin");

  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  if (typeof req.query.token !== "string")
    return res.status(400).json({ error: "Bad request" });

  const invitation = await prisma.invitationToGroup.findFirst({
    where: {
      token: req.query.token,
    },
  });
  if (!invitation) return res.status(404).json({ error: "Not found" });
  if (invitation.expires < new Date())
    return res.status(400).json({ error: "Invitation expired" });

  const user = await prisma.user.findFirst({
    where: {
      email: invitation.email,
    },
  });

  if (user?.id !== session.user.id)
    return res.status(403).json({ error: "Forbidden" });

  await Promise.all([
    prisma.group.update({
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
    }),
    prisma.invitationToGroup.update({
      where: {
        token: invitation.token,
      },
      data: {
        expires: new Date(),
      },
    }),
  ]);

  return res.redirect("/");
};

export default handler;
