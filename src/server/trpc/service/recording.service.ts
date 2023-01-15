import { prisma } from "../../db/client";
import { InfiniteQueryInput } from "../schema/common.schema";
import { infiniteQuery } from "./common.service";
import storage from "../../storage/client";
import { env } from "../../../env/server.mjs";

export const getRecordingById = async (id: string) => {
  return prisma.recording.findFirst({
    where: { id },
  });
};

export const getManyRecordingsForSession = async (
  sessionId: string,
  input: InfiniteQueryInput
) => {
  const [infQuery, getNextCursor] = infiniteQuery("id", input);
  const recordings = await prisma.recording.findMany({
    ...infQuery,
    where: {
      sessionId,
    },
    orderBy: { startTime: "desc" },
  });
  const nextCursor = getNextCursor(recordings);
  return {
    recordings,
    nextCursor,
  };
};

export const createRecordingForSession = async (
  userId: string,
  sessionId: string
) => {
  const recording = await prisma.recording.create({
    data: { sessionId },
  });

  // Return URL where the client can upload the recording
  return storage.createPresignedPost({
    Fields: {
      key: `recording/${userId}/${recording.id}`,
    },
    Conditions: [
      ["content-length-range", 0, 10000000],
      //["starts-with", "$Content-Type", "video/"], //TODO: Add content-type requirement
    ],
    Expires: 30,
    Bucket: env.AWS_S3_BUCKET_NAME,
  });
};

export const getRecordingSignedUrl = async (
  userId: string,
  recordingId: string
) => {
  return storage.getSignedUrlPromise("getObject", {
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: `recording/${userId}/${recordingId}`,
  });
};
