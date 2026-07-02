
'use client';

import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';

/**
 * TransactionService - Implements Chained Hashing for financial transparency.
 * Every transaction contains the hash of the previous one.
 */
export class TransactionService {
  private static COLLECTION = 'transactions';

  /**
   * Simple SHA-256 implementation using Web Crypto API.
   */
  private static async generateHash(data: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Records a new transaction in the immutable ledger.
   */
  static async recordTransaction(uid: string, amount: number, type: string, metadata: object = {}) {
    // 1. Get the last transaction's hash
    const q = query(collection(db, this.COLLECTION), orderBy('timestamp', 'desc'), limit(1));
    const lastTxSnap = await getDocs(q);
    const lastHash = lastTxSnap.empty ? 'GENESIS_BLOCK' : lastTxSnap.docs[0].data().hash;

    // 2. Prepare data for the new hash
    const txData = {
      uid,
      amount,
      type,
      prevHash: lastHash,
      timestamp: Date.now(),
      ...metadata
    };

    // 3. Generate current hash
    const hash = await this.generateHash(JSON.stringify(txData));

    // 4. Save to Firestore (Security rules prevent editing/deleting)
    await addDoc(collection(db, this.COLLECTION), {
      ...txData,
      hash,
      serverTimestamp: serverTimestamp()
    });

    console.log(`Transaction secured with hash: ${hash}`);
  }
}
