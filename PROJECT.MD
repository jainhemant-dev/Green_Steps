# GreenSteps - Eco-Habit Logger

GreenSteps is a full-stack web application designed to encourage eco-friendly habits through gamification and visual impact tracking. The platform rewards users for consistent sustainable actions and helps them visualize their contribution to environmental conservation.

## 🌱 Project Overview

Sustainability starts with small, daily actions. GreenSteps motivates users by making these actions visible and rewarding, turning environmental consciousness into an engaging daily practice.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React + Vite
- **UI/Styling**: 
  - TailwindCSS for styling
  - Radix UI for accessible components
  - Framer Motion for animations
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Charts**: Chart.js with React-ChartJS-2
- **Icons**: React Icons, Lucide Icons
- **HTTP Client**: Custom API client built on Fetch API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: 
  - Passport.js for auth strategies
  - Support for Local, Google, Facebook, and GitHub OAuth
  - JWT and Session-based auth
- **Security**:
  - Argon2 for password hashing
  - Helmet.js for security headers
  - CORS protection
  - Session management with MongoDB store

### Development & Tools
- **Package Manager**: pnpm
- **Linting**: ESLint with custom configuration
- **Code Formatting**: Prettier
- **Development Server**: Vite dev server with proxy
- **Environment**: Configurable with dotenv

## 🎯 Core Features

### 1. Authentication & Authorization
- Secure email/password registration and login
- OAuth support for Google, Facebook, and GitHub
- Session-based authentication
- Protected routes and API endpoints

### 2. Daily Eco-Action Logging
- Track sustainable actions from a predefined list:
  - Carpooling
  - Reused Container
  - Skipped Meat
  - Used Public Transport
  - No-Plastic Day
  - Custom Actions
- Once-per-day logging per action
- Optional notes for each entry

### 3. Impact Tracking & Visualization
- Point system for eco-actions
- Carbon footprint reduction estimates
- Visual data representation:
  - Daily/weekly progress charts
  - Action distribution pie charts
  - Streak tracking
- Personal statistics dashboard

### 4. Gamification System
- Points-based progression
- Achievement badges:
  - Streak milestones
  - Action category achievements
  - Cumulative impact rewards
- Level system based on eco-points
- Progress tracking and milestones

### 5. Community Features
- Global impact statistics
- Community leaderboard
- Most popular actions tracking
- Anonymous activity feed

### 6. User Profile Management
- Personal information management
- Profile picture upload
- Password management
- Activity history
- Badge showcase
- Account settings

## 🏗️ Project Structure

```
GreenSteps/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── Components/      # Reusable UI components
│   │   ├── Routes/          # Page components
│   │   ├── store/          # Redux state management
│   │   ├── utility/        # Helper functions
│   │   └── hooks/          # Custom React hooks
├── server/                  # Express.js backend
│   ├── config/             # Server configuration
│   ├── controllers/        # Route controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── lib/               # Core server setup
└── shared/                # Shared utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 14
- MongoDB
- pnpm package manager

### Environment Setup
1. Create necessary `.env` files based on environment
2. Configure MongoDB connection
3. Set up OAuth credentials if using social login

### Installation
```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

## 🔒 Security Features

- Secure password hashing with Argon2
- Session-based authentication
- CORS protection
- Security headers with Helmet.js
- Protected API routes
- Secure cookie configuration
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary and confidential.
