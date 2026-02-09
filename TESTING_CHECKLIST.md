# SuperBazaar MVP Testing Checklist

## Pre-Testing Setup

### ✅ Before You Start Testing

1. **Backend Running**
   ```bash
   cd SuperBazaar_backend/superbazaar-backend
   npm run dev
   ```
   - Expected: Server running on port 5000
   - Verify: Open http://localhost:5000/api/health
   - Should see: `{"status":"OK","message":"SuperBazaar API is running",...}`

2. **Frontend Running**
   ```bash
   cd C:\Users\KTS\Desktop\SuperBazaar
   npm run dev
   ```
   - Expected: Vite server on http://localhost:3000
   - Should auto-open in browser

3. **Database Seeded**
   - If not done: `npm run seed` in backend folder
   - Verify seed credentials:
     - Merchant: `ahmed@example.com` / `password123`
     - Supplier 1: `metro@example.com` / `password123`
     - Supplier 2: `bismillah@example.com` / `password123`

---

## 🔐 AUTHENTICATION TESTS

### Test 1: Login with Valid Credentials
**Steps:**
1. Open app in browser (should show splash screen)
2. Click through to Login screen
3. Enter:
   - Email: `ahmed@example.com`
   - Password: `password123`
4. Click "Login"

**Expected Results:**
- ✅ "Logging in..." button text appears
- ✅ No error messages
- ✅ Redirects to Dashboard
- ✅ Dashboard shows "Welcome back, Ahmed Khan"
- ✅ Shows "Khan General Store, Karachi"

**How to Verify:**
- Open Browser DevTools (F12) → Console
- Should see: API Request logs with successful login
- Open Application tab → Local Storage
- Should see: `token` and `user` stored

---

### Test 2: Login with Invalid Credentials
**Steps:**
1. Logout (refresh page to go back to login)
2. Enter:
   - Email: `wrong@example.com`
   - Password: `wrongpassword`
3. Click "Login"

**Expected Results:**
- ✅ Red error box appears
- ✅ Error message: "Invalid credentials" or similar
- ✅ Stays on Login screen
- ✅ Button returns to "Login" text

**How to Verify:**
- Check Console for 401 error
- No token in localStorage

---

### Test 3: Login with Empty Fields
**Steps:**
1. Leave email and password empty
2. Click "Login"

**Expected Results:**
- ✅ HTML5 validation prevents submission
- ✅ "Please fill out this field" browser message

---

### Test 4: Token Persistence
**Steps:**
1. Login successfully with `ahmed@example.com`
2. Refresh the page (F5)

**Expected Results:**
- ✅ Stays logged in
- ✅ Still shows Dashboard with user info
- ✅ No redirect to login

**How to Verify:**
- Check localStorage still has token
- Check Console for API call to `/auth/me` endpoint

---

