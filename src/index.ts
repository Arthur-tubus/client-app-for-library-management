import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './styles/main.scss';

const app = document.getElementById('app') as HTMLDivElement;

const title = document.createElement('h1');
title.className = 'text-center my-4';
title.textContent = 'Система Управління Бібліотекою';

app.appendChild(title);
