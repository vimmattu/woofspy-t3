import { NextApiResponse } from "next";
import { EventEmitter } from "stream";

export const broadcast = (res: NextApiResponse, event: string, data: any) => {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

class SessionEvents extends EventEmitter {
  private rooms: Map<string, string[]>;

  constructor() {
    super();
    this.rooms = new Map<string, string[]>();
    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.signal = this.signal.bind(this);
  }

  public joinSession(sessionId: string, userId: string) {
    const users = this.rooms.get(sessionId) || [];
    const uidSuffix = users.filter((u) => u.includes(userId)).length || 0;
    const uid = `${userId}-${uidSuffix}`;
    console.log(`Joining session ${sessionId} as ${uid}`);
    users.push(uid);
    this.rooms.set(sessionId, users);
    this.emit("join", sessionId, uid);
    return uid;
  }

  public leaveSession(sessionId: string, userId: string) {
    console.log(`Leaving session ${sessionId} as ${userId}`);
    const users = this.rooms.get(sessionId) || [];
    const index = users.indexOf(userId);
    if (index > -1) {
      users.splice(index, 1);
    }
    this.rooms.set(sessionId, users);
    this.emit("leave", sessionId, userId);
  }

  public signal(
    sessionId: string,
    type: string,
    from: string,
    to: string,
    data: any
  ) {
    this.emit("signal", sessionId, type, from, to, data);
  }
}

export default new SessionEvents();
