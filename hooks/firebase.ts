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

  getPublicGames(): Promise<IGame[]> {
    return new Promise((resolve, reject) => {
      const ref = this.db
        .ref("/games")
        .orderByChild("createdAt")
        .startAt(Date.now() - 7 * 60 * 1000) // last 7 minutes
        .limitToFirst(30);

      ref.once("value", (event) => {
        let games = Object.values(event.val() || {});
        resolve(games as IGame[]);
      });
    });
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

  async updateKey(key: string, value: any) {
    await this.db.ref().update({ [key]: value });
  }

  async update(obj) {
    await this.db.ref().update(obj);
  }
}
