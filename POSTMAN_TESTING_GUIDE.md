# 🚀 Backend API Testing Guide - Postman

## ✅ Prerequisites
1. MongoDB running locally or connection string ready
2. Create `.env` file in root with:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/bankapp
JWT_SECRET=your_super_secret_jwt_key_12345
EMAIL_USER=your_email@gmail.com
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_refresh_token
```

3. Install dependencies and start server:
```bash
npm install
npm run dev
```

---

## 📝 API Endpoints & Testing Steps

### **Step 1️⃣: Register User**
**Endpoint:** `POST http://localhost:3000/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "user1@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

**Expected Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "69f8f5a6413fad15b7961149",
    "email": "user1@example.com",
    "name": "John Doe"
  }
}
```

**📌 Save the `token` - you'll need it for protected routes!**

---

### **Step 2️⃣: Register Second User (for receiving money)**
**Endpoint:** `POST http://localhost:3000/api/auth/register`

**Body (JSON):**
```json
{
  "email": "user2@example.com",
  "name": "Jane Smith",
  "password": "password456"
}
```

**📌 Save this user's ID from the response**

---

### **Step 3️⃣: Create Account for User 1**
**Endpoint:** `POST http://localhost:3000/api/account/create`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <PASTE_TOKEN_FROM_STEP1>
```

**Body (JSON):**
```json
{}
```

**Expected Response (201):**
```json
{
  "message": "Account created successfully",
  "account": {
    "userId": "69f8f5a6413fad15b7961149",
    "balance": 0,
    "status": "active",
    "currency": "indian rupees",
    "_id": "69f8f5d2413fad15b796114a",
    "__v": 0
  }
}
```

**📌 Save the `_id` field - this is the FROM account ID**

---

### **Step 4️⃣: Login User 1 (to get token if lost)**
**Endpoint:** `POST http://localhost:3000/api/auth/login`

**Body (JSON):**
```json
{
  "email": "user1@example.com",
  "password": "password123"
}
```

---

### **Step 5️⃣: Create Account for User 2**
**Endpoint:** `POST http://localhost:3000/api/account/create`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <PASTE_TOKEN_FROM_USER2>
```

**Body (JSON):**
```json
{}
```

**📌 Save this account's `_id` - this is the TO account ID**

---

### **Step 6️⃣: Add Initial Balance (Simulate deposit)**
Since there's no deposit endpoint, we'll manually add ledger entry.

For now, assume:
- User 1's Account ID: `69f8f5d2413fad15b796114a` 
- Balance: 0 (needs to be updated)

You need to add a `/api/account/add-balance` endpoint OR manually insert into MongoDB:

**Using MongoDB directly:**
```javascript
db.ledgers.insertOne({
  accountId: ObjectId("69f8f5d2413fad15b796114a"),
  transcationId: null,
  amount: 1000,
  type: "credit",
  balanceAfterTranscation: 1000,
  description: "Initial deposit"
})
```

---

### **Step 7️⃣: Create Transaction (THE MAIN ENDPOINT! ✨)**
**Endpoint:** `POST http://localhost:3000/api/transcation/bank`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <TOKEN_FROM_USER1>
```

**Body (JSON):**
```json
{
  "toAccountId": "69f8f5d2413fad15b796114b",
  "amount": 500,
  "description": "Payment for services rendered"
}
```

**Replace:**
- `toAccountId` with User 2's account ID from Step 5
- `amount` with any amount ≤ User 1's balance
- `description` with your message

**Expected Response (201):**
```json
{
  "message": "Transaction completed successfully",
  "transaction": {
    "transactionId": "69f8f5d2413fad15b796114c",
    "from": "69f8f5d2413fad15b796114a",
    "to": "69f8f5d2413fad15b796114b",
    "amount": 500,
    "description": "Payment for services rendered",
    "status": "completed",
    "senderNewBalance": 500,
    "receiverNewBalance": 500,
    "timestamp": "2026-05-05T10:30:45.123Z"
  }
}
```

---

### **Step 8️⃣: Get Transaction History**
**Endpoint:** `GET http://localhost:3000/api/transcation/history`

