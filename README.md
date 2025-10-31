# Highway Delite - Experience Booking Platform

A full-stack web application for booking adventure experiences with real-time slot management.

## Tech Stack

### Frontend
- Next.js 16
- TypeScript
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL

### Deployment
- Fly.io (Both client and server)

## Features

- Browse adventure experiences
- Search experiences by title, city, or description
- View detailed experience information
- Select date and time slots
- Real-time slot availability tracking
- Promo code validation
- Booking management
- Responsive design for mobile and desktop

## Project Structure

```
highway_delite_assig/
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # Reusable components
│   └── public/            # Static assets
└── server/                # Express backend
    ├── prisma/            # Database schema and migrations
    └── generated/         # Prisma generated client
```

## Environment Variables

### Client (.env.local)
```
NEXT_PUBLIC_API=http://localhost:3121
```

### Server (.env)
```
DATABASE_URL=your_postgresql_database_url
PORT=3121
```

## Installation

### Prerequisites
- Node.js (v20+)
- pnpm
- PostgreSQL database

### Setup

1. Clone the repository
```bash
git clone https://github.com/AdityaSahrawat/hg-assig.git
cd hg-assig
```

2. Install dependencies

**Client:**
```bash
cd client
pnpm install
```

**Server:**
```bash
cd server
pnpm install
```

3. Set up environment variables
   - Create `.env.local` in client folder
   - Create `.env` in server folder
   - Add the required variables

4. Run database migrations
```bash
cd server
npx prisma migrate deploy
```

5. Start the development servers

**Server:**
```bash
cd server
pnpm dev
```

**Client:**
```bash
cd client
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3121

## API Endpoints

### Experience
- `GET /experience` - Get all experiences
- `GET /experience/:id` - Get experience by ID
- `POST /experience` - Create new experience

### Slot
- `GET /slot` - Get all slots
- `POST /slot` - Create new slot

### Booking
- `POST /booking` - Create new booking

### Promo Code
- `POST /promo/validate` - Validate promo code

## Database Schema

### Experience
- id, imageUrl, title, city, description, about, price, createdAt

### Slot
- id, experienceId, date, time, bookedCount, capacity

### Booking
- id, startDate, endDate, experienceId, name, Email, slotId, promoCode, quantity, TotalPrice, createdAt

### PromoCode
- id, code, type, value, validFrom, validUntil, isActive, createdAt

## Deployment

### Production URLs
- Frontend: https://hd-assig.fly.dev
- Backend: https://server-broken-hill-5642.fly.dev

### Deploy Commands

**Client:**
```bash
cd client
flyctl deploy
```

**Server:**
```bash
cd server
flyctl deploy
```

## License

This project is created for assignment purposes.
