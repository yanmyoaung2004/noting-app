# 📝 Note Sharing App

A full-stack web application that allows users to create, manage, and securely share notes with others. Built using **React** for the frontend and **Spring Boot** for the backend, this app supports both private and public sharing with detailed permission control.

---

## 🌟 Features

- 🔐 Role-based note sharing with `view` and `edit` permissions
- 🔗 Generate shareable links (public or restricted)
- 📋 Copy-to-clipboard for quick sharing
- 📄 Full CRUD operations on notes
- 📧 Share notes by user email
- 💡 Visual indicators for note visibility
- ⚙️ Built-in access level switching (private/restricted/public)

---

## 🧰 Tech Stack

| Layer       | Technology                                             |
| ----------- | ------------------------------------------------------ |
| Frontend    | React, Vite or CRA, Tailwind CSS (optional), Axios     |
| Backend     | Java, Spring Boot, Spring Data JPA, Lombok             |
| Database    | MySQL or PostgreSQL                                    |
| Build Tools | Maven or Gradle                                        |
| Others      | Jackson, Swagger (optional), GitHub Actions (optional) |

---

## 📁 Project Structure

note-sharing-app/
├── backend/ # Spring Boot backend
│ ├── src/main/java/...
│ └── application.properties
│
├── frontend/ # React frontend
│ ├── src/
│ ├── public/
│ └── package.json
│
└── README.md

---

## ⚙️ Setup Instructions

### ✅ Backend (Spring Boot)

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```
2. **Configure the database:**
   In application.properties:
   spring.datasource.url=jdbc:mysql://localhost:3306/note_app
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   spring.jpa.hibernate.ddl-auto=update

3. **Run the Spring Boot application:**
   ./mvnw spring-boot:run

### ✅ Frontend (React)

1. **Navigate to the frontend folder:**
   cd frontend

2. **Install dependencies:**
   npm install

3. **Configure API base URL**
   In .env or directly in Axios instance:
   VITE_API_BASE_URL=http://localhost:8080
4. **Run the React app:**
   npm run dev  
   Runs on: http://localhost:5173

🔐 Access Control Logic
Private: Only the owner can view/edit.

Restricted: Only users added via NotePermission can access (based on view or edit).

Public: Anyone with the link can view (read-only).

Shared: Notes shared with specific users via email.

🧪 Example Use Cases
Create a note and set it to private

Share with teammates via email with "edit" permission

Make a note public for blog readers

Switch between access levels (public ↔ private ↔ restricted)

🙌 Acknowledgements
Inspired by Google Keep, Notion, and other modern note-taking tools.

Built with ❤️ using Java and JavaScript.
