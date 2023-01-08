import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../../server/common/get-server-auth-session";
import sessionEvents, { broadcast } from "../../../../utils/session-events";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });
  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const sessionId = req.query.sessionId as string;

  if (req.method === "POST") {
    const userId = req.cookies.uid;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { to, type, data } = req.body;
    console.log(`Received signal from ${userId} to ${to} of type ${type}`);
    sessionEvents.signal(sessionId, type, userId, to, data);
    return res.status(200).end();
  }

  const userId = session.user.id;
  const uidWithSuffix = sessionEvents.joinSession(sessionId, userId);
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader(
    "Set-Cookie",
    `uid=${uidWithSuffix}; HttpOnly; Path=/; Max-Age=86400`
  );

  req.socket.on("close", () => {
    sessionEvents.leaveSession(sessionId, uidWithSuffix);
  });

  sessionEvents.on("join", (sid: string, uid: string) => {
    if (sid === sessionId && uid !== uidWithSuffix) {
      broadcast(res, "join", { userId: uid });
    }
  });

  sessionEvents.on(
    "signal",
    (sid: string, type: string, from: string, to: string, data: any) => {
      if (sid === sessionId && to === uidWithSuffix) {
        broadcast(res, type, { userId: from, data });
      }
    }
  );

  sessionEvents.on("leave", (sid: string, uid: string) => {
    if (uid === uidWithSuffix) {
      console.log(`Ending session for ${uid}`);
      return res.end();
    }
    if (sid == sessionId) {
      broadcast(res, "leave", { userId: uid });
    }
  });
};

export default handler;
