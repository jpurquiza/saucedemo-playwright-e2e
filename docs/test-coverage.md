# Test Coverage

## Login (`tests/login.spec.ts`)

- Login with valid credentials
- Locked out user cannot log in
- Invalid username
- Invalid password
- Missing username
- Missing password
- Unauthenticated access to protected pages is blocked
- Inventory page is not accessible after logging out

## Cart (`tests/cart.spec.ts`)

- Adding a product to the cart
- Adding multiple products to the cart
- Removing a product from the inventory page
- Removing a product from the cart page
- Returning to the inventory page from the cart

## Checkout (`tests/checkout.spec.ts`)

- Completing a full purchase
- Missing first name
- Missing last name
- Missing postal code
- Order total equals item total plus tax