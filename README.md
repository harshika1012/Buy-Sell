# Buy-Sell
This project is a full-stack e-commerce web portal built specifically for the IIIT community. Every logged-in user can act as both a Buyer and a Seller, enabling seamless listing, browsing, purchasing, and delivery of items.
 Features
 Authentication & User Management

    User Registration/Login with only IIIT email addresses.

    Passwords securely hashed using bcrypt.js.

    Token-based authorization using jsonwebtoken.

    Persistent login with automatic session restoration.

    Profile Page with editable fields.

 Navigation

    Persistent Navbar with links to all major pages post-login.

    Routes protected for authenticated users only.

 Buyer-Side Functionalities
 Search Items Page

    Search items by name (case-insensitive).

    Filter items by one or more categories.

    Clicking on an item redirects to a detailed view.

 Items Page

    View full details: name, price, description, and seller info.

    Add items to My Cart.

    Cart updates dynamically.

 My Cart Page

    View added items with name and price.

    Remove items individually.

    Total cost displayed.

    Place Order button initiates purchase:

        Items are removed from the cart.

        Buyer receives a hashed OTP (stored in DB).

        Orders move to Orders History and Seller's Deliver Page.

 Orders History Page

    Tabs for:

        Pending Orders with generated OTPs.

        Past Purchases.

        Items Sold.

 Seller-Side Functionalities
 Deliver Items Page

    Shows pending orders received by the seller.

    Seller enters buyer's OTP to close the transaction:

        Valid OTP (after hashing) completes order.

        Order removed from Deliver Page.

        Reflected in both buyer & seller’s Order History.

 Custom Rules & Logic

    Buyer and seller must be different.

    OTPs are securely hashed and verified server-side.

    Command-line or GUI-based logging of actions for debugging.

    Error handling for invalid actions (e.g., trying to buy your own item).

 Technologies Used

    Frontend: HTML, CSS, JavaScript (React.js or plain JS)

    Backend: Node.js, Express.js

    Database: MongoDB (with Mongoose)

    Authentication: bcrypt.js, jsonwebtoken

    CAPTCHA: Google reCAPTCHA / LibreCaptcha

    Session Management: JWT stored in HTTP-only cookies/localStorage

    Additional: dotenv, nodemailer (optional for email-based OTP)
