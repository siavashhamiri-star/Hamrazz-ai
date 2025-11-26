'use client';

import { useMemo, useCallback, useEffect } from 'react';
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

// Function to create a default user profile
const createDefaultProfile = (user: User): UserProfile => ({
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
});


export function useUserProfile(userId?: string): UseUserProfileResult {
  const db = useFirestore();
  const { user } = useUser();

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
  }, [userDocRef, user]);

  useEffect(() => {
    const setupUserProfile = async () => {
      if (user && db) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          const newUserProfile = createDefaultProfile(user);
          await updateUserProfile(newUserProfile);
        }
      }
    };
    setupUserProfile();
  }, [user, db, updateUserProfile]);

  const { data, loading: docLoading } = useDoc<UserProfile>(userDocRef, {
    transform: (data) => {
      const profile = data as UserProfile;
      const selectedAvatar = PlaceHolderImages.find(img => img.id === profile.selectedAvatarId) || defaultAvatar;
      return { ...profile, selectedAvatar };
    }
  });

  const userProfile = useMemo(() => {
      if (data) return data;
      if (!user || docLoading) return null;

      return {
        ...createDefaultProfile(user),
      }
  }, [data, user, docLoading]);

  return { 
    userProfile, 
    updateUserProfile: db ? updateUserProfile : null, 
    loading: docLoading 
  };
}
