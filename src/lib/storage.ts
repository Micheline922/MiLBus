
'use client';

import { AppData, initialData } from './data';

function getStorageKey(username: string): string {
    if (!username) {
        // Fallback for cases where username is not yet available, though this shouldn't be used for saving.
        return 'milbus-app-data-anonymous';
    }
    // Sanitize username to create a valid key
    return `milbus-app-data-${username.toLowerCase().replace(/[^a-z0-9]/gi, '_')}`;
}

export function loadData(username: string): AppData {
    if (typeof window === 'undefined') {
        // Return a deep copy to prevent mutation of the original initialData object
        return JSON.parse(JSON.stringify(initialData));
    }
    try {
        const key = getStorageKey(username);
        const savedData = localStorage.getItem(key);
        const userData = localStorage.getItem('milbus-user-credentials');

        let combinedData = JSON.parse(JSON.stringify(initialData));

        if (savedData) {
            // Merge saved app data
            const parsedData = JSON.parse(savedData);
            combinedData = { ...combinedData, ...parsedData };
        }
        
        if (userData) {
            // Merge user-specific info (like business name, currency)
             const parsedUser = JSON.parse(userData);
             combinedData.user = {
                username: parsedUser.storedUsername,
                businessName: parsedUser.businessName,
                businessAddress: parsedUser.businessAddress,
                businessContact: parsedUser.businessContact,
                businessPhone: parsedUser.businessPhone,
                profilePicture: parsedUser.profilePicture,
                currency: parsedUser.currency,
             }
        }
        
        if (!savedData) {
             // First time for this user, save initial data
            saveData(username, combinedData);
        }

        return combinedData;

    } catch (error) {
        console.error("Failed to load data from localStorage", error);
        // Return a deep copy
        return JSON.parse(JSON.stringify(initialData));
    }
}

export function saveData<K extends keyof AppData>(
    username: string,
    key: K,
    value: AppData[K]
): void;
export function saveData(
    username: string,
    data: AppData
): void;
export function saveData<K extends keyof AppData>(
    username: string,
    keyOrData: K | AppData,
    value?: AppData[K]
): void {
    if (typeof window === 'undefined' || !username) {
        return;
    }
    try {
        const storageKey = getStorageKey(username);
        if (typeof keyOrData === 'string' && value !== undefined) {
            // Saving a specific key
            const currentData = loadData(username);
            const updatedData = { ...currentData, [keyOrData]: value };
            localStorage.setItem(storageKey, JSON.stringify(updatedData));
        } else if (typeof keyOrData === 'object') {
             // Saving the entire AppData object
            localStorage.setItem(storageKey, JSON.stringify(keyOrData));
        }
    } catch (error) {
        console.error("Failed to save data to localStorage", error);
         if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            alert("Erreur : Le stockage local est plein. Impossible de sauvegarder les modifications. Essayez de vider le cache de votre navigateur ou de libérer de l'espace.");
        }
    }
}

    
