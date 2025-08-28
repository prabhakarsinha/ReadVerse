# ReadVerse

ReadVerse is a modern eBook store and reading platform, featuring a full-stack web application with a robust backend and a rich, interactive frontend.

## About the Project
ReadVerse allows users to browse, purchase, and read digital books. It supports user authentication, book licensing, reading progress tracking, and secure payments. The platform is designed for scalability, security, and a seamless user experience.

## Features
- User registration, login, and authentication (JWT-based)
- Browse books by category and author
- Purchase and license digital books
- Track reading progress for each user/book
- Secure payment integration (Razorpay)
- Responsive UI for desktop and mobile
- Admin dashboard for content management
- Real-time notifications and toasts
- PDF book viewing and reading experience

## Tech Stack

### Backend
- **Java 21**
- **Spring Boot** (REST API, security, JPA, actuator)
- **Maven** (build and dependency management)
- **Razorpay** (payment gateway integration)
- **JWT** (authentication)
- **JUnit** (testing)

### Frontend
- **React** (UI library)
- **TypeScript** (type safety)
- **Vite** (build tool)
- **Chakra UI** (component library)
- **React Router** (routing)
- **React Hook Form** (form management)
- **React Toastify** (notifications)
- **@react-pdf-viewer** (PDF viewing)
- **Zod** (validation)
- **ESLint** (linting)

## Getting Started

### Backend
1. Navigate to `Backend/`
2. Build and run:
   ```sh
   ./mvnw spring-boot:run
   ```

### Frontend
1. Navigate to `frontend/`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start development server:
   ```sh
   npm run dev
   ```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.
