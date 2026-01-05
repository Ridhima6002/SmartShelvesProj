
import { Book, User, CollectionSchedule, BookBankBundle } from './types';

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Electronic Devices and Circuits',
    author: 'Boylestad',
    available: true,
    copies: 3,
    totalCopies: 15,
    demand: 'High',
    tags: ['Most Borrowed', 'EXTC Core'],
    rack: 7,
    year: 'SE',
    branch: 'EXTC',
    semester: 3,
    image: 'https://picsum.photos/seed/edc/200/300'
  },
  {
    id: '2',
    title: 'Data Structures and Algorithms',
    author: 'Cormen',
    available: false,
    copies: 0,
    totalCopies: 20,
    demand: 'High',
    queuePosition: 4,
    tags: ['Recommended', 'CSE Core'],
    rack: 4,
    year: 'SE',
    branch: 'CSE',
    semester: 3,
    image: 'https://picsum.photos/seed/dsa/200/300'
  },
  {
    id: '3',
    title: 'Engineering Mathematics I',
    author: 'Grewal',
    available: true,
    copies: 12,
    totalCopies: 50,
    demand: 'Low',
    tags: ['FE Common'],
    rack: 1,
    year: 'FE',
    branch: 'Common',
    semester: 1,
    image: 'https://picsum.photos/seed/math1/200/300'
  },
  {
    id: '4',
    title: 'Discrete Structures',
    author: 'Rosen',
    available: true,
    copies: 5,
    totalCopies: 12,
    demand: 'Medium',
    tags: ['Computer'],
    rack: 5,
    year: 'SE',
    branch: 'CE',
    semester: 3,
    image: 'https://picsum.photos/seed/discrete/200/300'
  }
];

export const MOCK_USER: User = {
  id: 'student_123',
  name: 'Aryan Sharma',
  email: 'aryan.sharma@spit.ac.in',
  role: 'student',
  avatar: 'https://i.pravatar.cc/150?u=aryan',
  issuedBooks: [
    { bookId: '1', dueDate: '2023-11-25' }
  ],
  fines: 45,
  bookBankPaid: false
};

/* Updated SCHEDULES with branch and location properties */
export const SCHEDULES: CollectionSchedule[] = [
  { year: 'FE', branch: 'Common', days: ['Wed', 'Fri'], time: '10 AM – 12 PM', location: 'Main Library Counter 1' },
  { year: 'SE', branch: 'CSE', days: ['Mon', 'Thu'], time: '2 PM – 4 PM', location: 'CS Dept Library' },
  { year: 'SE', branch: 'CE', days: ['Mon', 'Thu'], time: '2 PM – 4 PM', location: 'CE Dept Library' },
  { year: 'SE', branch: 'EXTC', days: ['Mon', 'Thu'], time: '2 PM – 4 PM', location: 'EXTC Dept Library' },
  { year: 'TE', branch: 'CSE', days: ['Tue', 'Fri'], time: '1 PM – 3 PM', location: 'Main Library Counter 2' },
  { year: 'TE', branch: 'EXTC', days: ['Tue', 'Fri'], time: '1 PM – 3 PM', location: 'Main Library Counter 3' },
  { year: 'BE', branch: 'CSE', days: ['Wed', 'Sat'], time: '11 AM – 1 PM', location: 'Main Library Counter 2' },
  { year: 'BE', branch: 'EXTC', days: ['Wed', 'Sat'], time: '11 AM – 1 PM', location: 'Main Library Counter 3' },
];

export const RACK_INFO = [
  { id: 1, category: 'Mathematics & Basic Science' },
  { id: 2, category: 'Communication Skills & Ethics' },
  { id: 3, category: 'Physics & Chemistry' },
  { id: 4, category: 'Computer Science Core' },
  { id: 5, category: 'Data Structures & DBMS' },
  { id: 6, category: 'Information Technology' },
  { id: 7, category: 'Electronics & EXTC Core' },
  { id: 8, category: 'Electrical Machines' },
  { id: 9, category: 'Control Systems' },
  { id: 10, category: 'Signal Processing' },
  { id: 11, category: 'Microprocessors' },
  { id: 12, category: 'Machine Learning & AI' },
  { id: 13, category: 'Cyber Security' },
  { id: 14, category: 'Competitive Exams (GATE/GRE)' },
  { id: 15, category: 'General Knowledge' },
  { id: 16, category: 'Finance & Management' },
  { id: 17, category: 'Novels & Literature' },
  { id: 18, category: 'Biographies' },
  { id: 19, category: 'Magazines & Periodicals' },
  { id: 20, category: 'New Arrivals' },
];

/* Added MOCK_BOOK_BANK_BUNDLES to resolve member error in BookBankFlow.tsx */
export const MOCK_BOOK_BANK_BUNDLES: BookBankBundle[] = [
  {
    id: 'bundle_fe_1',
    year: 'FE',
    branch: 'Common',
    semester: 1,
    books: [
      { title: 'Engineering Mathematics I', author: 'Grewal', subject: 'Mathematics' },
      { title: 'Engineering Physics', author: 'Avadhanulu', subject: 'Physics' },
      { title: 'Applied Chemistry', author: 'Jain', subject: 'Chemistry' }
    ],
    price: 850,
    originalPrice: 4250
  },
  {
    id: 'bundle_se_cse_3',
    year: 'SE',
    branch: 'CSE',
    semester: 3,
    books: [
      { title: 'Data Structures', author: 'Cormen', subject: 'Core CS' },
      { title: 'Discrete Mathematics', author: 'Rosen', subject: 'Math' },
      { title: 'Digital Electronics', author: 'Mano', subject: 'Hardware' }
    ],
    price: 1200,
    originalPrice: 6000
  },
  {
    id: 'bundle_se_extc_3',
    year: 'SE',
    branch: 'EXTC',
    semester: 3,
    books: [
      { title: 'Electronic Devices', author: 'Boylestad', subject: 'Core EXTC' },
      { title: 'Network Theory', author: 'Valckenburg', subject: 'Circuits' },
      { title: 'Signals and Systems', author: 'Oppenheim', subject: 'Theory' }
    ],
    price: 1150,
    originalPrice: 5750
  }
];
