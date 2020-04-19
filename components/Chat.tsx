import React, { useState } from "react";
import { IGameView } from "../lib/game";
import { useChat, usePlayers, useSendChat, useSelfPlayer } from "../hooks/game";
import classnames from "classnames";
import ChatMessage from "./ChatMessage";
import { EmojiConvertor } from "emoji-js";

const emoji = new EmojiConvertor();

export default () => {
  const chat = useChat();
  const selfPlayer = useSelfPlayer();
  const sendChat = useSendChat();
  const players = usePlayers();
  const [message, setMessage] = useState("");

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setMessage(emoji.replace_colons(e.currentTarget.value));
  };

  const send = () => {
    if (message.trim()) {
      sendChat({
        playerId: selfPlayer.id,
        timestamp: Date.now(),
        message,
      });
      setMessage("");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      send();
    }
  };

  return (
    <div className="border rounded bg-gray-200 w-full h-full flex flex-col text-gray-800 p-1 shadow-md">
      <div className="overflow-y-scroll flex-grow mb-1 border bg-white rounded leading-normal text-sm flex flex-col-reverse">
        {/* we reverse the chat and add a flex-col-reverse to keep the scroll down by default */}
        {chat
          .map((c, i) => (
            <ChatMessage key={i} chat={c} player={players[c.playerId]} />
          ))
          .reverse()}
      </div>
      <div className="flex">
        <input
          className={classnames("flex-grow text-input", {
            "bg-gray-100": !selfPlayer,
            "bg-white": selfPlayer,
          })}
          type="text"
          placeholder={!selfPlayer ? "join game to start chatting" : ""}
          disabled={!selfPlayer}
          value={message}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <button
          className="flex items-center justify-center w-10 h-10 cursor-pointer hover:text-blue-700 focus:outline-none"
          onClick={() => send()}
        >
          <SendIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const SendIcon = (props) => (
  <svg
    {...props}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 448 448"
    fill="currentColor"
  >
    <polygon points="0.213,32 0,181.333 320,224 0,266.667 0.213,416 448,224" />
  </svg>
);
