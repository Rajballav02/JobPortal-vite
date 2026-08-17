# JobNest — Responsive Job Portal

## Course Outcome (CO₂)

**Apply programming constructs to develop solutions for computational problems.**

## Project Aim

Design, develop, test and deploy a responsive, interactive and scalable Job Portal registration and dashboard interface using React, Bootstrap and JavaScript.

## Problem Statement

A company needs a Job Portal where users can register, log in, manage a professional profile, discover job listings and track applications. The interface must work well on mobile, tablet and desktop screens while providing immediate validation and interactive feedback.

## Task Coverage

| Required task | JobNest implementation |
| --- | --- |
| Responsive registration and login | Bootstrap-based registration and login pages with mobile-friendly layouts. |
| Dashboard layout | Profile completion, application statistics, recent applications, notifications and recommended jobs. |
| JavaScript and Bootstrap validation | Client-side validation with Bootstrap validation states and inline feedback. |
| Reusable React components | Navbar, JobCard, FormField, Loader, ProtectedRoute, Footer and context providers. |
| State with `useState` | Form state, validation, filters, saved jobs, applications and notification state. |
| Dynamic listings | Job data is rendered dynamically into reusable JobCard components. |
| Search and filter | Keyword, location, category, type, level, salary and sorting filters. |

## Features

- Registration, login and logout with validation, password strength and duplicate-email checking
- Responsive Home, Jobs, Job Details, Apply, Dashboard, Profile, Saved Jobs, Applied Jobs and Notifications pages
- Job search, filters, pagination, save/unsave and application tracking
- Application form with resume selection, cover-letter validation and status tracking
- Toast messages, loading states, empty states and responsive navigation

## Technology Stack

- React 19 and React Router
- Bootstrap 5 and Bootstrap Icons
- JavaScript (ES modules)
- Vite
- Browser `localStorage` for demo persistence

## Run Locally

```bash
npm install
npm run dev
```

For a production build check:

```bash
npm run build
```

## Demo Account

- Email: `demo@jobnest.com`
- Password: `Demo@123`

## Project Structure

```text
src/
  components/     Reusable Navbar, JobCard, FormField, Footer, Loader and ProtectedRoute
  context/        Auth, jobs and toast state with browser persistence
  data/           Seed job listings
  pages/          Application screens
  styles/         Responsive visual system and component styling
  utils/          Formatting and validation helpers
```

## Production Note

This course project is a front-end demo. For production, replace `localStorage` in the context providers with secured API calls and a database. Authentication must use a server, HTTPS, secure password hashing (bcrypt/Argon2) and secure tokens or sessions.
