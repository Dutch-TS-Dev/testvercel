import type { Adapter } from "next-auth/adapters";
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export function FirebaseAdapter(db: Firestore): Adapter {
  return {
    async createUser(user) {
      console.log("cu happens");
      const userRef = doc(db, "nextauth_users", user.id);
      await setDoc(userRef, {
        ...user,
        emailVerified: user.emailVerified
          ? user.emailVerified.toISOString()
          : null,
      });

      const created = await getDoc(userRef);
      const userData = created.data()!;

      return {
        ...userData,
        id: created.id,
        emailVerified: userData.emailVerified
          ? new Date(userData.emailVerified)
          : null,
      } as any;
    },

    async getUser(id) {
      const userSnap = await getDoc(doc(db, "nextauth_users", id));
      if (!userSnap.exists()) return null;

      const userData = userSnap.data();
      return {
        ...userData,
        id: userSnap.id,
        emailVerified: userData.emailVerified
          ? new Date(userData.emailVerified)
          : null,
      } as any;
    },

    async getUserByEmail(email) {
      const usersRef = collection(db, "nextauth_users");
      const q = query(usersRef, where("email", "==", email));
      const userSnap = await getDocs(q);

      if (userSnap.empty) return null;

      const userData = userSnap.docs[0].data();
      return {
        ...userData,
        id: userSnap.docs[0].id,
        emailVerified: userData.emailVerified
          ? new Date(userData.emailVerified)
          : null,
      } as any;
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const accountsRef = collection(db, "nextauth_accounts");
      const q = query(
        accountsRef,
        where("provider", "==", provider),
        where("providerAccountId", "==", providerAccountId)
      );

      const accountSnap = await getDocs(q);
      if (accountSnap.empty) return null;

      const userId = accountSnap.docs[0].data().userId;
      return this.getUser(userId);
    },

    async updateUser(user) {
      const userRef = doc(db, "nextauth_users", user.id);

      await updateDoc(userRef, {
        ...user,
        emailVerified: user.emailVerified
          ? user.emailVerified.toISOString()
          : null,
      });

      const updated = await getDoc(userRef);
      const userData = updated.data()!;

      return {
        ...userData,
        id: updated.id,
        emailVerified: userData.emailVerified
          ? new Date(userData.emailVerified)
          : null,
      } as any;
    },

    async deleteUser(userId) {
      // Delete user
      await deleteDoc(doc(db, "nextauth_users", userId));

      // Delete accounts
      const accountsRef = collection(db, "nextauth_accounts");
      const accountsQuery = query(accountsRef, where("userId", "==", userId));
      const accountSnap = await getDocs(accountsQuery);

      accountSnap.forEach(async (document) => {
        await deleteDoc(doc(db, "nextauth_accounts", document.id));
      });

      // Delete sessions
      const sessionsRef = collection(db, "nextauth_sessions");
      const sessionsQuery = query(sessionsRef, where("userId", "==", userId));
      const sessionSnap = await getDocs(sessionsQuery);

      sessionSnap.forEach(async (document) => {
        await deleteDoc(doc(db, "nextauth_sessions", document.id));
      });
    },

    async linkAccount(account) {
      await setDoc(doc(db, "nextauth_accounts", account.providerAccountId), {
        ...account,
      });
      return account;
    },

    async unlinkAccount({ provider, providerAccountId }) {
      const accountsRef = collection(db, "nextauth_accounts");
      const q = query(
        accountsRef,
        where("provider", "==", provider),
        where("providerAccountId", "==", providerAccountId)
      );

      const accountSnap = await getDocs(q);
      if (!accountSnap.empty) {
        await deleteDoc(doc(db, "nextauth_accounts", accountSnap.docs[0].id));
      }
    },

    async createSession(session) {
      await setDoc(doc(db, "nextauth_sessions", session.sessionToken), {
        ...session,
        expires: session.expires.toISOString(),
      });

      const created = await getDoc(
        doc(db, "nextauth_sessions", session.sessionToken)
      );
      const sessionData = created.data()!;

      return {
        ...sessionData,
        expires: new Date(sessionData.expires),
      };
    },

    async getSessionAndUser(sessionToken) {
      const sessionSnap = await getDoc(
        doc(db, "nextauth_sessions", sessionToken)
      );

      if (!sessionSnap.exists()) return null;

      const sessionData = sessionSnap.data()!;
      const session = {
        ...sessionData,
        expires: new Date(sessionData.expires),
      };

      const userSnap = await getDoc(doc(db, "nextauth_users", session.userId));

      if (!userSnap.exists()) return null;

      const userData = userSnap.data()!;
      const user = {
        ...userData,
        id: userSnap.id,
        emailVerified: userData.emailVerified
          ? new Date(userData.emailVerified)
          : null,
      };

      return { session, user } as any;
    },

    async updateSession(session) {
      if (!session.expires) {
        return null;
      }

      await updateDoc(doc(db, "nextauth_sessions", session.sessionToken), {
        ...session,
        expires: session.expires.toISOString(),
      });

      const updated = await getDoc(
        doc(db, "nextauth_sessions", session.sessionToken)
      );

      if (!updated.exists()) return null;

      const sessionData = updated.data()!;
      return {
        ...sessionData,
        expires: new Date(sessionData.expires),
      };
    },

    async deleteSession(sessionToken) {
      await deleteDoc(doc(db, "nextauth_sessions", sessionToken));
    },
  };
}
