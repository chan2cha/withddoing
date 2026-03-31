export type LocalDocumentType = "image" | "pdf";

export interface LocalDocumentItem {
  id: string;
  title: string;
  type: LocalDocumentType;
  category: "passport" | "voucher" | "ticket" | "insurance" | "other";
  fileName: string;
  mimeType: string;
  createdAt: number;
  blob: Blob;
}

const DB_NAME = "trip-documents-db";
const STORE_NAME = "documents";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllLocalDocuments(): Promise<LocalDocumentItem[]> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();

    req.onsuccess = () => {
      const result = (req.result as LocalDocumentItem[]).sort(
        (a, b) => b.createdAt - a.createdAt
      );
      resolve(result);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function saveLocalDocument(
  item: Omit<LocalDocumentItem, "id" | "createdAt">
): Promise<LocalDocumentItem> {
  const db = await openDb();

  const payload: LocalDocumentItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(payload);

    req.onsuccess = () => resolve(payload);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteLocalDocument(id: string): Promise<void> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}