import React from "react";

export default function DiscordButton() {
  return (
    <a
      className="w-32 rounded pt-2 pb-1 flex items-center justify-center border-b-4 border-discord-700 bg-discord-500 hover:border-discord-600 hover:bg-discord-400"
      href="https://discord.gg/kMhj7nu"
      rel="noopener noreferrer"
      target="_blank"
    >
      <img src="/discord.svg" className="h-8" alt="Discord" />
    </a>
  );
}
