import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { MainContentContainer } from "../../components/MainContentContainer";
import { useSpyMode } from "../../hooks/spy";

const SpyView = dynamic(() => import("../../components/sections/Spy/SpyView"), {
  ssr: false,
});
const GuestView = dynamic(
  () => import("../../components/sections/Spy/GuestView"),
  {
    ssr: false,
  }
);

export default function SpyPage() {
  const [isHost] = useSpyMode();
  const { query } = useRouter();

  const sessionId = query.sessionId as string;

  return (
    <MainContentContainer variant="spy">
      {isHost ? (
        <SpyView sessionId={sessionId} />
      ) : (
        <GuestView sessionId={sessionId} />
      )}
    </MainContentContainer>
  );
}
