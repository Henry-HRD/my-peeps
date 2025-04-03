import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Person {
  id?: string;
  name: string;
  notes: string;
  createdAt: Date;
  userId: string;
}

export const personService = {
  async addPerson(person: Omit<Person, 'id' | 'createdAt'>) {
    const personWithTimestamp = {
      ...person,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, 'persons'), personWithTimestamp);
    return { id: docRef.id, ...personWithTimestamp };
  },

  async getPersons(userId: string): Promise<Person[]> {
    const q = query(collection(db, 'persons'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as Person));
  },

  async updatePerson(id: string, updates: Partial<Person>) {
    const docRef = doc(db, 'persons', id);
    await updateDoc(docRef, updates);
  },

  async deletePerson(id: string) {
    const docRef = doc(db, 'persons', id);
    await deleteDoc(docRef);
  }
}; 