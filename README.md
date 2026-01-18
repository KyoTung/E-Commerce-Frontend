🛍️ Nest Store Frontend
Client-side application for Nest Store E-Commerce - Built with ReactJS & Vite.

This repository contains the frontend source code for the Nest Store project. It delivers a modern, responsive, and seamless shopping experience for mobile devices, interacting with the Nest Store Backend API.

🚀 Tech Stack
Core: ReactJS (Vite Build Tool)

State Management: Redux Toolkit (Global state for Auth, Cart, Products)

Routing: React Router DOM v6

Styling: Tailwind CSS

HTTP Client: Axios (Custom Interceptors)

Icons: React Icons (Feather Icons / FontAwesome)

Notifications: React Toastify

Map Integration: React Leaflet (Optional - if used for address)

🧩 Key Features
🔐 1. Advanced Authentication Flow
Secure Login: Email/Password login & Google OAuth2 integration.

Silent Refresh Token: Implemented Axios Interceptors to automatically refresh Access Tokens in the background without logging the user out.

Race Condition Handling: Request queue management to prevent multiple refresh token calls simultaneously.

Protected Routes: Higher-order components to secure user & admin routes.

🛍️ 2. Shopping Experience
Product Discovery: Search, Sort, and Filter products by Brand, Category, Price, Tags.

Smart Cart: Real-time cart management using Redux (Persistent cart state).

Product Details: Image gallery, detailed specifications, and related products.

💳 3. Robust Checkout & Payment
Flexible Payment: Support for Cash On Delivery (COD) and ZaloPay E-Wallet.

Fail-Safe Payment Flow:

Payment Recovery: If an online payment fails, users can retry payment immediately from the Order Details page.

Switch Payment Method: Users can switch a failed ZaloPay order to COD instantly without recreating the order.

Order Tracking: Visual timeline of order status (Pending → Processing → Shipping → Delivered).

👤 4. User Dashboard
Order History: View past orders with detailed status.

Profile Management: Update personal information.


Wishlist: Save favorite products.

📸 Screenshots
<img width="1879" height="900" alt="image" src="https://github.com/user-attachments/assets/23d3b46b-751f-4a90-9e50-50d765f1e25e" />
<img width="1881" height="912" alt="image" src="https://github.com/user-attachments/assets/9d59e172-ab6b-4cb6-8b9a-dc5c1d84a15c" />
<img width="1898" height="908" alt="image" src="https://github.com/user-attachments/assets/72e5f66b-641d-4c25-9a5b-ffa1b933003c" />
<img width="1895" height="905" alt="image" src="https://github.com/user-attachments/assets/bc3117ea-954e-4fb2-8b8f-4062193fbbcd" />
<img width="1879" height="803" alt="image" src="https://github.com/user-attachments/assets/77464ce4-2cbb-4de1-97ca-6a1767b4c87c" />
<img width="1889" height="827" alt="image" src="https://github.com/user-attachments/assets/ccb6ff56-1983-4761-acbe-9bcfefa4ac20" />
<img width="1883" height="812" alt="image" src="https://github.com/user-attachments/assets/6860c80c-a95c-49f0-b16a-2e31794bdbca" />
<img width="1911" height="902" alt="image" src="https://github.com/user-attachments/assets/3ffa8fba-55bb-45ab-b067-392c891d23d0" />
<img width="1873" height="822" alt="image" src="https://github.com/user-attachments/assets/fdbfcdf2-9d9c-4865-935f-3b99a50a4e75" />
<img width="1898" height="946" alt="image" src="https://github.com/user-attachments/assets/29bf53de-8aa2-4eac-8eb3-fdd62d58f6b5" />

⚙️ Installation & Run
1. Clone the repository
Bash

git clone https://github.com/your-username/e-commerce-frontend.git
cd e-commerce-frontend
2. Install Dependencies
Bash

npm install
3. Environment Variables Configuration
Create a .env file in the root directory:

Đoạn mã

# API Endpoint (Your Backend URL)
VITE_BASE_URL=http://localhost:5000/api

# Other configs (if any)
4. Start the App
Development Mode:

Bash

npm run dev
The app will run at http://localhost:3000

Production Build:

Bash

npm run build
npm run preview
📁 Folder Structure
src/
├── app/                # Redux Store configuration
├── assets/             # Images, fonts, static files
├── components/         # Reusable UI components (Header, Footer, Cards...)
├── features/           # Redux Slices & Services (Auth, Cart, Order...)
│   ├── auth/
│   ├── cart/
│   └── ...
├── layout/             # Main Layouts (Default, Admin...)
├── pages/              # Page components (Home, ProductDetail, Checkout...)
├── routes/             # Route definitions (Public/Private/Open)
├── utils/              # Helper functions (Format currency, Axios config)
├── App.jsx             # Main App Component
└── main.jsx            # Entry point
🤝 Contribution
Contributions are welcome! Please fork the repository and submit a pull request.

👨‍💻 Author
Name: Hoang Thanh Tung

Email: hoangthanhtung.ac1@gmail.com