**Headers:**
```
Authorization: Bearer <TOKEN_FROM_USER1>
```

**Expected Response (200):**
```json
{
  "message": "Transaction history retrieved",
  "transactions": [
    {
      "_id": "69f8f5d2413fad15b796114c",
      "fromaccountId": "69f8f5d2413fad15b796114a",
      "toaccountId": "69f8f5d2413fad15b796114b",
      "amount": 500,
      "description": "Payment for services rendered",
      "status": "completed",
      "idempotencyKey": "uuid-string-here"
    }
  ]
}
```

---

### **Step 9️⃣: Get Account Details**
**Endpoint:** `GET http://localhost:3000/api/account/details`

**Headers:**
```
Authorization: Bearer <TOKEN_FROM_USER1>
```

**Expected Response (200):**
```json
{
  "account": {
    "_id": "69f8f5d2413fad15b796114a",
    "userId": "69f8f5a6413fad15b7961149",
    "balance": 0,
    "status": "active",
    "currency": "indian rupees",
    "__v": 0
  }
}
```

---

### **Step 🔟: Get Current Balance**
**Endpoint:** `GET http://localhost:3000/api/account/balance`

**Headers:**
```
Authorization: Bearer <TOKEN_FROM_USER1>
```

**Expected Response (200):**
```json
{
  "balance": 500
}
```

---

### **Step 🔐: Logout**
**Endpoint:** `POST http://localhost:3000/api/auth/logout`

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Expected Response (200):**
```json
{
  "message": "User logged out successfully"
}
```

---

## 🔧 Common Errors & Solutions

### ❌ "Unauthorized: No token provided"
**Solution:** Make sure you included the `Authorization: Bearer <token>` header

### ❌ "Your account not found"
**Solution:** Create account first (Step 3 or 5)

### ❌ "Recipient account not found"
**Solution:** Use correct `toAccountId` from Step 5

### ❌ "Insufficient balance"
**Solution:** Add initial balance or reduce transaction amount

### ❌ "Cannot transfer money to the same account"
**Solution:** Use different accounts for sender and receiver

### ❌ "Duplicate transaction"
**Solution:** This is normal - same transaction request was already processed (idempotency protection)

---

## 📊 Flow Summary
```
1. Register User 1 → Get Token
2. Create Account for User 1
3. Register User 2 → Get Token
4. Create Account for User 2
5. Add Initial Balance to User 1 (manually via MongoDB)
6. User 1 sends money to User 2 ← THIS IS YOUR MAIN ENDPOINT!
7. View transaction history
8. Check updated balances
```

---

## 🎯 Complete Example

**User 1 Registration:**
```
POST /api/auth/register
{
  "email": "alice@example.com",
  "name": "Alice",
  "password": "pass123"
}
Response Token: token_alice_12345
User 1 ID: 69f8f5a6413fad15b7961149
```

**User 2 Registration:**
```
POST /api/auth/register
{
  "email": "bob@example.com",
  "name": "Bob",
  "password": "pass456"
}
Response Token: token_bob_67890
User 2 ID: 69f8f5a6413fad15b7961150
```

**Alice Creates Account:**
```
POST /api/account/create
Headers: Authorization: Bearer token_alice_12345
Alice's Account ID: 69f8f5d2413fad15b796114a
```

**Bob Creates Account:**
```
POST /api/account/create
Headers: Authorization: Bearer token_bob_67890
Bob's Account ID: 69f8f5d2413fad15b796114b
```

**Alice Sends 500 to Bob:**
```
POST /api/transcation/bank
Headers: Authorization: Bearer token_alice_12345
{
  "toAccountId": "69f8f5d2413fad15b796114b",
  "amount": 500,
  "description": "Repayment for lunch"
}
✅ SUCCESS!
```

---

Happy testing! 🎉
