import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  Query,
  query,
  setDoc,
  where,
} from "firebase/firestore"; // Import Firestore
dotenv.config({ path: "./.env.local" });

import { v4 as uuidv4 } from "uuid";
export const uuid = uuidv4;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = initializeApp({
  apiKey: "AIzaSyB8zPHK4ritQE5o_gvb0IqrBbmxpAdW5Wc",
  authDomain: "sportapp-11a3e.firebaseapp.com",
  projectId: "sportapp-11a3e",
  storageBucket: "sportapp-11a3e.firebasestorage.app",
  messagingSenderId: "290122311839",
  appId: "1:290122311839:web:75a04741a6e99854fc5aaa",
  measurementId: "G-CZJBPKPD3L",
});

export async function setDocument<Type>(
  collection: string,
  object: Type & {
    id?: string;
    created?: number;
    createdReadable?: string;
    updated?: number;
  }
): Promise<void> {
  try {
    const id = object?.id || uuid();

    const ref = doc(db, `${collection}/${id}`);

    Object.entries(object).find(([k, v]) => {
      if (v === undefined) {
        throw new Error(`COICLOUD ERROR: the key ${k} has undefined as value`);
      }
    });

    const getNowInSeconds = (): number => {
      return Math.floor(Date.now() / 1000);
    };

    const nowInSeconds = getNowInSeconds();

    await setDoc(
      ref,
      {
        ...object,
        created: object.created || nowInSeconds,
        id,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error setting document:", error);
  }
}

export async function getDocuments<Type>(
  collectionName: string,
  equals: Partial<Type> = {},
  sort?: string
): Promise<Type[]> {
  Object.entries(equals).find(([k, v]) => {
    if (v === undefined) {
      throw new Error(`COICLOUD ERROR: the key ${k} has undefined as value`);
    }
  });

  return new Promise(async (resolve, reject) => {
    try {
      const snapshot = await getDocs(
        Object.keys(equals).reduce(
          (q: Query, key: string): Query => {
            return query(
              q,
              where(key, "==", equals[key as keyof typeof equals])
            );
          },
          sort
            ? query(collection(db, collectionName), orderBy(sort, "asc"))
            : query(collection(db, collectionName))
        )
      );

      const res: Type[] = [];

      snapshot.forEach((doc) => {
        const data: any = doc.data();

        if (data.latestCheck) data.latestCheck = data.latestCheck.toDate();

        res.push({
          ...data,
        } as Type);
      });

      return resolve(
        res.map((e: any) => ({
          ...e,
        }))
      );
    } catch (e: any) {
      console.log("logged: e", e);

      return reject(e);
    }
  });
}

export async function getDocument<Type>(
  collectionName: string,
  equals: Partial<Type> = {},
  sort?: string
): Promise<Type | undefined> {
  return new Promise(async (resolve, reject) => {
    try {
      const snapshot = await getDocs(
        Object.keys(equals).reduce(
          (q: Query, key: string): Query => {
            return query(
              q,
              where(key, "==", equals[key as keyof typeof equals])
            );
          },
          sort
            ? query(collection(db, collectionName), orderBy(sort, "asc"))
            : query(collection(db, collectionName))
        )
      );

      const res: Type[] = [];

      snapshot.forEach((doc) => {
        const data: any = doc.data();

        if (data.latestCheck) data.latestCheck = data.latestCheck.toDate();

        res.push(data as Type);
      });

      if (res.length > 1) {
        console.log("please be aware that more than one document was found");
      }

      return resolve(res?.[0]);
    } catch (e: any) {
      console.log("logged: e", e);

      return reject(e);
    }
  });
}

export const auth = getAuth(app);
export const db = getFirestore(app);
