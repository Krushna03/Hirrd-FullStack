# Hirrd

A responsive MERN stack web application tailored for **Job Recruitment**, with secure authentication and role-based functionalities for **Candidates** and **Recruiters**.

## Deployment

The project is deployed at: [Hirrd Live Link](https://your-hirrd-live-link.com)

## Features

-  **JWT Authentication** with token & cookie management
-  **Separate Candidate and Recruiter roles**
-  **Post and Apply to Jobs**
-  **Manage Applications**
-  **Image Uploads** using Multer & Cloudinary
-  **React-Redux** for efficient state management
-  **Fully responsive UI** optimized for all devices

## Tech Stack

- **Frontend:** React.js, Redux, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT Tokens, Cookies
- **Image Uploads:** Multer, Cloudinary
- **Deployment:** Vercel / Render

## Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas or local MongoDB
- Cloudinary account for image uploads

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/hirrd.git
cd hirrd
```

Install dependencies for both frontend and backend:

```bash
cd client
npm install

cd ../server
npm install
```

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running the Application

Run Frontend:

```bash
cd client
npm start
```

Run Backend:

```bash
cd server
npm run dev
```

The application will be running on:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## License

This project is licensed under the MIT License.

---

> Developed with ❤️ by **Krushna Sakhare**
