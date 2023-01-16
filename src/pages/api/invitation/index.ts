import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";
import {
  acceptInvitationByToken,
  addUserToGroup,
  deleteInvitation,
  getInvitationByToken,
} from "../../../server/trpc/service/group.service";

// TODO: refactor
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  if (typeof req.query.token !== "string")
    return res.status(400).json({ error: "Bad request" });

  const invitation = await getInvitationByToken(req.query.token);
  if (!invitation) return res.status(404).json({ error: "Not found" });
  // if (invitation.expires < new Date())
  //   return res.status(400).json({ error: "Invitation expired" });

  const session = await getServerAuthSession({ req, res });
  if (!session || !session.user) {
    await acceptInvitationByToken(req.query.token);
    return res.redirect("/auth/signin");
  }

  const user = await prisma.user.findFirst({
    where: {
      email: invitation.email,
    },
  });

  if (user?.id !== session.user.id)
    return res.status(403).json({ error: "Forbidden" });

  await Promise.all([
    addUserToGroup(user.id, invitation.groupId),
    deleteInvitation(req.query.token),
  ]);

  return res.redirect("/");
};

export default handler;