### Test 5: Logout Functionality
**Steps:**
1. Login successfully
2. Open Browser DevTools → Console
3. Type: `api.auth.logout()` (if you've added logout button, use that)
4. Or clear localStorage manually

**Expected Results:**
- ✅ Token removed from localStorage
- ✅ User removed from localStorage
- ✅ Can't access protected routes

---

## 📦 PRODUCTS/MARKETPLACE TESTS

### Test 6: Load Products from Database
**Steps:**
1. Login successfully
2. Click "Marketplace" quick action or navigate to marketplace
3. Wait for products to load

**Expected Results:**
- ✅ Shows "Loading products..." briefly
- ✅ Displays 10 products from database
- ✅ Each product shows:
   - Product name (e.g., "Rice - 50kg Bag")
   - Price (e.g., "PKR 8,500")
   - Rating (e.g., "4.8")
   - Supplier name (e.g., "Metro Wholesale")
   - Product image

**How to Verify:**
- Open DevTools → Network tab
- Should see: GET request to `/api/products`
- Response status: 200
- Response contains array of 10 products

---

### Test 7: Category Filtering
**Steps:**
1. On Marketplace screen
2. Note the current products
3. Click "Groceries" category button
4. Click "Beverages" category button
5. Click "All" category button

**Expected Results:**
- ✅ "Groceries" shows only grocery items
- ✅ "Beverages" shows only beverage items
- ✅ "All" shows all 10 products
- ✅ Loading indicator appears during filter
- ✅ Products update correctly

**How to Verify:**
- Check Network tab
- Should see: GET `/api/products?category=Groceries`
- Filtered products returned

---

### Test 8: Products Show Real Data
**Steps:**
1. View products in Marketplace
2. Compare with seeded data

**Expected Products from Seed:**
1. Rice - 50kg Bag (PKR 8,500)
2. Cooking Oil - 5L (PKR 3,200)
3. Tea - 1kg Pack (PKR 1,500)
4. Soap Bars (PKR 850)
5. Biscuits (PKR 2,400)
6. Detergent Powder (PKR 1,200)
7. Sugar - 50kg Bag (PKR 5,500)
8. Soft Drinks (PKR 1,800)
9. Flour - 20kg Bag (PKR 2,200)
10. Chips (PKR 1,950)

**Expected Results:**
- ✅ All 10 products display
- ✅ Prices match database
- ✅ Names match database
- ✅ Supplier names match (Metro Wholesale, Bismillah Traders)

---

### Test 9: Product Images Load
**Steps:**
1. View Marketplace
2. Observe product images

**Expected Results:**
- ✅ Images load from Unsplash URLs
- ✅ If image fails, fallback displays
- ✅ No broken image icons

---

### Test 10: Error Handling - Backend Down
**Steps:**
1. Stop the backend server (Ctrl+C)
2. Try to load Marketplace
3. Restart backend

**Expected Results:**
- ✅ Shows error message: "Failed to load products"
- ✅ Red error box appears
- ✅ No products displayed
- ✅ After backend restart and page refresh, products load

---

## 📊 DASHBOARD TESTS

### Test 11: Dashboard Shows User Info
**Steps:**
1. Login as `ahmed@example.com`
2. View Dashboard

**Expected Results:**
- ✅ Header shows "Welcome back,"
- ✅ Shows name: "Ahmed Khan"
- ✅ Shows business: "Khan General Store, Karachi"
- ✅ Profile icon button visible

**How to Verify:**
- Check that it's NOT showing hardcoded "Ahmed Khan"
- Login as different user (metro@example.com) should show different name

---

### Test 12: Dashboard Stats Load
**Steps:**
1. View Dashboard
2. Scroll to stats section

**Expected Results:**
- ✅ Shows Total Revenue
- ✅ Shows Expenses
- ✅ Shows Net Profit
- ✅ Numbers format correctly (PKR with commas)

**How to Verify:**
- Open DevTools → Network
- Should see: GET `/api/dashboard/stats`
- Response contains revenue, expenses, profit data

---

### Test 13: Recent Transactions Display
**Steps:**
1. View Dashboard
2. Scroll to Recent Transactions section

**Expected Results:**
- ✅ Shows list of transactions
- ✅ Each transaction has:
   - Description
   - Amount (with + or -)
   - Type indicator (income/expense)
- ✅ From seeded data or real data

---

### Test 14: Quick Actions Work
**Steps:**
1. On Dashboard
2. Click each quick action button:
   - Payments
   - Marketplace
   - My Orders
   - Analytics

**Expected Results:**
- ✅ Each button navigates to correct screen
- ✅ No console errors
- ✅ Smooth transitions

---

## 🛒 CART TESTS

### Test 15: Cart Context Initialized
**Steps:**
1. Open DevTools → Console
2. Type: `localStorage.getItem('cart')`

**Expected Results:**
- ✅ Returns `[]` or cart data
- ✅ Cart persists across page refreshes

---

### Test 16: Cart Persistence
**Steps:**
1. Add items to cart (if cart functionality is in UI)
2. Refresh page
3. Check cart

**Expected Results:**
- ✅ Cart items persist
- ✅ Quantities preserved
- ✅ Total price correct

---

## 🧪 INTEGRATION TESTS

### Test 17: Complete User Journey (Happy Path)
**Steps:**
1. Start at login
2. Login with `ahmed@example.com`
3. View Dashboard (see your name)
4. Navigate to Marketplace
5. View products (see 10 items)
6. Filter by category
7. Navigate back to Dashboard

**Expected Results:**
- ✅ Smooth flow with no errors
- ✅ All data displays correctly
- ✅ Navigation works
- ✅ State persists

**Time Estimate:** 2-3 minutes

---

### Test 18: Network Resilience
**Steps:**
1. Open DevTools → Network tab
2. Throttle network to "Slow 3G"
3. Navigate to Marketplace
4. Observe loading states

**Expected Results:**
- ✅ Loading indicators show
- ✅ Eventually loads successfully
- ✅ No crashes or infinite loops

---

### Test 19: Browser Console - No Critical Errors
**Steps:**
1. Use the app normally
2. Keep DevTools Console open

**Expected Results:**
- ✅ No red error messages
- ✅ API calls logged (if dev mode)
- ✅ No 404 errors
- ✅ Warning messages are acceptable

**Common Acceptable Warnings:**
- React development mode warnings
- Image loading warnings

---

### Test 20: Multiple User Types
**Steps:**
1. Logout
2. Login as `metro@example.com` / `password123`
3. View Dashboard

**Expected Results:**
- ✅ Shows "Metro Wholesale" name
- ✅ Different user data
- ✅ User type reflects (supplier vs merchant)

---

## 🔍 BROWSER COMPATIBILITY TESTS

### Test 21: Chrome/Edge
**Steps:**
1. Open in Chrome or Edge
2. Complete basic user journey

**Expected Results:**
- ✅ Works perfectly

---

### Test 22: Firefox
**Steps:**
1. Open in Firefox
2. Complete basic user journey

**Expected Results:**
- ✅ Works correctly
- ✅ Styles render properly

---

## 📱 RESPONSIVE DESIGN TESTS

### Test 23: Mobile View
**Steps:**
1. Open DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select iPhone or Android
4. Navigate through app

**Expected Results:**
- ✅ Layout adapts to mobile
- ✅ All buttons clickable
- ✅ Text readable
- ✅ No horizontal scroll

---

## 🐛 ERROR SCENARIOS

### Test 24: Invalid Token
**Steps:**
1. Login successfully
2. Open DevTools → Application → Local Storage
3. Change token value to "invalid_token_123"
4. Refresh page

**Expected Results:**
- ✅ Auto-logs out
- ✅ Redirects to login
- ✅ Token cleared from storage

---

### Test 25: 404 - Nonexistent Product
**Steps:**
1. Open Console
2. Try: `api.products.getProduct('invalid_id_123')`

**Expected Results:**
- ✅ Returns error
- ✅ Error message displayed
- ✅ Doesn't crash app

---

### Test 26: Network Timeout
**Steps:**
1. Open DevTools → Network
2. Enable "Offline" mode
3. Try to load Marketplace

**Expected Results:**
- ✅ Shows error message
- ✅ Handles gracefully
- ✅ Re-enable network and retry works

---

## 📈 PERFORMANCE TESTS

### Test 27: Page Load Speed
**Steps:**
1. Open DevTools → Network
2. Hard refresh (Ctrl+Shift+R)
3. Note load time

**Expected Results:**
- ✅ Initial load < 3 seconds
- ✅ Marketplace load < 2 seconds
- ✅ No unnecessary re-renders

---

### Test 28: Memory Leaks
**Steps:**
1. Open DevTools → Performance
2. Navigate between screens 10 times
3. Check memory usage

**Expected Results:**
- ✅ Memory doesn't continuously increase
- ✅ No console warnings about memory

---

## 🔐 SECURITY TESTS

### Test 29: Token in Headers
**Steps:**
1. Login successfully
2. Open DevTools → Network
3. Navigate to Marketplace
4. Click on `/api/products` request
5. View Request Headers

**Expected Results:**
- ✅ Authorization header present
- ✅ Format: "Bearer [token]"
- ✅ Token matches localStorage token

---

### Test 30: Protected Routes
**Steps:**
1. Don't login
2. Try to access: `http://localhost:3000` and navigate manually
3. Or clear localStorage and refresh

**Expected Results:**
- ✅ Can't access dashboard without login
- ✅ API returns 401 for protected endpoints
- ✅ Auto-logout triggers

---

## 📝 FINAL CHECKLIST

### Core Functionality ✓
- [ ] Login works with real API
- [ ] Dashboard shows real user data
- [ ] Marketplace loads 10 products from database
- [ ] Category filtering works
- [ ] Authentication persists on refresh
- [ ] Error handling works
- [ ] Loading states display
- [ ] No console errors

### Data Accuracy ✓
- [ ] User name from database displays correctly
- [ ] Products match seeded data
- [ ] Prices display correctly
- [ ] Supplier names show correctly
- [ ] Ratings display

### State Management ✓
- [ ] AuthContext working
- [ ] CartContext working
- [ ] Token stored in localStorage
- [ ] Cart persists across refreshes

### API Integration ✓
- [ ] All API calls use environment URL
- [ ] Tokens automatically included
- [ ] Error responses handled
- [ ] Success responses processed

---

## 🎯 SUCCESS CRITERIA

**Your MVP is working correctly if:**

1. ✅ You can login with seed credentials
2. ✅ Dashboard shows YOUR name from database (not hardcoded)
3. ✅ Marketplace shows 10 real products from MongoDB
4. ✅ Products filter by category
5. ✅ No critical errors in console
6. ✅ Page refresh maintains login state
7. ✅ All API calls go through successfully
8. ✅ Token management works automatically

---

## 🚨 KNOWN ISSUES TO IGNORE

1. **Warning: "Using UNSAFE_componentWillReceiveProps"** - From third-party libraries, safe to ignore
2. **Image CORS warnings** - From Unsplash, images still load
3. **DevTools warnings in development** - Normal React development mode

---

## 📊 TESTING RESULTS TEMPLATE

```
Date: ________________
Tester: ______________

AUTHENTICATION
[ ] Test 1-5: Pass / Fail

PRODUCTS
[ ] Test 6-10: Pass / Fail

DASHBOARD
[ ] Test 11-14: Pass / Fail

CART
[ ] Test 15-16: Pass / Fail

INTEGRATION
[ ] Test 17-20: Pass / Fail

Total Pass Rate: ____%

Critical Issues Found:
1. _______________________
2. _______________________

Notes:
_______________________
_______________________
```

---

## 🆘 TROUBLESHOOTING

### If Login Fails:
1. Check backend is running: http://localhost:5000/api/health
2. Check credentials are correct
3. Check Network tab for error details
4. Verify CORS is enabled in backend

### If Products Don't Load:
1. Verify backend running
2. Check database was seeded: `npm run seed`
3. Check Network tab for API response
4. Verify MongoDB is running

### If Page Crashes:
1. Clear localStorage
2. Hard refresh (Ctrl+Shift+R)
3. Check Console for error details
4. Restart dev server

---

## ✅ QUICK TEST SCRIPT

**5-Minute Smoke Test:**

```
1. Backend running? ✓
2. Frontend running? ✓
3. Login works? ✓
4. Dashboard shows name? ✓
5. Marketplace loads 10 products? ✓
6. Filter works? ✓
7. Refresh maintains state? ✓
8. No console errors? ✓

If all ✓ → MVP is working! 🎉
```

---

Good luck with testing! 🚀
