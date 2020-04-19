import { ITurn, IPlayer, ICardView, ClassicGridItem } from "../lib/game";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import classnames from "classnames";

const Card = ({
  pushTurn,
  selfPlayer,
  cardView,
  index,
}: {
  pushTurn: (turn: ITurn) => void;
  selfPlayer: IPlayer;
  cardView: ICardView;
  index: number;
}) => {
  const [w, setW] = useState(cardView);
  const [revealing, setRevealing] = useState<boolean>(false);

  useEffect(() => {
    if (cardView.revealed && !w.revealed) {
      setRevealing(true);
      setTimeout(() => setRevealing(false), 300);
    }

    setW(cardView);
  }, [w, cardView]);

  const colorStyles = {
    "z-40": revealing,
    "border cursor-pointer": !w.revealed,
    "border-4": w.revealed,
    "border-gray-600 hover:bg-gray-100": !w.shown,
    "border-red-800 bg-red-700 text-red-300":
      w.revealed && w.shown && w.color === ClassicGridItem.Red,
    "border-blue-800 bg-blue-700 text-blue-300":
      w.revealed && w.shown && w.color === ClassicGridItem.Blue,
    "border-yellow-800 bg-yellow-100 text-yellow-800":
      w.revealed && w.shown && w.color === ClassicGridItem.Neutral,
    "border-gray-800 bg-gray-800 text-gray-200":
      w.revealed && w.shown && w.color === ClassicGridItem.Black,
    "border-red-800 bg-red-200 text-red-900 hover:bg-red-300":
      !w.revealed && w.shown && w.color === ClassicGridItem.Red,
    "border-blue-800 bg-blue-200 text-blue-900 hover:bg-blue-300":
      !w.revealed && w.shown && w.color === ClassicGridItem.Blue,
    "border-yellow-800 bg-yellow-100 text-yellow-800 hover:bg-yellow-200":
      !w.revealed && w.shown && w.color === ClassicGridItem.Neutral,
    "border-black bg-gray-700 text-gray-100 hover:bg-gray-600":
      !w.revealed && w.shown && w.color === ClassicGridItem.Black,
  };

  const variants = {
    initial: { scale: 1 },
    revealing: { scale: 1.1 },
  };

  return (
    <div className="relative h-12 overflow-visible">
      <motion.div
        variants={variants}
        initial="initial"
        animate={revealing ? "revealing" : "initial"}
        onClick={() => {
          if (!w.revealed && selfPlayer) {
            pushTurn({
              type: "click",
              value: index,
              from: selfPlayer.id,
            });
          }
        }}
        className={classnames(
          "font-bold rounded flex flex-col items-center justify-center absolute w-full h-full",
          colorStyles
        )}
      >
        {w.word}
      </motion.div>
    </div>
  );
};

export default Card;
