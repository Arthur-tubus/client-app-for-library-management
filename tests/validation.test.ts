import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation', () => {
  describe('isRequired', () => {
    it('відхиляє порожній рядок і пробіли', () => {
      expect(Validation.isRequired('')).to.equal(false);
      expect(Validation.isRequired('   ')).to.equal(false);
    });

    it('приймає непорожній рядок', () => {
      expect(Validation.isRequired('text')).to.equal(true);
    });
  });

  describe('isYear', () => {
    it('приймає коректні роки', () => {
      expect(Validation.isYear('1999')).to.equal(true);
      expect(Validation.isYear('2004')).to.equal(true);
    });

    it('відхиляє некоректні значення', () => {
      expect(Validation.isYear('abcd')).to.equal(false);
      expect(Validation.isYear('20044')).to.equal(false);
      expect(Validation.isYear('999')).to.equal(false);
      expect(Validation.isYear('')).to.equal(false);
    });

    it('відхиляє рік із майбутнього', () => {
      const nextYear = String(new Date().getFullYear() + 1);
      expect(Validation.isYear(nextYear)).to.equal(false);
    });
  });

  describe('validateBookForm', () => {
    it('проходить для коректних даних', () => {
      const result = Validation.validateBookForm({
        title: 'Code Complete',
        author: 'Steve McConnell',
        year: '2004',
      });
      expect(result.isValid).to.equal(true);
      expect(result.errors).to.have.length(0);
    });

    it('вимагає всі поля', () => {
      const result = Validation.validateBookForm({ title: '', author: '', year: '' });
      expect(result.isValid).to.equal(false);
      expect(result.fieldErrors).to.have.keys('title', 'author', 'year');
    });

    it('відхиляє нечисловий рік', () => {
      const result = Validation.validateBookForm({ title: 'A', author: 'B', year: '20a4' });
      expect(result.isValid).to.equal(false);
      expect(result.fieldErrors.year).to.be.a('string');
    });
  });

  describe('validateUserForm', () => {
    it('вимагає імʼя та email', () => {
      const result = Validation.validateUserForm({ name: '', email: '' });
      expect(result.isValid).to.equal(false);
      expect(result.fieldErrors).to.have.keys('name', 'email');
    });

    it('проходить для коректних даних', () => {
      const result = Validation.validateUserForm({ name: 'Артем', email: 'a@gmail.com' });
      expect(result.isValid).to.equal(true);
    });
  });

  describe('validateUserId', () => {
    it('приймає лише цифри', () => {
      expect(Validation.validateUserId('1725533394038').isValid).to.equal(true);
    });

    it('відхиляє букви та порожнє значення', () => {
      expect(Validation.validateUserId('12ab').isValid).to.equal(false);
      expect(Validation.validateUserId('').isValid).to.equal(false);
    });
  });
});
