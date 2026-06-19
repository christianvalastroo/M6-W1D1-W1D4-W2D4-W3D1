# Strive Blog

Applicazione full stack per la gestione di un blog, realizzata con un backend
REST in Node.js, Express e MongoDB e un frontend React.

## Funzionalità

- registrazione e login degli autori;
- password cifrate con bcrypt;
- autenticazione tramite token JWT;
- login con Google OAuth tramite Passport;
- ruoli `user` e `admin`;
- CRUD di autori, blog post e commenti;
- controllo della proprietà di post e commenti;
- paginazione di autori e blog post;
- ricerca dei blog post per titolo;
- validazione dei dati degli autori con `express-validator`;
- upload di avatar e cover su Cloudinary;
- email di benvenuto e notifica pubblicazione post con Nodemailer;
- cache in memoria delle richieste GET;
- CORS configurato sull'URL del frontend;
- gestione centralizzata degli errori;
- configurazione tramite variabili d'ambiente per usare URL diversi tra locale e deploy.

## Tecnologie

### Backend

- Node.js e Express
- MongoDB e Mongoose
- bcrypt
- JSON Web Token
- Passport e Google OAuth 2.0
- express-validator
- Cloudinary e Multer
- Nodemailer

### Frontend

- React
- React Router
- React Bootstrap
- Draft.js

## Struttura principale

```text
.
├── Backend
│   ├── config
│   ├── exceptions
│   ├── middlewares
│   │   ├── auth
│   │   ├── authors
│   │   ├── errors
│   │   ├── globals
│   │   └── multer
│   ├── modules
│   │   ├── auth
│   │   ├── authors
│   │   ├── comments
│   │   ├── email
│   │   ├── oauth
│   │   └── posts
│   ├── main.js
│   └── package.json
├── Frontend
│   ├── public
│   ├── src
│   ├── vercel.json
│   └── package.json
└── README.md
```

## Installazione

Clona il repository:

```bash
git clone https://github.com/christianvalastroo/Strive-Blog.git
cd Strive-Blog
```

Installa e avvia il backend:

```bash
cd Backend
npm install
npm run dev
```

Il server viene avviato su `http://localhost:3001`.

In un altro terminale, installa e avvia il frontend:

```bash
cd Frontend
npm install
npm start
```

Il frontend viene avviato su `http://localhost:3000`.

## Variabili d'ambiente

Crea `Backend/.env`:

```env
PORT=3001
MONGO_URL=stringa_di_connessione_mongodb
SERVERURL=url_del_backend

CLOUDINARY_CLOUD_NAME=nome_cloud_cloudinary
CLOUDINARY_API_KEY=api_key_cloudinary
CLOUDINARY_API_SECRET=api_secret_cloudinary

JWT_SECRET=chiave_segreta_jwt

EMAIL_USER=indirizzo_email
EMAIL_PASSWORD=password_per_app

GOOGLE_CLIENT_ID=client_id_google
GOOGLE_CLIENT_SECRET=client_secret_google
GOOGLE_CALLBACK_URL=url_callback_google
FRONTEND_URL=url_del_frontend
```

Con Gmail, `EMAIL_PASSWORD` deve essere una password per le app.

Per il login Google, `GOOGLE_CALLBACK_URL` deve corrispondere all'URI di
redirect configurato nella Google Cloud Console. `FRONTEND_URL` viene usato
dal backend per rimandare l'utente al frontend dopo il login Google e per
configurare CORS.

Crea anche `Frontend/.env`:

```env
REACT_APP_SERVERURL=url_del_backend
```

Nel frontend le chiamate API usano `process.env.REACT_APP_SERVERURL`, così
l'indirizzo del backend non è scritto direttamente nei componenti.

## Autenticazione

Un autore rappresenta anche l'utente dell'applicazione. La registrazione crea
un documento `Author`, cifra la password e assegna automaticamente il ruolo
`user`. Gli utenti creati con Google vengono collegati tramite `googleId` e
provider `google`.

### Registrazione

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario.rossi@example.com",
  "password": "password123",
  "dataDiNascita": "1990-01-01"
}
```

La password deve contenere almeno 8 caratteri. Il ruolo non può essere
assegnato durante la registrazione.

### Login

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "mario.rossi@example.com",
  "password": "password123"
}
```

La risposta contiene un token JWT valido per un'ora. Per utilizzare una route
protetta:

```http
Authorization: Bearer TOKEN_JWT
```

### Login con Google

```http
GET /auth/google
```

L'endpoint avvia il flusso OAuth con Google. Dopo il callback su
`/auth/google/callback`, il backend crea o aggiorna l'autore collegato
all'email Google, genera un JWT e reindirizza il browser al frontend indicato
da `FRONTEND_URL`:

```text
FRONTEND_URL/login?token=TOKEN_JWT
```

La pagina di login salva il token in `localStorage` e porta l'utente al
profilo.

## API

Base URL: valore configurato nelle variabili `SERVERURL` e
`REACT_APP_SERVERURL`.

