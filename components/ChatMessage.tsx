import React from "react";
import {
  IChatMessage,
  IPlayer,
  IPlayerJoinedChatMessage,
  IGameCreatedChatMessage,
} from "../lib/game";
import classnames from "classnames";
import { motion } from "framer-motion";
import { useChatMessage, usePlayers, useGameView } from "../hooks/game";
import { emoji } from "../lib/emoji";
import { useTranslation } from "react-i18next";

export default React.memo(({ id }: { id: string }) => {
  const chat: IChatMessage | null = useChatMessage(id);
  const players = usePlayers();
  if (!chat) {
    return null;
  }

  const message =
    chat.type === "player-joined" ? (
      <PlayerJoinedChatMessage chat={chat} />
    ) : chat.type === "game-created" ? (
      <GameCreatedChatMessage chat={chat} />
    ) : (
      <PlayerChatMessage chat={chat} player={players[chat.playerId]} />
    );

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
  const gameView = useGameView();
  const hasEmojis = gameView.game.options.language === "emoji";
  const { t } = useTranslation();
  return (
    <div>
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
      {!chat.type && <span>{(chat as any).message}</span>}

      {chat.type === "click" && (
        <>
          <span>{t("clicked-on", "Clicked on")}</span>
          {hasEmojis && (
            <span
              className="emoji-small mx-1"
              dangerouslySetInnerHTML={{
                __html: emoji.replace_unified(chat.word),
              }}
            />
          )}
          {!hasEmojis && <span className="ml-1 font-bold">{chat.word}</span>}
          <span>. {t(chat.reaction)}</span>
        </>
      )}

      {chat.type === "message" && (
        <>
          <span className="text-gray-700 font-light">:</span>
          <span className="ml-1">{chat.message}</span>
        </>
      )}

      {chat.type === "hint" && (
        <>
          <span className="text-gray-700 font-light">:</span>
          <span className="ml-1 font-bold">{chat.hint}</span>
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

const PlayerJoinedChatMessage = ({
  chat,
}: {
  chat: IPlayerJoinedChatMessage;
}) => {
  const { t } = useTranslation();
  return (
    <span className="text-gray-700 font-semibold">
      {chat.playerName} {t("just-joined", "joined the game!")}
    </span>
  );
};

const GameCreatedChatMessage = ({
  chat,
}: {
  chat: IGameCreatedChatMessage;
}) => {
  const { t } = useTranslation();
  return (
    <span className="text-gray-700 font-semibold">
      {t("game-created", "The game was created.")}
    </span>
  );
};
