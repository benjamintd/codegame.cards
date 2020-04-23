import React, { useState, useEffect } from "react";
import { useGameView } from "../hooks/game";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

export default () => {
  const router = useRouter();
  const gameView = useGameView();
  const ref = React.createRef<HTMLInputElement>();
  const [copied, setCopied] = useState(false);

  const shareLink =
    typeof window !== "undefined" && window.location.origin
      ? `${window.location.origin}${router.asPath}`
      : `https://codenames.cards${router.asPath}`;

  const copyToClipboard = () => {
    ref.current.select();
    document.execCommand("copy");
    setCopied(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
    }
  }, [copied]);

  // todo add a link to the game and be a button to copy it to clipboard
  return (
    <div className="p-4 flex flex-col items-center">
      <div
        className="flex text-gray-800 hover:text-gray-600 cursor-pointer mt-2"
        onClick={copyToClipboard}
      >
        <input
          className="outline-none truncate text-xs w-64 mr-2 cursor-pointer"
          readOnly
          ref={ref}
          value={shareLink}
        />
        <div className="inline-block">
          <CopyIcon className="w-6 h-6" />
        </div>
      </div>
      <AnimatePresence>
        {copied && (
          <motion.div
            className="absolute mx-auto border rounded bg-yellow-100 text-yellow-600 border-yellow-600 w-24 p-2 text-xs text-center font-bold mt-2"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 50 }}
            exit={{ opacity: 0, y: -50 }}
          >
            copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CopyIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 20 20"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="currentColor" fillRule="evenodd">
      <path
        d="M0,8.00585866 C0,6.89805351 0.897060126,6 2.00585866,6 L11.9941413,6 C13.1019465,6 14,6.89706013 14,8.00585866 L14,17.9941413 C14,19.1019465 13.1029399,20 11.9941413,20 L2.00585866,20 C0.898053512,20 0,19.1029399 0,17.9941413 L0,8.00585866 L0,8.00585866 Z M6,8 L2,8 L2,18 L12,18 L12,14 L15,14 L15,12 L18,12 L18,2 L8,2 L8,5 L6,5 L6,8 L12,8 L12,14 L17.9941413,14 C19.1029399,14 20,13.1019465 20,11.9941413 L20,2.00585866 C20,0.897060126 19.1019465,0 17.9941413,0 L8.00585866,0 C6.89706013,0 6,0.898053512 6,2.00585866 L6,8 Z"
        id="Combined-Shape"
      ></path>
    </g>
  </svg>
);
