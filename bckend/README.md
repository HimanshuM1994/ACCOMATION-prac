# Invoice Management Backend

A comprehensive NestJS backend application for invoice management with user authentication.

## Features

- **Authentication**: JWT-based registration and login
- **Invoice Management**: Complete CRUD operations for invoices
- **Dynamic Items**: Support for multiple items per invoice with automatic calculations
- **Advanced Search**: Filter invoices by multiple criteria
- **Sorting**: Sort invoices by date, number, or other fields
- **Validation**: Comprehensive input validation and error handling

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Invoices
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices` - Get all invoices with search/filter/sort
- `GET /api/invoices/:id` - Get invoice details
- `PATCH /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure your MySQL database in `.env`:
```
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=password
DATABASE_NAME=invoice_db
JWT_SECRET=your-super-secret-jwt-key
```

3. Create the database:
```sql
CREATE DATABASE invoice_db;
```

4. Start the development server:
```bash
npm run start:dev
```

## Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "password123"
  }'
```

### Create an invoice
```bash
curl -X POST http://localhost:3001/api/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "invoiceNumber": "INV-001",
    "fromName": "Your Company",
    "fromEmail": "company@example.com",
    "fromAddress": "123 Business St",
    "toName": "Client Name",
    "toEmail": "client@example.com",
    "toAddress": "456 Client Ave",
    "invoiceDate": "2024-01-15",
    "dueDate": "2024-02-15",
    "taxRate": 10,
    "items": [
      {
        "description": "Web Development",
        "quantity": 40,
        "rate": 50.00
      },
      {
        "description": "Consultation",
        "quantity": 5,
        "rate": 100.00
      }
    ]
  }'
```

### Search invoices
```bash
curl "http://localhost:3001/api/invoices?search=INV-001&sortBy=invoiceDate&sortOrder=DESC" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- firstName
- lastName
- password (Hashed)
- createdAt
- updatedAt

### Invoices Table
- id (Primary Key)
- invoiceNumber (Unique)
- fromName, fromEmail, fromAddress
- toName, toEmail, toAddress
- invoiceDate, dueDate
- subtotal, taxRate, taxAmount, total
- notes, status
- userId (Foreign Key)
- createdAt, updatedAt

### Invoice Items Table
- id (Primary Key)
- description
- quantity, rate, amount
- invoiceId (Foreign Key)

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- User-based data isolation
- Input validation and sanitization
- CORS protection