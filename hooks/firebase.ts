import "firebase/database";
import "firebase/analytics";
import firebase from "firebase/app";

import { IGame, IPlayer } from "../lib/game";
import { GameHandler, GamesHandler, Network } from "./network";

export function setupFirebase() {
  if (!firebase.apps.length) {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    };
    firebase.initializeApp(firebaseConfig);
    if (typeof window !== "undefined") {
      firebase.analytics();
    }
  }

  return firebase.database();
}

export default class FirebaseNetwork implements Network {
  db: firebase.database.Database;

  constructor(db?: firebase.database.Database) {
    this.db = db || setupFirebase();
  }

  getPublicGames(callback: GamesHandler) {
    const ref = this.db
      .ref("/games")
      .orderByChild("createdAt")
      .startAt(Date.now() - 20 * 60 * 1000) // last 20 minutes
      .limitToFirst(30);

    ref.once("value", (event) => {
      let games = Object.values(event.val() || {});
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
