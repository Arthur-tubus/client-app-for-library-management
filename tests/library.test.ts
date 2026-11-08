import { expect } from 'chai';
import { Book } from '../src/models/Book';
import { Library } from '../src/services/Library';

describe('Library', () => {
  let library: Library<Book>;

  beforeEach(() => {
    library = new Library<Book>();
  });

  it('додає елемент', () => {
    library.add(new Book('Clean Code', 'Robert Martin', 2008, '1'));
    expect(library.count).to.equal(1);
  });

  it('кидає помилку при додаванні елемента з існуючим id', () => {
    library.add(new Book('Clean Code', 'Robert Martin', 2008, '1'));
    expect(() => library.add(new Book('Other', 'Author', 2000, '1'))).to.throw();
  });

  it('видаляє існуючий елемент', () => {
    library.add(new Book('Clean Code', 'Robert Martin', 2008, '1'));
    expect(library.remove('1')).to.equal(true);
    expect(library.count).to.equal(0);
  });

  it('повертає false при видаленні неіснуючого елемента', () => {
    expect(library.remove('999')).to.equal(false);
  });

  it('знаходить елемент за id', () => {
    const book = new Book('Code Complete', 'Steve McConnell', 2004, '2');
    library.add(book);
    expect(library.findById('2')).to.equal(book);
    expect(library.findById('3')).to.equal(undefined);
  });

  it('шукає елементи за умовою', () => {
    library.add(new Book('Clean Code', 'Robert Martin', 2008, '1'));
    library.add(new Book('Clean Architecture', 'Robert Martin', 2017, '2'));
    library.add(new Book('Code Complete', 'Steve McConnell', 2004, '3'));

    const result = library.find((book) => book.getAuthor() === 'Robert Martin');
    expect(result).to.have.length(2);
  });

  it('getAll повертає копію масиву', () => {
    library.add(new Book('Clean Code', 'Robert Martin', 2008, '1'));
    library.getAll().pop();
    expect(library.count).to.equal(1);
  });
});
