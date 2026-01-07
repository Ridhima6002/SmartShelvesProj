
export type Year = 'FE' | 'SE' | 'TE' | 'BE';
export type Branch = 'CE' | 'CSE' | 'EXTC' | 'Common';
export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Book {
  id: string;
  title: string;
  author: string;
  available: boolean;
  copies: number;
  //total_copies: number; // ✅ now same everywhere
  demand?: string;
  //tags?: string[];
  rack?: number;
  year: Year;
  branch: Branch;
  semester: number;
  image?: string;
  course_code?: string;     // NEW
}


export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar: string;
  issuedBooks: {
    bookId: string;
    dueDate: string;
  }[];
  fines: number;
  bookBankPaid: boolean;
}

/* Added BookBankBundle interface to resolve import errors in components */
export interface BookBankBundle {
  id: string;
  year: Year;
  branch: Branch;
  semester: number;
  books: { title: string; author: string; subject: string }[];
  price: number;
  originalPrice: number;
}

/* Updated CollectionSchedule to include branch and location fields */
export interface CollectionSchedule {
  year: Year;
  branch: Branch;
  days: string[];
  time: string;
  location: string;
}
