#  Bug Tracking System (Mini Jira)

A full-stack **Bug Tracking System (Mini Jira)** built to help teams manage **projects, users, and tickets** efficiently.  
This application provides a clean, modern dashboard UI with a robust backend API and role-based access control.

The project was developed as a **24-hour project-based assignment** following real-world development practices.

---

##  Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control:
  - **Admin**
  - **Member**

---

### 📁 Project Management
- Create projects (**Admin only**)
- View all projects
- Delete projects with confirmation (**Admin only**)
- Display ticket count per project
- Cascade delete tickets when a project is deleted

---

### 🎫 Ticket Management
- Create tickets under a project
- Assign tickets to team members
- Update ticket status and priority
- Ticket status: `Open`, `In Progress`, `Closed`
- Ticket priority: `Low`, `Medium`, `High`
- Search tickets by title
- Filter tickets by status and priority

---

### 🖥️ Dashboard UI
- Sidebar with project list
- Ticket board per project
- Create Project & Create Ticket modals
- Confirmation dialogs for destructive actions
- Responsive design (mobile & desktop)
- Clean and modern UI inspired by Jira

---

## 🛠 Tech Stack

### Frontend
- **React** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **shadcn/ui**
- **Axios**
- **React Router**
- **Context API** for state management

### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT Authentication**

### Deployment
- **Frontend**: Render (Static Site)
- **Backend**: Render (Web Service)
- **Database**: MongoDB Atlas

---

## 📂 Project Structure

