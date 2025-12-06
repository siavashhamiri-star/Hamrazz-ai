
'use client';

import { useMemo, useCallback, useEffect, useState } from 'react';
import { doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase, useUser } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { PlaceHolderImages, ImagePlaceholder } from '@/lib/placeholder-images';
import type { User } from 'firebase/auth';

export type UserProfile = {
  id: string;
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  points: number;
  selectedAvatarId: string;
  createdAt: any;
  updatedAt: any;
  selectedAvatar?: ImagePlaceholder;
};

type UseUserProfileResult = {
  userProfile: UserProfile | null;
  updateUserProfile: ((profile: Partial<UserProfile>) => Promise<void>) | null;
  loading: boolean;
};

const defaultAvatar = PlaceHolderImages.find(img => img.id.startsWith("avatar-")) || PlaceHolderImages[0];
const ownerAvatar = PlaceHolderImages.find(img => img.id === 'avatar-f-2') || defaultAvatar;

// Function to create a default user profile
const createDefaultProfile = (user: User): UserProfile => {
  // Special profile for the owner
  if (user.uid === 'owner-the-creator') {
     return {
      id: user.uid,
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      points: 999999, // Owner has unlimited points
      selectedAvatarId: ownerAvatar.id,
      selectedAvatar: ownerAvatar,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  }

  return {
    id: user.uid,
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    points: 0,
    selectedAvatarId: defaultAvatar.id,
    selectedAvatar: defaultAvatar,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}


export function useUserProfile(userId?: string): UseUserProfileResult {
  const db = useFirestore();
  const { user, loading: userLoading } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!db || !userId) return null;
    return doc(db, 'users', userId);
  }, [db, userId]);

  const updateUserProfile = useCallback(async (profileUpdate: Partial<UserProfile>) => {
    if (!userDocRef) return;
    
    const payload = {
      ...profileUpdate,
      updatedAt: serverTimestamp(),
    };

    try {
      // For the owner, we just simulate the update locally as there's no real backend doc
      if (userId === 'owner-the-creator') {
        console.log("Simulating owner profile update:", payload);
        return;
      }
      
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        await updateDoc(userDocRef, payload);
      } else if (user) {
        const newProfile = {
          ...createDefaultProfile(user),
          ...payload,
        }
        await setDoc(userDocRef, newProfile);
      }
    } catch (e: any) {
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'write',
          requestResourceData: payload,
        });
        errorEmitter.emit('permission-error', permissionError);
        console.error("Error updating user profile:", e);
    }
  }, [userDocRef, user, userId]);

  useEffect(() => {
    const setupUserProfile = async () => {
      if (user && db && !isInitialized && user.uid !== 'owner-the-creator') {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          const newUserProfile = createDefaultProfile(user);
          await updateUserProfile(newUserProfile);
        }
        setIsInitialized(true);
      }
    };
    if (!userLoading) {
      setupUserProfile();
    }
  }, [user, db, updateUserProfile, isInitialized, userLoading]);

  const { data: docData, loading: docLoading } = useDoc<UserProfile>(
    // Don't fetch the owner profile from Firestore
    userId === 'owner-the-creator' ? null : userDocRef, 
    {
      transform: (data) => {
        const profile = data as UserProfile;
        const selectedAvatar = PlaceHolderImages.find(img => img.id === profile.selectedAvatarId) || defaultAvatar;
        return { ...profile, selectedAvatar };
      }
    }
  );

  const userProfile = useMemo(() => {
      if (userId === 'owner-the-creator' && user) {
        return createDefaultProfile(user);
      }
      if (docData) return docData;
      if (!user || docLoading) return null;

      return createDefaultProfile(user);
  }, [docData, user, docLoading, userId]);

  return { 
    userProfile, 
    updateUserProfile: db ? updateUserProfile : null, 
    loading: userLoading || (userId !== 'owner-the-creator' && docLoading)
  };
}
