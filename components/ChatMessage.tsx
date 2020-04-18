import React from "react";
import { IChatMessage, IPlayer } from "../lib/game";
import classnames from "classnames";
import { motion } from "framer-motion";

export default (props: { chat: IChatMessage; player: IPlayer }) => {
  return (
    <motion.div className="px-2 pb-1" initial={{ y: 100 }} animate={{ y: 0 }}>
      {props.player ? (
        <PlayerChatMessage {...props} />
      ) : (
        <SystemChatMessage chat={props.chat} />
      )}
    </motion.div>
  );
};

const PlayerChatMessage = ({
  chat,
  player,
}: {
  chat: IChatMessage;
  player: IPlayer;
}) => {
  return (
    <>
      <span
        className={classnames("mr-1", {
          "text-red-700": player.team === "red",
          "text-blue-700": player.team === "blue",
        })}
      >
        {player.name}
      </span>
      <span className="text-gray-700 font-light">:</span>
      <span className="ml-1">{chat.message}</span>
    </>
  );
};

const SystemChatMessage = ({ chat }: { chat: IChatMessage }) => {
  return <span className="text-gray-700 font-semibold">{chat.message}</span>;
};
