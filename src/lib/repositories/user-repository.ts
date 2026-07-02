
'use client';

import { doc, getDoc, setDoc, updateDoc, increment, collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { UserProfile } from '@/hooks/use-user-profile';

/**
 * UserRepository - Implementing the Repository Pattern to decouple UI from Firebase SDK.
 * This allows for easy swapping of the data source in the future.
 */
export class UserRepository {
  private static COLLECTION = 'users';
  private static SHARDS_COUNT = 10;

  /**
   * Fetches a user profile.
   */
  static async getUser(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, this.COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as UserProfile;
    }
    return null;
  }

  /**
   * Implements Distributed Counters (Sharding) for high-traffic updates.
   * Instead of updating a single document, we update a random shard.
   */
  static async incrementUserPoints(uid: string, amount: number): Promise<void> {
    const shardId = Math.floor(Math.random() * this.SHARDS_COUNT).toString();
    const shardRef = doc(db, this.COLLECTION, uid, 'shards', shardId);
    
    // Update the shard
    await setDoc(shardRef, { count: increment(amount) }, { merge: true });
    
    // Also update the main document for denormalized fast reads (eventual consistency)
    const userRef = doc(db, this.COLLECTION, uid);
    await updateDoc(userRef, { points: increment(amount) });
  }

  /**
   * Recalculates total points from all shards for absolute accuracy.
   */
  static async getPrecisePoints(uid: string): Promise<number> {
    const shardsRef = collection(db, this.COLLECTION, uid, 'shards');
    const shardsSnap = await getDocs(shardsRef);
    let total = 0;
    shardsSnap.forEach(doc => {
      total += doc.data().count || 0;
    });
    return total;
  }
}
