import React from "react";
import StreamIframe from "./StreamIframe.jsx";
import TwitchChat from "./TwitchChat.jsx";

const Dashboard = () => {
  const channelName = "elBokeron";
  const parentDomain = "localhost";
  const youtube = "jfKfPfyJRdk";

  const youtubeStreamUrl = `https://www.youtube.com/embed/${youtube}?autoplay=1&mute=1&modestbranding=1&rel=0`;
  const youtubeChat = `https://www.youtube.com/live_chat?v=${youtube}&embed_domain=${parentDomain}`;

  const twitchStreamUrl = `https://player.twitch.tv/?channel=${channelName}&parent=${parentDomain}`;
  const twitchChaturl = `https://www.twitch.tv/embed/${channelName}/chat?parent=${parentDomain}`;

  return (
    <div className="min-h-screen w-full bg-gray-100 p-10">
      <div className="mb-6">
        <h1 className="m-0 text-[28px] font-bold text-gray-900">
          Directo Actual
        </h1>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[7fr_3fr]">
        <div className="flex flex-col gap-5">
          <div className="overflow-hidden rounded-2xl bg-black shadow-lg">
            <StreamIframe
              src={youtubeStreamUrl}
              height="500"
              width="100%"
              frameBorder="0"
              title="Directo de YouTube"
              allowFullScreen={true}
            />
          </div>
        </div>
        <div className="h-full">
          <div className="h-[600px] rounded-2xl bg-white p-5 shadow-md">
            <div className="h-full w-full">
              <StreamIframe
                src={youtubeChat}
                height="100%"
                width="100%"
                frameBorder="0"
                title="Chat de YouTube"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
