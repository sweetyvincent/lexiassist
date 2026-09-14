'use client';
import { openDB, type IDBPDatabase } from 'idb';
import { useState, useEffect } from 'react';

const DB_NAME = 'lexiassist-docs';
const STORE_NAME = 'documents';
const VERSION = 1;

/**
 * Hook for managing local file storage using IndexedDB
 */
export function useLocalStorage() {
  const [db, setDb] = useState<IDBPDatabase | null>(null);

  useEffect(() => {
    const initDb = async () => {
      const dbInstance = await openDB(DB_NAME, VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        },
      });
      setDb(dbInstance);
    };
    initDb();
  }, []);

  const getDbInstance = async () => {
    if (db) return db;
    return await openDB(DB_NAME, VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME);
        }
      },
    });
  };

  const saveFile = async (id: string, file: File): Promise<void> => {
    const dbInstance = await getDbInstance();
    await dbInstance.put(STORE_NAME, file, id);
  };

  const getFile = async (id: string): Promise<File | null> => {
    const dbInstance = await getDbInstance();
    const file = await dbInstance.get(STORE_NAME, id);
    return file || null;
  };

  const deleteFile = async (id: string): Promise<void> => {
    const dbInstance = await getDbInstance();
    await dbInstance.delete(STORE_NAME, id);
  };

  const listFiles = async (): Promise<{id: string, name: string, size: number}[]> => {
    const dbInstance = await getDbInstance();
    const keys = await dbInstance.getAllKeys(STORE_NAME);
    const files = await Promise.all(keys.map(async (key) => {
      const file: File = await dbInstance.get(STORE_NAME, key);
      return { id: key as string, name: file.name, size: file.size };
    }));
    return files;
  };

  return { saveFile, getFile, deleteFile, listFiles };
}