### Auth

| Metodo | Endpoint | Accesso | Descrizione |
| --- | --- | --- | --- |
| POST | `/auth/register` | Pubblico | Registra un autore |
| POST | `/auth/login` | Pubblico | Restituisce un token JWT |
| GET | `/auth/google` | Pubblico | Avvia il login con Google |
| GET | `/auth/google/callback` | Pubblico | Callback OAuth e redirect al frontend |
| GET | `/auth/me` | Autenticato | Restituisce il profilo corrente |

Nel file `main.js` sono presenti anche gli alias `/login` e `/me`, usati per
compatibilità con alcune chiamate del frontend.

### Autori

| Metodo | Endpoint | Accesso | Descrizione |
| --- | --- | --- | --- |
| GET | `/authors` | Pubblico | Elenca gli autori |
| POST | `/authors` | Pubblico | Crea un autore |
| GET | `/authors/:id/blogPosts` | Pubblico | Elenca i post di un autore |
| GET | `/authors/:id` | Pubblico | Restituisce un autore |
| PUT | `/authors/:id` | Proprietario | Modifica il proprio profilo |
| DELETE | `/authors/:id` | Proprietario | Elimina il proprio profilo |
| PATCH | `/authors/:authorId/avatar` | Proprietario | Carica il proprio avatar |
| PATCH | `/authors/:id/role` | Admin | Modifica il ruolo di un autore |

I nuovi autori possono essere creati tramite `POST /auth/register` oppure
tramite `POST /authors`.

Per modificare un ruolo:

```json
{
  "role": "admin"
}
```

I valori ammessi sono `user` e `admin`.

### Blog post

| Metodo | Endpoint | Accesso | Descrizione |
| --- | --- | --- | --- |
| GET | `/blogPosts` | Pubblico | Elenca i post |
| GET | `/blogPosts/:id` | Pubblico | Restituisce un post |
| POST | `/blogPosts` | Autenticato | Crea un post |
| PUT | `/blogPosts/:id` | Proprietario | Modifica un proprio post |
| DELETE | `/blogPosts/:id` | Proprietario | Elimina un proprio post |
| PATCH | `/blogPosts/:blogPostId/cover` | Proprietario | Carica la cover |

Esempio di creazione:

```json
{
  "category": "Tecnologia",
  "title": "Titolo del post",
  "readTime": {
    "value": 5,
    "unit": "minutes"
  },
  "content": "<p>Contenuto del post</p>"
}
```

L'autore non deve essere inviato nel body: viene ricavato automaticamente dal
token JWT. Dopo la creazione il backend prova a inviare una email di conferma
all'autore.

### Commenti

| Metodo | Endpoint | Accesso | Descrizione |
| --- | --- | --- | --- |
| GET | `/blogPosts/:id/comments` | Pubblico | Elenca i commenti |
| GET | `/blogPosts/:id/comments/:commentId` | Pubblico | Restituisce un commento |
| POST | `/blogPosts/:id/comments` | Autenticato | Crea un commento |
| PUT | `/blogPosts/:id/comments/:commentId` | Proprietario | Modifica il proprio commento |
| DELETE | `/blogPosts/:id/comments/:commentId` | Proprietario | Elimina il proprio commento |

Esempio:

```json
{
  "comment": "Articolo interessante",
  "rate": 5
}
```

Il nome e l'ID dell'autore del commento vengono ricavati dal token. `rate`
accetta valori da 1 a 5.

## Paginazione

Le liste di autori e post supportano `page` e `pageSize`. Per compatibilità è
accettato anche `limit`. La lista dei post supporta anche il filtro `title`.

```http
GET /authors?page=1&pageSize=10
GET /blogPosts?page=1&pageSize=10
GET /blogPosts?title=react
```

La dimensione massima di una pagina di blog post è 100.

## Upload immagini

Gli endpoint di upload richiedono `multipart/form-data`:

- campo `avatar` per `PATCH /authors/:authorId/avatar`;
- campo `cover` per `PATCH /blogPosts/:blogPostId/cover`.

Sono accettati file `jpg`, `jpeg`, `png` e `webp`.

## Cache

Le risposte GET di autori, post e commenti vengono conservate in memoria per
10 minuti. Una richiesta di scrittura completata correttamente svuota la
cache.

## Deploy frontend

Il frontend contiene `Frontend/vercel.json`:

```json
{
    "$schema": "https://openapi.vercel.sh/vercel.json",
    "rewrites": [
        {
            "source": "/(.*)",
            "destination": "/index.html"
        }
    ]
}
```

Questa configurazione permette a React Router di gestire correttamente il
refresh delle pagine su Vercel, ad esempio `/login`, `/profile` o una pagina
di dettaglio blog.

## Stato del progetto

Il backend implementa autenticazione locale e Google OAuth, autorizzazione,
ruoli, validazione, upload e CRUD principali. Il frontend include registrazione,
login, login Google, profilo, creazione e lettura dei post. Non sono ancora
presenti test automatici completi per le API.
