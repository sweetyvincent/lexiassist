import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  deleteDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import type { LegalDocument } from '@/types/document';
import type { RiskAnalysis } from '@/types/analysis';
import type { ChatThread, ChatMessage } from '@/types/chat';

/**
 * FirestoreService provides methods to interact with Firestore database.
 */
export const FirestoreService = {
  /**
   * Saves document metadata (excluding chunks) to Firestore.
   */
  async saveDocument(document: Omit<LegalDocument, 'chunks'>): Promise<void> {
    const docRef = doc(db, 'documents', document.id);
    const { extractedText, ...docData } = document as any;
    await setDoc(docRef, docData);
  },

  /**
   * Retrieves a document by its ID and optionally verifies user ownership.
   */
  async getDocument(docId: string, userId?: string): Promise<LegalDocument | null> {
    const docRef = doc(db, 'documents', docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as LegalDocument;
      if (!userId || data.userId === userId) {
        return data;
      }
    }
    return null;
  },

  /**
   * Retrieves all documents for a given user, ordered by upload date descending.
   */
  async getUserDocuments(userId: string): Promise<LegalDocument[]> {
    const q = query(
      collection(db, 'documents'),
      where('userId', '==', userId),
      orderBy('uploadedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: any) => doc.data() as LegalDocument);
  },

  /**
   * Saves a risk analysis to the 'analyses' collection.
   */
  async saveAnalysis(docId: string, analysis: RiskAnalysis): Promise<void> {
    const docRef = doc(db, 'analyses', docId);
    await setDoc(docRef, analysis);
  },

  /**
   * Retrieves a risk analysis by document ID.
   */
  async getAnalysis(docId: string): Promise<RiskAnalysis | null> {
    const docRef = doc(db, 'analyses', docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as RiskAnalysis) : null;
  },

  /**
   * Saves a chat thread to the 'chats' collection.
   */
  async saveChatThread(thread: ChatThread): Promise<void> {
    const docRef = doc(db, 'chats', thread.id);
    await setDoc(docRef, thread);
  },

  /**
   * Retrieves a chat thread by its ID and ensures it belongs to the specified user.
   */
  async getChatThread(threadId: string, userId: string): Promise<ChatThread | null> {
    const docRef = doc(db, 'chats', threadId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as ChatThread;
      if (data.userId === userId) {
        return data;
      }
    }
    return null;
  },

  /**
   * Appends a new chat message to an existing thread.
   */
  async addChatMessage(threadId: string, message: ChatMessage): Promise<void> {
    const docRef = doc(db, 'chats', threadId);
    await updateDoc(docRef, {
      messages: arrayUnion(message),
      updatedAt: Timestamp.now()
    });
  },

  /**
   * Deletes a document and its associated analysis and chat threads.
   */
  async deleteDocument(docId: string, userId?: string): Promise<void> {
    // Basic verification
    const document = await this.getDocument(docId, userId);
    if (!document) throw new Error('Document not found or unauthorized');

    const batch = writeBatch(db);
    
    // Delete Document
    batch.delete(doc(db, 'documents', docId));
    
    // Delete Analysis
    batch.delete(doc(db, 'analyses', docId));
    
    // Find and delete associated chat threads
    const constraints = [where('documentId', '==', docId)];
    if (userId) constraints.push(where('userId', '==', userId));
    const q = query(collection(db, 'chats'), ...constraints);
    const chatSnap = await getDocs(q);
    chatSnap.forEach((chatDoc: any) => {
      batch.delete(doc(db, 'chats', chatDoc.id));
    });

    await batch.commit();
  }
};
