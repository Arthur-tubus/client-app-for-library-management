import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './styles/main.scss';
import { createButton } from './ui/components/Button';
import { promptModal, showModal } from './ui/components/Modal';
import { renderBookForm } from './ui/components/BookForm';
import { renderUserForm } from './ui/components/UserForm';

const app = document.getElementById('app') as HTMLDivElement;

const title = document.createElement('h1');
title.className = 'text-center my-4';
title.textContent = 'Система Управління Бібліотекою';

app.appendChild(title);
app.append(
  createButton('Тест модалки', 'primary', 'button', async () => {
    const id = await promptModal({
      title: 'Введіть ID користувача для позичення книги:',
      placeholder: 'ID',
      validate: (v) => (/^\d+$/.test(v) ? null : 'ID має містити лише цифри'),
    });
    if (id) {
      await showModal({ message: `Отримано ID: ${id}` });
    }
  }),
);

renderBookForm(app, (book) => console.log(book.toJSON()));
renderUserForm(app, (user) => console.log(user.toJSON()));
