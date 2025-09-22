
'use client';

import { AppData, initialData } from './data';

function getStorageKey(username: string) {
    if (!username) {
        // This case should not happen for a logged-in user, but as a fallback:
        return 'milbus-app-data-guest';
    }
    return `milbus-app-data-${username}`;
}

export function loadData(username: string): AppData {
    if (typeof window === 'undefined') {
        return initialData;
    }
    try {
        const key = getStorageKey(username);
        const savedData = localStorage.getItem(key);
        if (savedData) {
            return JSON.parse(savedData);
        } else {
            // First time for this user, save initial data
            saveData(username, initialData);
            return initialData;
        }
    } catch (error) {
        console.error("Failed to load data from localStorage", error);
        return initialData;
    }
}

export function saveData<K extends keyof AppData>(
    username: string,
    data: AppData
): void;
export function saveData<K extends keyof AppData>(
    username: string,
    key: K,
    value: AppData[K]
): void;
export function saveData<K extends keyof AppData>(
    username: string,
    keyOrData: K | AppData,
    value?: AppData[K]
): void {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        const storageKey = getStorageKey(username);
        if (typeof keyOrData === 'string') {
            const currentData = loadData(username);
            const updatedData = { ...currentData, [keyOrData]: value };
            localStorage.setItem(storageKey, JSON.stringify(updatedData));
        } else {
            localStorage.setItem(storageKey, JSON.stringify(keyOrData));
        }
    } catch (error) {
        console.error("Failed to save data to localStorage", error);
    }
}
