import React from "react";
import { IChatMessage, IPlayer, ISystemChatMessage } from "../lib/game";
import classnames from "classnames";
import { motion } from "framer-motion";
import { useChatMessage, usePlayers, useGameView } from "../hooks/game";
import { emoji } from "../lib/emoji";

export default React.memo(({ id }: { id: string }) => {
  const chat: IChatMessage | null = useChatMessage(id);
  const players = usePlayers();
  if (!chat) {
    return null;
  }

  const message = chat.type === 'system'
    ? <SystemChatMessage chat={chat} />
    : <PlayerChatMessage chat={chat} player={players[chat.playerId]} />

  return (
    <motion.div
      className="px-2 pb-1"
      initial={{ y: 50 }}
      animate={{
        y: 0,
        transition: { stiffness: 2, duration: 0.3 },
      }}
    >
      {message}
    </motion.div>
  );
});

const PlayerChatMessage = ({
  chat,
  player,
}: {
  chat: IChatMessage;
  player: IPlayer;
}) => {
  const gameView = useGameView()
  const hasEmojis = gameView.game.options.language === 'emoji'

  return (
    <div className="flex flex-wrap items-center">
      {player && (
        <span
          className={classnames("mr-1 font-bold", {
            "text-red-700": player.team === "red" && player.spymaster,
            "text-blue-700": player.team === "blue" && player.spymaster,
            "text-red-500": player.team === "red" && !player.spymaster,
            "text-blue-500": player.team === "blue" && !player.spymaster,
          })}
        >
          {player.name}
        </span>
      )}

      {/* Handles state backwards compatibility */}
      {!chat.type && (
        <span>{(chat as any).message}</span>
      )}

      {chat.type === 'click' && (
        <>
          <span>clicked on</span>
          {hasEmojis && (
            <span className="emoji-small mx-1" dangerouslySetInnerHTML={{ __html: emoji.replace_unified(chat.word) }} />
          )}
          {!hasEmojis && (
            <span className="ml-1">{chat.word}</span>
          )}
          <span>. {chat.reaction}</span>
        </>
      )}

      {chat.type === 'message' && (
        <>
          <span className="text-gray-700 font-light">:</span>
          <span className="ml-1">{chat.message}</span>
        </>
      )}

      {chat.type === 'hint' && (
        <>
          <span className="text-gray-700 font-light">:</span>
          <span className="ml-1 font-semibold">{chat.hint}</span>
        </>
      )}

      <style jsx global>{`
        .emoji-small > .emoji {
          width: 16px;
          height: 16px;
        }
      `}</style>
    </div>
  );
};

const SystemChatMessage = ({ chat }: { chat: ISystemChatMessage }) => {
  return <span className="text-gray-700 font-semibold">{chat.message}</span>;
};
