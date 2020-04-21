import { ITurn, IPlayer, ICardView, ClassicGridItem, Color } from "../lib/game";
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
    "border-gray-600 bg-gray-200 hover:bg-gray-100": !w.shown,
    "border-red-800 bg-red-700 text-red-300":
      w.revealed && w.shown && w.color === Color.Red,
    "border-blue-800 bg-blue-700 text-blue-300":
      w.revealed && w.shown && w.color === Color.Blue,
    "border-yellow-800 bg-yellow-100 text-yellow-800":
      w.revealed && w.shown && w.color === Color.Neutral,
    "border-black bg-gray-800 text-gray-200":
      w.revealed && w.shown && w.color === Color.Black,
    "border-green-800 bg-green-700 text-green-300":
      w.revealed && w.shown && w.color === Color.Green,
    "border-red-800 bg-red-200 text-red-900 hover:bg-red-300":
      !w.revealed && w.shown && w.color === Color.Red,
    "border-blue-800 bg-blue-200 text-blue-900 hover:bg-blue-300":
      !w.revealed && w.shown && w.color === Color.Blue,
    "border-yellow-800 bg-yellow-100 text-yellow-800 hover:bg-yellow-200":
      !w.revealed && w.shown && w.color === Color.Neutral,
    "border-black bg-gray-700 text-gray-100 hover:bg-gray-600":
      !w.revealed && w.shown && w.color === Color.Black,
    "border-green-800 bg-green-200 text-green-800 hover:bg-green-300":
      !w.revealed && w.shown && w.color === Color.Green,
    "lg:text-base text-xs": w.word.length > 7,
  };

  const variants = {
    initial: { scale: 1 },
    revealing: { scale: 1.1 },
  };

  return (
    <div className="relative lg:h-16 md:h-12 h-10 overflow-visible">
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
          "font-bold rounded flex flex-col items-center justify-center absolute w-full h-full shadow",
          colorStyles
        )}
      >
        {w.word}
        {w.duetMarker && (
          <div className="absolute top-0 right-0 m-2 rounded-full w-3 h-3 border-2 border-yellow-800 bg-yellow-300"></div>
        )}
      </motion.div>
    </div>
  );
};

export default Card;
