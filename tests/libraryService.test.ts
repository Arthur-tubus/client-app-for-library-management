import { expect } from 'chai';
import { Book } from '../src/models/Book';
import { User } from '../src/models/User';
import { LibraryService, MAX_BORROWED_BOOKS } from '../src/services/LibraryService';
import { KeyValueStore, Storage } from '../src/services/Storage';

class MemoryStore implements KeyValueStore {
  private data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }
}

describe('LibraryService', () => {
  let store: MemoryStore;
  let service: LibraryService;

  beforeEach(() => {
    store = new MemoryStore();
    service = new LibraryService(new Storage(store));
    service.addUser(new User('Артем', 'a@gmail.com', '100'));
    for (let i = 1; i <= 4; i++) {
      service.addBook(new Book(`Book ${i}`, 'Author', 2000 + i, String(i)));
    }
  });

  it('позичає книгу і позначає її як взяту', () => {
    const result = service.borrowBook('1', '100');
    expect(result.status).to.equal('success');
    expect(service.getBooks()[0].isBorrowed()).to.equal(true);
  });

  it('не дає позичити більше ліміту', () => {
    for (let i = 1; i <= MAX_BORROWED_BOOKS; i++) {
      service.borrowBook(String(i), '100');
    }
    expect(service.borrowBook('4', '100').status).to.equal('limit-reached');
  });

  it('повертає книгу', () => {
    service.borrowBook('1', '100');
    service.returnBook('1');
    expect(service.getBooks()[0].isBorrowed()).to.equal(false);
  });

  it('відхиляє невідомого користувача', () => {
    expect(service.borrowBook('1', '999').status).to.equal('user-not-found');
  });

  it('відновлює дані зі сховища', () => {
    service.borrowBook('1', '100');
    const restored = new LibraryService(new Storage(store));
    expect(restored.getBooks()).to.have.length(4);
    expect(restored.getBooks()[0].getBorrowedBy()).to.equal('100');
  });

  it('шукає книги за назвою або автором без урахування регістру', () => {
    service.addBook(new Book('Clean Code', 'Robert Martin', 2008, '10'));
    expect(service.searchBooks('clean')).to.have.length(1);
    expect(service.searchBooks('MARTIN')).to.have.length(1);
    expect(service.searchBooks('')).to.have.length(5);
    expect(service.searchBooks('nothing')).to.have.length(0);
  });

  it('видаляє книгу', () => {
    expect(service.deleteBook('1')).to.equal(true);
    expect(service.getBooks()).to.have.length(3);
    expect(service.deleteBook('1')).to.equal(false);
  });

  it('не видаляє користувача з позиченими книгами', () => {
    service.borrowBook('1', '100');
    expect(service.deleteUser('100')).to.equal('has-borrowed-books');
    service.returnBook('1');
    expect(service.deleteUser('100')).to.equal('success');
    expect(service.deleteUser('100')).to.equal('not-found');
  });
});
