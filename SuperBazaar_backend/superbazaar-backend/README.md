# SuperBazaar Backend API

Backend API for SuperBazaar - An Open Banking Powered E-commerce Platform with BNPL/SNPL features.

## 🚀 Features

- **User Authentication** - JWT-based auth for merchants, suppliers, and customers
- **KYC/KYB Onboarding** - Digital paperless verification
- **Product Catalog** - Full CRUD for wholesale products
- **Order Management** - Create and track orders
- **SNPL (Stock Now Pay Later)** - Working capital loans for merchants
- **BNPL (Buy Now Pay Later)** - Customer financing
- **Credit Scoring** - Mock algorithm for MVP
- **Dashboard Analytics** - Real-time business metrics
- **Transaction History** - Comprehensive financial records

## 📁 Project Structure

```
superbazaar-backend/
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── CreditLine.js
│   ├── Store.js
│   └── Transaction.js
├── controllers/         # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── creditController.js
│   └── dashboardController.js
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── creditRoutes.js
│   ├── storeRoutes.js
│   ├── userRoutes.js
│   └── dashboardRoutes.js
├── middleware/         # Custom middleware
│   └── auth.js
├── utils/             # Helper functions
│   ├── jwtUtils.js
│   ├── creditScoring.js
│   └── seedData.js
├── config/            # Configuration files
├── server.js          # Entry point
└── package.json
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Step 1: Install Dependencies

```bash
cd superbazaar-backend
npm install
```

### Step 2: Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/superbazaar
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
```

### Step 3: Start MongoDB

Make sure MongoDB is running on your machine:

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Step 4: Seed Database (Optional but Recommended)

Populate the database with sample data that matches your frontend:

```bash
npm run seed
```

This creates:
- 1 Merchant user (Ahmed Khan / Khan General Store)
- 2 Supplier users (Metro Wholesale, Bismillah Traders)
- 10 Products (Rice, Oil, Tea, etc.)
- Sample transactions
- Active SNPL credit line

**Sample Credentials:**
```
Merchant:
  Email: ahmed@example.com
  Password: password123

Supplier 1:
  Email: metro@example.com
  Password: password123

Supplier 2:
  Email: bismillah@example.com
  Password: password123
```

### Step 5: Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/signup          - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/me              - Get current user (Protected)
POST   /api/auth/kyc             - Submit KYC data (Protected)
PUT    /api/auth/kyc/verify/:id  - Verify KYC (Protected)
```

### Products
```
GET    /api/products             - Get all products
GET    /api/products/:id         - Get single product
POST   /api/products             - Create product (Suppliers only)
PUT    /api/products/:id         - Update product (Owner only)
DELETE /api/products/:id         - Delete product (Owner only)
```

### Orders
```
POST   /api/orders               - Create order (Merchants only)
GET    /api/orders               - Get user's orders
GET    /api/orders/:id           - Get single order
PUT    /api/orders/:id/status    - Update order status
```

### Credit (SNPL/BNPL)
```
GET    /api/credit               - Get user's credit lines
GET    /api/credit/score         - Calculate credit score
POST   /api/credit/snpl/apply    - Apply for SNPL (Merchants)
POST   /api/credit/bnpl/apply    - Apply for BNPL (Customers)
POST   /api/credit/:id/payment   - Make payment on credit line
```

### Dashboard
```
GET    /api/dashboard/stats      - Get dashboard statistics
GET    /api/dashboard/analytics  - Get analytics data
```

### Stores
```
GET    /api/stores/my-store      - Get merchant's store
PUT    /api/stores/my-store      - Update store info
```

### Users
```
PUT    /api/users/profile        - Update user profile
GET    /api/users/transactions   - Get transaction history
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📝 Example API Calls

### Register a Merchant

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+923001234567",
    "password": "password123",
    "userType": "merchant",
    "businessName": "John General Store",
    "businessAddress": "Karachi"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "password123"
  }'
```

### Get Products

```bash
curl -X GET http://localhost:5000/api/products?category=Groceries
```

### Apply for SNPL

```bash
curl -X POST http://localhost:5000/api/credit/snpl/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "requestedAmount": 200000
  }'
```

## 🧪 Testing

You can test the API using:
- **Postman** - Import the endpoints above
- **Thunder Client** (VS Code extension)
- **cURL** - See examples above
- **Your Frontend** - Connect your React app!

## 🔧 Connecting to Your Frontend

In your React frontend, update API calls to point to this backend:

```javascript
// Example in your frontend code
const API_URL = 'http://localhost:5000/api';

// Login example
const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  
  return data;
};

// Get products example
const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  const data = await response.json();
  return data.data.products;
};

// Protected request example
const getDashboard = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/dashboard/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data.data.stats;
};
```

## 📊 Database Models

### User Schema
- Basic info (name, email, phone, password)
- User type (merchant, supplier, customer)
- KYC data (CNIC, NTN, bank IBAN)
- Credit score
- Gamification (reward points, badges)

### Product Schema
- Product details (name, description, category)
- Pricing and inventory
- Supplier reference
- Ratings and reviews

### Order Schema
- Order items and pricing
- Merchant and supplier references
- Payment method (cash, SNPL, BNPL)
- Order status and tracking

### CreditLine Schema
- Type (SNPL or BNPL)
- Credit limits and usage
- Installment schedule
- Payment history

## 🚧 MVP Limitations & Future Enhancements

**Current MVP Limitations:**
- Mock credit scoring algorithm
- Auto-approve loans (no manual review)
- Simplified KYC verification
- No real payment gateway integration
- No email/SMS notifications

**Future Enhancements:**
- Integration with real credit bureaus
- Real bank account linking (Open Banking API)
- Payment gateway integration (JazzCash, EasyPaisa)
- Email/SMS notifications
- Advanced analytics and reporting
- Multi-factor authentication
- File upload for KYC documents
- Real-time order tracking
- Supplier rating system

## 🐛 Troubleshooting

**MongoDB Connection Error:**
```
Make sure MongoDB is running:
- Check: mongod --version
- Start: brew services start mongodb-community (macOS)
```

**Port Already in Use:**
```
Change PORT in .env file or kill the process:
- Find process: lsof -i :5000
- Kill it: kill -9 <PID>
```

**Module Not Found:**
```
npm install
```

## 📄 License

This project is for educational purposes (Final Year Project).

## 👨‍💻 Author

Your Name - Final Year Project

## 🙏 Acknowledgments

- Node.js & Express.js
- MongoDB & Mongoose
- JWT for authentication
- Your frontend team for API requirements
