# NovaQuill Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
# Prisma schema is configured for PostgreSQL (see `prisma/schema.prisma`)
# Example (local Postgres):
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/novaquill?schema=public"
DATABASE_URL="postgresql://username:password@localhost:5432/novaquill?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Storage Encryption
STORAGE_ENCRYPTION_KEY="your-32-byte-base64-encryption-key"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

APPLE_CLIENT_ID="your-apple-client-id"
APPLE_CLIENT_SECRET="your-apple-client-secret"

# Additional Allowed Origins (Optional)
ALLOWED_ORIGINS="localhost:3000,example.com"

# Environment
NODE_ENV="development"
```

## Generating Encryption Key

Generate a 32-byte encryption key for AES-256-GCM:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using OpenSSL
openssl rand -base64 32
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma client:
```bash
npm run postinstall
```

3. Run database migrations:
```bash
npx prisma db push
```

4. Start development server:
```bash
npm run dev
```

## Features Implemented

### ✅ Critical Fixes
- Fixed missing logo file issue
- Added proper error handling throughout the app
- Implemented comprehensive file validation
- Added loading states and user feedback

### ✅ Security Enhancements
- File type validation using magic bytes
- File size limits (50MB upload, 100MB processing)
- Improved rate limiting with memory management
- Enhanced origin validation

### ✅ User Experience
- Drag and drop file upload
- Touch support for mobile devices
- Loading spinners and progress indicators
- Better error messages and validation feedback
- Accessibility improvements (ARIA labels, keyboard navigation)

### ✅ Code Quality
- Type safety improvements
- Constants for magic numbers
- Proper error boundaries
- Memory leak prevention
- Retry logic for PDF processing

### ✅ Mobile Support
- Touch event handling for signature drawing
- Responsive design improvements
- Mobile-optimized interactions

## Production Considerations

1. **Rate Limiting**: Consider implementing Redis-based rate limiting for production
2. **File Storage**: Implement cloud storage (AWS S3, Google Cloud Storage) for production
3. **Monitoring**: Add logging and error tracking (Sentry, LogRocket)
4. **CDN**: Use a CDN for static assets and PDF worker files
5. **Database**: Use PostgreSQL or MySQL for production instead of SQLite

## Testing

Run the linter and type checker:

```bash
npm run lint
npx tsc --noEmit
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Support

For issues or questions, please check the main README.md file or create an issue in the repository.
