import React, { useEffect, useState } from 'react';
import { Book } from '../types';
import BookCard from './BookCard';
import BookDetail from './BookDetail';

interface SearchResultsProps {
  query: string;
  books: Book[];
  onBack: () => void;
  onSelectBook: (book: Book) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, books, onBack, onSelectBook }) => {
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFilteredBooks([]);
      return;
    }

    setFilteredBooks(
      books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      )
    );
  }, [query, books]);

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-slate-50"
        >
          Back
        </button>
        <h1 className="text-2xl font-bold text-slate-800">
          Search Results
        </h1>
      </div>

      <p className="text-slate-500 mb-6">
        Showing results for <span className="font-semibold">"{query}"</span>
      </p>

      {filteredBooks.length === 0 ? (
        <div className="text-center text-slate-500 mt-20">
          <p className="text-lg font-semibold">No books found</p>
          <p className="text-sm mt-2">
            Try searching by book title or author name
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => setSelectedBook(book)}
            />
          ))}
        </div>
      )}

      {selectedBook && (
        <BookDetail
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAction={() => {
            onSelectBook(selectedBook);
            setSelectedBook(null);
          }}
        />
      )}
    </div>
  );
};

export default SearchResults;
