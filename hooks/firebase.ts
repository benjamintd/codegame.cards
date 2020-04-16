import "firebase/database";
import "firebase/analytics";
import firebase from "firebase/app";

import { IGame, IPlayer } from "../lib/game";
import { GameHandler, GamesHandler, Network } from "./network";

export function setupFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: "AIzaSyCxUmqQWsV1qZ7KDuyVXx4Y3C1Uen7Dnew",
      authDomain: "codenames-5c1a2.firebaseapp.com",
      databaseURL: "https://codenames-5c1a2.firebaseio.com",
      projectId: "codenames-5c1a2",
      storageBucket: "codenames-5c1a2.appspot.com",
      messagingSenderId: "426387002729",
      appId: "1:426387002729:web:7f990ab15dbb0a0a06d9f8",
      measurementId: "G-EZFDE50SDQ",
    });
    firebase.analytics();
  }

  return firebase.database();
}

export default class FirebaseNetwork implements Network {
  db: firebase.database.Database;

  constructor(db?: firebase.database.Database) {
    this.db = db || setupFirebase();
  }

  getPublicGames(callback: GamesHandler) {
    const ref = this.db.ref("/games");

    ref.once("value", (event) => {
      const games = Object.values(event.val() || {});
      callback(games as IGame[]);
    });
  }

  subscribeToOnGoingGames(callback: GamesHandler) {
    const ref = this.db.ref("/games");

    ref.on("value", (event) => {
      const games = Object.values(event.val() || {});
      callback(games as IGame[]);
    });

    return () => ref.off();
  }

  subscribeToGame(gameId: string, callback: GameHandler) {
    const ref = this.db.ref(`/games/${gameId}`);

    ref.on("value", (event) => {
      callback(event.val() as IGame);
    });

    return () => ref.off();
  }

  async updateGame(game: IGame) {
    await this.db.ref(`/games/${game.id}`).set(game);
  }
}
