import { expect } from 'chai';
import { paginate } from '../src/utils/pagination';

describe('paginate', () => {
  const items = Array.from({ length: 12 }, (_, i) => i + 1);

  it('ділить список на сторінки', () => {
    const page = paginate(items, 1, 5);
    expect(page.items).to.deep.equal([1, 2, 3, 4, 5]);
    expect(page.totalPages).to.equal(3);
    expect(page.totalItems).to.equal(12);
  });

  it('остання сторінка містить залишок', () => {
    expect(paginate(items, 3, 5).items).to.deep.equal([11, 12]);
  });

  it('обмежує номер сторінки допустимим діапазоном', () => {
    expect(paginate(items, 99, 5).page).to.equal(3);
    expect(paginate(items, 0, 5).page).to.equal(1);
  });

  it('працює з порожнім списком', () => {
    const page = paginate([], 1, 5);
    expect(page.items).to.have.length(0);
    expect(page.totalPages).to.equal(1);
  });
});
