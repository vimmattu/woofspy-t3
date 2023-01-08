import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { pusherClient } from "../../../server/pusher/client";

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (!session || !session.user) {
    return res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }

  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const suffix = Math.random().toString(36).substring(7);
  const userId = session.user.id + suffix;

  const user = {
    user_id: userId,
    user_info: { userId },
  };
  const response = pusherClient.authorizeChannel(socketId, channel, user);
  return res.send(response);
};

export default restricted;
