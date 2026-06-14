# 🚀 Strive Blog

## 📖 Descrizione

Strive Blog è un'applicazione Full Stack sviluppata durante il percorso di formazione Web Developer.

Il progetto permette di gestire autori e articoli di un blog attraverso API REST realizzate con Express e MongoDB, con un frontend React dedicato alla visualizzazione dei contenuti.

---

## 🛠️ Tecnologie utilizzate

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Cloudinary
* Multer
* Multer Storage Cloudinary
* Cors
* Dotenv
* Bcrypt
* JSON Web Token
* Nodemailer
* Nodemon

### Frontend

* React
* React Bootstrap
* React Router DOM
* Fetch API
* Draft.js
* React Draft WYSIWYG
* React Icons

---

## ✨ Funzionalità

### 👤 Gestione Autori

* Registrazione di un autore con password cifrata
* Visualizzazione di tutti gli autori
* Visualizzazione di un singolo autore
* Modifica di un autore
* Eliminazione di un autore
* Paginazione dei risultati
* Upload dell'avatar su Cloudinary

### 🔐 Autenticazione

* Registrazione con cifratura della password tramite Bcrypt
* Login tramite email e password
* Generazione di un token JWT con durata di un'ora
* Recupero del profilo associato al token
* Verifica del token tramite middleware
* Invio di un'email di benvenuto dopo la registrazione

### 📝 Gestione Blog Post

* Creazione di un blog post
* Visualizzazione di tutti i blog post
* Visualizzazione di un singolo blog post
* Modifica di un blog post
* Eliminazione di un blog post
* Collegamento di ogni post al relativo autore
* Popolamento dei dati dell'autore tramite Mongoose
* Upload della cover su Cloudinary

### 💬 Gestione Commenti

* Creazione di un commento associato a un blog post
* Visualizzazione di tutti i commenti di un blog post
* Visualizzazione di un singolo commento
* Modifica di un commento
* Eliminazione di un commento

### 🌐 Frontend React

* Home con lista dei post recuperati dalle API Express
* Pagina di dettaglio di un post
* Visualizzazione di titolo, contenuto e autore popolato nelle card e nel dettaglio
* Navigazione tra home, dettaglio del post e pagina di creazione
* Creazione di nuovi blog post tramite richiesta `POST`
* Selezione dell'autore recuperato dalle API
* Editor di testo WYSIWYG per la scrittura dei contenuti
* Componente per la gestione dei like lato interfaccia
* Interfaccia basata sul template fornito da Strive School

> I like sono gestiti nello stato locale del frontend e non vengono salvati nel database.

---

## 📂 Struttura del progetto

```text
Strive-Blog
│
├── README.md
│
├── Backend
│   ├── config
│   │   └── db.js
│   ├── exceptions
│   │   └── AppError.js
│   ├── middlewares
│   │   ├── auth
│   │   │   └── verifyToken.js
│   │   ├── errors
│   │   │   └── errorHandler.js
│   │   └── multer
│   │       └── index.js
│   ├── modules
│   │   ├── auth
│   │   │   ├── password
│   │   │   │   └── password.service.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.route.js
│   │   │   └── auth.service.js
│   │   ├── authors
│   │   │   ├── authors.controller.js
│   │   │   ├── authors.route.js
│   │   │   ├── authors.schema.js
│   │   │   └── authors.service.js
│   │   ├── comments
│   │   │   ├── comments.controller.js
│   │   │   ├── comments.route.js
│   │   │   ├── comments.schema.js
│   │   │   └── comments.service.js
│   │   ├── email
│   │   │   └── email.service.js
│   │   └── posts
│   │       ├── posts.controller.js
│   │       ├── posts.route.js
│   │       ├── posts.schema.js
│   │       └── posts.service.js
│   ├── main.js
│   ├── package.json
│   └── .env
│
└── Frontend
    ├── public
    ├── src
    │   ├── assets
    │   ├── components
    │   ├── data
    │   ├── views
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## ⚙️ Installazione

### 1. Clonare il repository

```bash
git clone https://github.com/christianvalastroo/Strive-Blog.git
```

### 2. Installare il Backend

```bash
cd Backend
npm install
npm run dev
```

Il backend sarà disponibile su `http://localhost:3001`.

### 3. Installare il Frontend

Da un secondo terminale, partendo dalla cartella principale del progetto:

```bash
cd Frontend
npm install
npm start
```

Il frontend sarà disponibile su `http://localhost:3000`.

---

## 🔐 Variabili d'ambiente

Creare un file `.env` nella cartella `Backend`:

```env
MONGO_URL=stringa_di_connessione_mongodb
CLOUDINARY_CLOUD_NAME=nome_cloud_cloudinary
CLOUDINARY_API_KEY=api_key_cloudinary
CLOUDINARY_API_SECRET=api_secret_cloudinary
JWT_SECRET=chiave_segreta_jwt
EMAIL_USER=indirizzo_email
EMAIL_PASSWORD=password_per_app
```

Per Gmail, `EMAIL_PASSWORD` deve contenere una password per le app e non la
password principale dell'account.

---

## 📡 API Disponibili

Il backend viene eseguito su `http://localhost:3001`.

### Autenticazione

| Metodo | Endpoint       | Descrizione                                |
| ------ | -------------- | ------------------------------------------ |
| POST   | /auth/register | Registra un autore e invia l'email iniziale |
| POST   | /auth/login    | Effettua il login e restituisce il token   |
| GET    | /auth/me       | Recupera il profilo associato al token     |

Per accedere a `GET /auth/me` è necessario inviare il token:

```http
Authorization: Bearer TOKEN_JWT
```

### Authors

| Metodo | Endpoint                  | Descrizione                 |
| ------ | ------------------------- | --------------------------- |
| GET    | /authors                  | Recupera tutti gli autori   |
| GET    | /authors/:id              | Recupera un singolo autore  |
| POST   | /authors                  | Crea un autore              |
| PUT    | /authors/:id              | Modifica un autore          |
| DELETE | /authors/:id              | Elimina un autore           |
| PATCH  | /authors/:authorId/avatar | Carica l'avatar su Cloudinary |

### Blog Posts

| Metodo | Endpoint                       | Descrizione                    |
| ------ | ------------------------------ | ------------------------------ |
| GET    | /blogPosts                     | Recupera tutti i blog post     |
| GET    | /blogPosts/:id                 | Recupera un singolo blog post  |
| POST   | /blogPosts                     | Crea un blog post              |
| PUT    | /blogPosts/:id                 | Modifica un blog post          |
| DELETE | /blogPosts/:id                 | Elimina un blog post           |
| PATCH  | /blogPosts/:blogPostId/cover   | Carica la cover su Cloudinary  |

### Commenti

| Metodo | Endpoint                                | Descrizione                              |
| ------ | --------------------------------------- | ---------------------------------------- |
| GET    | /blogPosts/:id/comments                 | Recupera tutti i commenti del post       |
| GET    | /blogPosts/:id/comments/:commentId      | Recupera un singolo commento             |
| POST   | /blogPosts/:id/comments                 | Aggiunge un commento al post             |
| PUT    | /blogPosts/:id/comments/:commentId      | Modifica un commento                     |
| DELETE | /blogPosts/:id/comments/:commentId      | Elimina un commento                      |

La richiesta `GET /authors` supporta la paginazione tramite i parametri `page` e `limit`:

```http
GET /authors?page=1&limit=10
```

La paginazione dei blog post non è ancora implementata.

Per gli endpoint di upload è necessario inviare una richiesta `multipart/form-data`:

* campo `avatar` per l'avatar dell'autore
* campo `cover` per la cover del blog post

---

## 🧩 Modelli dati

### Autore

```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario.rossi@example.com",
  "password": "password_scelta",
  "dataDiNascita": "1990-01-01",
  "avatar": "https://res.cloudinary.com/example/image/upload/avatar.jpg"
}
```

La password ricevuta durante la registrazione tramite `/auth/register` viene
cifrata prima di essere salvata.

### Blog post

```json
{
  "category": "Tecnologia",
  "title": "Titolo del post",
  "cover": "https://res.cloudinary.com/example/image/upload/cover.jpg",
  "readTime": {
    "value": 5,
    "unit": "minutes"
  },
  "author": "ID_AUTORE",
  "content": "<p>Contenuto del post</p>"
}
```

### Commento

```json
{
  "name": "Mario Rossi",
  "comment": "Testo del commento"
}
```

---

## 🚧 Stato attuale e limitazioni

* Il middleware JWT è applicato attualmente a `GET /auth/me`.
* Le API di autori, blog post e commenti non sono ancora protette dal token.
* La risposta di registrazione deve ancora essere ripulita dal campo password.
* Il frontend non include ancora le pagine di registrazione e login.
* Il token non viene ancora gestito nel `localStorage` del frontend.

Il modello e il frontend utilizzano gli stessi campi inglesi per i blog post:
`title`, `category`, `cover`, `readTime`, `author` e `content`.

Le rotte di lista, dettaglio e modifica popolano il riferimento all'autore con
`.populate("author")`. Il frontend mostra nome, cognome e avatar usando i campi
italiani del modello autore: `nome`, `cognome` e `avatar`.

Inoltre:

* non esiste una rotta frontend dedicata alla pagina `404`;
* gli URL delle API sono scritti direttamente nel codice frontend;
* i like non vengono salvati nel database;
* gli avatar richiedono un URL immagine valido, ad esempio quello restituito da Cloudinary;
* i post che fanno riferimento a un autore eliminato ricevono `author: null`;
* non sono presenti test automatici per le API backend;
* il frontend contiene un solo test di rendering della home.

---

## 🎯 Obiettivi del progetto

* Comprendere il funzionamento di Express.js
* Utilizzare MongoDB Atlas e Mongoose
* Creare API REST complete
* Gestire operazioni CRUD
* Implementare la paginazione degli autori
* Collegare un frontend React ad un backend Node.js
* Gestire file e immagini attraverso Cloudinary
* Collegare i blog post agli autori tramite riferimenti MongoDB
* Gestire commenti incorporati nei blog post

---
