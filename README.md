# Grid Backend

## Overview
Grid is a backend system designed for managing field agents, tasks, and scheduling. It is built using NestJS and TypeORM to ensure scalability and maintainability. The system relies on an external authentication provider using JWT and implements Role-Based Access Control (RBAC) and Permission-Based Access Control (PBAC) to manage access and permissions effectively.

## Tech Stack
- **Node.js** (v18+ recommended) - JavaScript runtime for executing server-side code
- **NestJS** - Framework for building scalable and modular backend applications
- **TypeORM** - Object-relational mapper for database interactions
- **PostgreSQL** - Relational database used for data persistence
- **Docker & Docker Compose** - Containerization for local development and database setup
- **ESLint & Prettier** - Tools for code formatting and linting to ensure code consistency

## Requirements
Before running the project, ensure you have the following installed:

- **Node.js** (v18+ recommended)
- **Docker & Docker Compose** (for running PostgreSQL locally)
- **Git** (to clone the repository)

## Installation

### Clone the Repository
```bash
git clone https://github.com/codefabric-io/grid
cd grid
```

### Install Dependencies
```bash
npm install
```

### Set Up Environment Variables
Create a `.env` file in the project root with the following configuration:

```ini
NODE_ENV=development
PORT=3000
JWT_SECRET=<<Ask the team for this>>
DATABASE_URL=postgres://grid:grid8@localhost:5432/grid
```

### Start the Database (Using Docker)
```bash
docker-compose up -d
```
This command will start a PostgreSQL database container.

### Run Database Migrations
Ensure the database schema is up-to-date by running:

```bash
npm run migration:run
```

### Start the Application
Run the application in development mode:

```bash
npm run start:dev
```

Open your browser and point to `http://localhost:3000/auth/public-endpoint`

```
{
    "message": "This is public! you can access without a token"
}
```

This means the API is working correctly

## Setup Complete
Once these steps are completed, the application should be running and ready for development.

## Creating New Migrations
If you make changes to the database schema, you need to create a migration.

### Generate a New Migration

Create or update a new entity

`src/modules/users/user.entity.ts`

```js
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

```bash
npm run migration:generate src/db/migrations/CreateUsers
```
Replace `CreateUsers` with a descriptive name for the migration. Remember to always prepent the migration with `src/db/migrations`

### Apply the Migration
```bash
npm run migration:run
```

### Revert the Last Migration
If you need to undo the last migration, run:
```bash
npm run migration:revert
```

