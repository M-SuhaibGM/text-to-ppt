🌐 Modern Developer Portfolio

A sleek, high-performance, and fully responsive personal portfolio application designed to showcase software engineering projects, technical skills, and professional experience. Built with a modern tech stack prioritizing lightning-fast page loads, fluid UI animations, and automated contact form delivery.

✨ Features

⚡ High Performance & SSR: Powered by Next.js for server-side rendering, quick client-side hydration, and optimized SEO.

🎨 Modern Dark Aesthetic: Minimalist, tech-focused interface styled cleanly using Tailwind CSS.

🎬 Fluid Animations: Micro-interactions, smooth page transitions, scroll-triggered reveals, and interactive component states powered by Framer Motion.

📩 Direct Email Delivery: Functional contact workspace integrating Nodemailer to deliver incoming client/recruiter inquiries straight to your inbox.

📱 Fully Responsive: Carefully calibrated layout break-points ensuring a seamless experience across mobile, tablet, and desktop viewports.

🛠️ Tech Stack

Framework: Next.js (React)

Styling: Tailwind CSS

Animation: Framer Motion

Email Service: Nodemailer

Language: TypeScript

Icons: Lucide React

🚀 Getting Started

Follow these steps to get a local copy up and running on your machine.

Prerequisites

Ensure you have Node.js (v18.0.0 or higher) and npm or pnpm installed.

Installation

Clone the repository:

git clone https://github.com/your-username/portfolio.git
cd portfolio


Install dependencies:

npm install
# or
pnpm install


Set up Environment Variables:
Create a .env.local file in the root directory and configure your Nodemailer SMTP credentials:

# Email Provider Setup (e.g., Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_RECEIVER_EMAIL=your-email@gmail.com


Run the development server:

npm run dev
# or
pnpm dev


Open in browser:
Navigate to http://localhost:3000 to view the application in action.

📁 Project Structure

├── app/
│   ├── api/
│   │   └── contact/      # Nodemailer API route handler
│   ├── layout.tsx        # Global layout & font definitions
│   └── page.tsx          # Main landing portfolio page
├── components/
│   ├── ContactForm.tsx   # Interactive form component
│   ├── HeroSection.tsx   # Framer motion animated landing view
│   ├── Projects.tsx     # Showcased projects grid
│   └── Skills.tsx       # Tech stack visual representation
├── public/               # Static assets & images
└── styles/               # Global CSS and Tailwind configurations


📄 License

This project is open source and available under the MIT License.
