# Training Center Management System

A comprehensive platform for managing training courses, students, and administrative tasks.

## Project Structure

The project is organized into two main directories:

- `frontend/`: React application for the user interface
- `backend/`: Express API server and database access

## Setup Instructions

### Backend Setup with Docker

1. **Clone the repository**:
   \`\`\`bash
   git clone https://github.com/yourusername/training-center.git
   cd training-center
   \`\`\`

2. **Create environment file**:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Edit the `.env` file to set your environment variables.

3. **Build and start the backend containers**:
   \`\`\`bash
   docker-compose up -d
   \`\`\`

4. **Access the API**:
   - API: http://localhost:5000/api
   - Health check: http://localhost:5000/health

5. **Stop the containers**:
   \`\`\`bash
   docker-compose down
   \`\`\`

### Frontend Setup (Local Development)

1. **Navigate to the frontend directory**:
   \`\`\`bash
   cd frontend
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server**:
   \`\`\`bash
   npm start
   \`\`\`

4. **Access the application**:
   - Frontend: http://localhost:3000

## Development

### Frontend Development

\`\`\`bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start

# Build for production
npm run build

# Install new dependencies
npm install some-package
\`\`\`

### Backend Development

\`\`\`bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the development server
npm run dev

# Run migrations manually
npm run migrate

# Install new dependencies
npm install some-package
\`\`\`

### Database Access

\`\`\`bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d training_center
\`\`\`

### Viewing Logs

\`\`\`bash
# View all logs
docker-compose logs

# View backend logs
docker-compose logs backend

# View database logs
docker-compose logs postgres
\`\`\`

## Backup and Restore

### Backup the Database

\`\`\`bash
docker-compose exec postgres pg_dump -U postgres training_center > backup.sql
\`\`\`

### Restore the Database

\`\`\`bash
cat backup.sql | docker-compose exec -T postgres psql -U postgres -d training_center
\`\`\`

## Production Deployment

1. **Set up production environment variables**:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Edit the `.env` file with your production settings.

2. **Build and start the production containers**:
   \`\`\`bash
   docker-compose -f docker-compose.prod.yml up -d
   \`\`\`

3. **Access the API**:
   - API: http://your-domain.com/api
   - Health check: http://your-domain.com/health

## API Documentation

The API documentation is available at `/api-docs` when the server is running.
\`\`\`

Let's update the root package.json to reflect the new Docker configuration:
