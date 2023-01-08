import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../../server/common/get-server-auth-session";
import { prisma } from "../../../../server/db/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });
  if (!session) return res.status(401).end();

  await prisma.spySession.update({
    where: {
      id: req.query.sessionId as string,
    },
    data: {
      endTime: new Date(),
    },
  });

  res.status(200).end();
};

export default handler;
