# Secure-Auth-System

A robust, full-stack User Authentication and Management System built with **Spring Boot (Java)** and **React (JavaScript/TypeScript)**. This project implements secure authentication mechanisms using **JWT (JSON Web Tokens)** and integrates them with a modern, user-friendly React frontend.

## 🔒 Features
- JWT-based Authentication for secure API access.
- Password hashing for enhanced security.
- User roles and authorization with Spring Security.
- Seamless API integration between frontend and backend.
- Dynamic content management based on user roles.
- Comprehensive JUnit testing for all backend services.

## 📂 Project Structure
### Backend (Spring Boot)
- Java 17
- Spring Boot 3.x
- Spring Security
- JPA / Hibernate
- Lombok
- JUnit
- Maven

### Frontend (React)
- React 18
- Axios for API requests
- TailwindCSS for styling
- React Router for navigation
- Hooks and Context API for state management

## 🚀 Getting Started
### Backend
1. Clone the repository:
```bash
 git clone https://github.com/Batuhan-Yalcin/Secure-Auth-System.git
```
2. Navigate to the backend directory:
```bash
cd Secure-Auth-System/backend
```
3. Install dependencies and build the project:
```bash
mvn clean install
```
4. Run the application:
```bash
mvn spring-boot:run
```

### Frontend
1. Navigate to the frontend directory:
```bash
cd Secure-Auth-System/frontend
```
2. Install dependencies:
```bash
npm install
```
3. Run the application:
```bash
npm start
```

## 🔧 Testing
Run backend tests with:
```bash
mvn test
```

## 📌 Endpoints
| Method | URL                | Description            |
|--------|--------------------|------------------------|
| POST   | /api/auth/register  | Register a new user    |
| POST   | /api/auth/login     | User login (JWT token)  |
| GET    | /api/users          | Get all users (Admin)   |
| DELETE | /api/users/{id}     | Delete user by ID      |

## 💡 Technologies Used
- **Backend:** Spring Boot, Spring Security, JPA, Hibernate, Maven
- **Frontend:** React, Axios, TailwindCSS, React Router

## 📜 License
This project is licensed under the MIT License.

## 📣 Author
Developed by **Batuhan Yalçın**. Feel free to reach out for collaboration or inquiries.
