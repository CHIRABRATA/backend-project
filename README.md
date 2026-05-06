# 🏦 Backend Banking API

A robust Node.js/Express backend API for managing user authentication, accounts, and financial transactions with MongoDB database integration.

---

## ✨ Features

- **User Authentication** - Register, login, and logout with JWT token-based security
- **Account Management** - Create accounts, view balance, and manage user account details
- **Transaction Handling** - Transfer money between accounts and view transaction history
- **Security** - Password hashing with bcryptjs, JWT authentication middleware, and blacklist token management
- **Email Integration** - Send emails via Nodemailer (Google OAuth2)
- **Database** - MongoDB with Mongoose ODM for reliable data persistence

---

## 📦 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **Express.js** | ^5.2.1 | Web framework |
| **MongoDB** | - | NoSQL Database |
| **Mongoose** | ^9.6.1 | ODM for MongoDB |
| **JWT** | ^9.0.3 | Token-based authentication |
| **bcryptjs** | ^3.0.3 | Password hashing |
| **Nodemailer** | ^8.0.7 | Email service |
| **dotenv** | ^17.4.2 | Environment variables |
| **Nodemon** | ^3.1.14 | Development auto-reload |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd backend-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the root directory
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/bankapp
   JWT_SECRET=your_super_secret_jwt_key_12345
   EMAIL_USER=your_email@gmail.com
   CLIENT_ID=your_google_client_id
   CLIENT_SECRET=your_google_client_secret
   REFRESH_TOKEN=your_refresh_token
   ```

### Running the Server

**Development** (with auto-reload):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

Server will run on `http://localhost:3000` (or your configured PORT)

---

## 📚 API Endpoints

### **Authentication Routes** (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | ❌ No |
| POST | `/login` | Login user and get JWT token | ❌ No |
| POST | `/logout` | Logout and blacklist token | ✅ Yes |

### **Account Routes** (`/api/account`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/create` | Create a new account | ✅ Yes |
| GET | `/details` | Get account details | ✅ Yes |
| GET | `/balance` | Get account balance | ✅ Yes |

### **Transaction Routes** (`/api/transcation`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/bank` | Create a transaction (transfer money) | ✅ Yes |
| GET | `/history` | Get transaction history | ✅ Yes |

---

## 📝 API Usage Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

### Create Account
```bash
POST /api/account/create
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{}
```

### Transfer Money
```bash
POST /api/transcation/bank
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "toAccount": "<recipient_account_id>",
  "amount": 500
}
```

### View Transaction History
```bash
GET /api/transcation/history
Authorization: Bearer <JWT_TOKEN>
```

---

## 📂 Project Structure

```
src/
├── app.js                    # Express app setup and middleware
├── server.js               # Server entry point
├── config/
│   └── db.js              # MongoDB connection configuration
├── controllers/
│   ├── auth.controller.js # Authentication logic
│   ├── account.controller.js # Account management logic
│   └── transcaction.controller.js # Transaction logic
├── middleware/
│   └── auth.middleware.js # JWT verification middleware
├── models/
│   ├── user.model.js      # User schema
│   ├── account.model.js   # Account schema
│   ├── transcation.model.js # Transaction schema
│   ├── ledger.model.js    # Ledger/transaction records
│   └── blacklist.model.js # Blacklisted JWT tokens
├── routes/
│   ├── auth.routes.js     # Authentication routes
│   ├── account.routes.js  # Account routes
│   └── transcation.routes.js # Transaction routes
└── services/
    └── email.service.js   # Email sending utilities
```

---

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication:

1. User registers and receives a JWT token
2. Token is sent in the `Authorization` header as `Bearer <token>`
3. Protected routes validate the token via middleware
4. Logout blacklists the token in the database

---

## 💾 Database Models

### User Model
- email, name, password (hashed), createdAt

### Account Model
- userId, balance, status (active/inactive), currency, createdAt

### Transaction Model
- fromAccount, toAccount, amount, status (pending/completed/failed), timestamp

### Ledger Model
- accountId, amount, type (credit/debit), description, timestamp

### Blacklist Model
- token, expiresAt (for logout functionality)

---

## 🛠️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/bankapp |
| JWT_SECRET | Secret key for signing JWT | your_super_secret_key |
| EMAIL_USER | Email address for sending emails | your_email@gmail.com |
| CLIENT_ID | Google OAuth2 Client ID | xxx.apps.googleusercontent.com |
| CLIENT_SECRET | Google OAuth2 Client Secret | your_secret |
| REFRESH_TOKEN | Google OAuth2 Refresh Token | your_token |

---

## 📖 Testing

See [POSTMAN_TESTING_GUIDE.md](POSTMAN_TESTING_GUIDE.md) for comprehensive API testing steps with Postman examples and sample requests/responses.

---

## 🐛 Common Issues

**MongoDB Connection Error**
- Ensure MongoDB service is running
- Verify MONGO_URI in .env file
- Check network connectivity

**JWT Token Issues**
- Tokens expire after a certain time
- Always include `Authorization: Bearer <token>` header
- Re-login to get a fresh token

**Email Not Sending**
- Verify Google OAuth2 credentials in .env
- Check if "Less secure app access" is enabled for Gmail
- Use an app-specific password for Gmail

---

## 📞 Support

For issues or questions, please refer to the POSTMAN_TESTING_GUIDE.md or check the endpoint documentation above.

---

## 📄 License

ISC License - See package.json for details
