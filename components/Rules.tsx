import React from "react";
import { IGameMode } from "../lib/game";
import { Trans, useTranslation } from "react-i18next";

const Rules = ({ mode }: { mode: IGameMode }) => {
  const { t } = useTranslation();
  if (mode === "classic") {
    return (
      <div>
        <p>
          <Trans i18nKey="rules-classic-teams">
            Players are split into two teams:
            <span className="text-red-700 font-bold">red</span> and
            <span className="text-blue-700 font-bold">blue</span>. One player of
            each team is selected as the team's spymaster 🕵️‍♂️ - the others are
            field operatives.
          </Trans>
        </p>
        <p>
          <Trans i18nKey="rules-classic-grid">
            Twenty-five word cards are randomly laid out in a grid. A number of
            these words represent
            <span className="text-red-700 font-bold">red</span>
            agents, a number represent
            <span className="text-blue-700 font-bold">blue</span>
            agents, one represents an
            <span className="text-black font-bold">assassin</span>, and the
            others represent
            <span className="text-yellow-600 font-bold">
              innocent bystander
            </span>
            . The teams' spymasters know the colors of each word, and take turns
            to hint their team for them to find the words of their color.
          </Trans>
        </p>
        <p>
          <Trans i18nKey="rules-classic-hints">
            Each hint may only consist of one single word and a number of cards
            it relates to. The spymaster gives a hint that is related to as many
            of the words on his/her own agents' cards as possible, but not to
            any others – they might accidentally lead their team to choose a
            card representing an innocent bystander, an opposing agent, or the
            assassin.
          </Trans>
        </p>
        <p>
          <Trans i18nKey="rules-hint-restrictions">
            The hint's word can be chosen freely, as long as it is not (and does
            not contain) any of the words on the code name cards still showing
            at that time. Phonetic clues are typically forbidden.
          </Trans>
        </p>
        <p>
          <Trans i18nKey="rules-turns">
            The cards are revealed as guesses are made. Field operatives must
            make at least one guess per turn, risking a wrong guess and its
            consequences. They may also end their turn voluntarily at any point
            thereafter. They can guess up to the number given by the spymaster,
            plus one (a bonus to find a previously hinted word).
          </Trans>
        </p>
        <p>
          <Trans i18nKey="rules-classic-game-end">
            The game ends when all of one team's agents are identified (🏅), or
            when one team has identified the
            <span className="text-black font-bold">assassin</span> (☠️).
          </Trans>
        </p>
        <style jsx>{`
          p {
            padding: 0.5rem 0 0.5rem 0;
          }
        `}</style>
      </div>
    );
  }

  if (mode === "duet") {
    return (
      <div>
        <p>
          <Trans i18nKey="rules-duet-objective">
            Two players cooperate to find 15 words on the board.
          </Trans>
        </p>
        <p>
          <Trans i18nKey="rules-duet-grid">
            Twenty-five word cards are randomly laid out in a grid. A number of
            these words represent
            <span className="text-green-700 font-bold">green</span>
            agents, a number represent
            <span className="text-black font-bold">assassins</span>, and the
            others represent
            <span className="text-yellow-600 font-bold">
              innocent bystanders
            </span>
            . Each player knows 9
            <span className="text-green-700 font-bold">green</span> words, some
            of them overlapping with the other side.
          </Trans>
        </p>
        <p>
          <Trans i18nKey="rules-duet-hints">
            Players alternatively give hints to make the other player find their
            green cards. Each hint may only consist of one single word and a
            number of cards it relates to. The spymaster gives a hint that is
            related to as many of the words on his/her own agents' cards as
            possible, but not to any others – they might accidentally lead the
            other player to choose a card representing an innocent bystander, or
            an assassin.
          </Trans>
        </p>
        <p>
          <Trans i18nKey="rules-hint-restrictions">
            The hint's word can be chosen freely, as long as it is not (and does
            not contain) any of the words on the code name cards still showing
            at that time. Phonetic clues are typically forbidden.
          </Trans>
        </p>
        <p>
          <Trans i18nKey="rules-turns">
            The cards are revealed as guesses are made. Field operatives must
            make at least one guess per turn, risking a wrong guess and its
            consequences. They may also end their turn voluntarily at any point
            thereafter. They can guess up to the number given by the spymaster,
            plus one (a bonus to find a previously hinted word).
          </Trans>
        </p>
        <p>
          <Trans i18nKey="rules-duet-game-end">
            The game ends when all of the 15 green agents are identified (🏅),
            or when one player has identified an
            <span className="text-black font-bold">assassin</span> (☠️). The
            game is timed, which means that players get a total of 9 turns to
            find all the words. Clicking on an
            <span className="text-yellow-600 font-bold">
              innocent bystanders
            </span>
            consumes one extra turn.
          </Trans>
        </p>
        <style jsx>{`
          p {
            padding: 0.5rem 0 0.5rem 0;
          }
        `}</style>
      </div>
    );
  }
};

export default Rules;
