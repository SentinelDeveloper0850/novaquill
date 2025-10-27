# NovaQuill Production Configuration Guide

## Environment Variables

Create a `.env.local` file with the following production-ready configuration:

```bash
# =============================================================================
# NOVAQUILL PRODUCTION ENVIRONMENT CONFIGURATION
# =============================================================================

# Database Configuration
# =====================
# For production, use PostgreSQL or MySQL instead of SQLite
DATABASE_URL="postgresql://username:password@localhost:5432/novaquill_prod"
# Alternative MySQL:
# DATABASE_URL="mysql://username:password@localhost:3306/novaquill_prod"

# NextAuth Configuration
# =====================
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-secret-key-at-least-32-characters-long"

# Storage Encryption
# ==================
# Generate with: openssl rand -base64 32
STORAGE_ENCRYPTION_KEY="your-32-byte-base64-encryption-key-here"

# OAuth Providers (Optional but Recommended)
# =========================================
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

APPLE_CLIENT_ID="your-apple-client-id"
APPLE_CLIENT_SECRET="your-apple-client-secret"

# Additional Allowed Origins for Production
# ========================================
ALLOWED_ORIGINS="yourdomain.com,www.yourdomain.com"

# Environment
# ===========
NODE_ENV="production"

# PayFast Configuration (Payment Gateway)
# ======================================
PAYFAST_ENV="live"  # or "sandbox" for testing
PAYFAST_MERCHANT_ID="your-merchant-id"
PAYFAST_MERCHANT_KEY="your-merchant-key"
PAYFAST_PASSPHRASE="your-payfast-passphrase"

# Cloud Storage Configuration (Choose one)
# =======================================

# AWS S3
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="novaquill-documents"
AWS_S3_ENDPOINT="https://s3.amazonaws.com"  # Optional for custom endpoints

# Google Cloud Storage (Alternative)
# GOOGLE_CLOUD_PROJECT_ID="your-project-id"
# GOOGLE_CLOUD_BUCKET="novaquill-documents"
# GOOGLE_CLOUD_KEY_FILE="path/to/service-account-key.json"

# Redis Configuration (for Rate Limiting)
# ======================================
REDIS_URL="redis://localhost:6379"
# Alternative with authentication:
# REDIS_URL="redis://username:password@localhost:6379"

# Monitoring and Logging
# =====================
# Sentry (Error Tracking)
SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"

# LogRocket (Session Replay)
LOGROCKET_APP_ID="your-logrocket-app-id"

# Analytics
# =========
# Google Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Performance Monitoring
# =====================
# Vercel Analytics (if using Vercel)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your-vercel-analytics-id"

# Security Headers
# ===============
# Content Security Policy
CSP_NONCE="your-csp-nonce"

# Rate Limiting
# =============
RATE_LIMIT_MAX_REQUESTS="100"
RATE_LIMIT_WINDOW_MS="900000"  # 15 minutes

# File Upload Limits
# ==================
MAX_FILE_SIZE="52428800"  # 50MB in bytes
MAX_PROCESSING_SIZE="104857600"  # 100MB in bytes

# CDN Configuration
# ================
CDN_URL="https://cdn.yourdomain.com"
NEXT_PUBLIC_CDN_URL="https://cdn.yourdomain.com"
```

## 2. Database Migration to PostgreSQL

### Install PostgreSQL Dependencies
```bash
npm install pg @types/pg
```

### Update Prisma Schema
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Run Migration
```bash
npx prisma db push
npx prisma generate
```

## 3. Cloud Storage Implementation

### AWS S3 Setup
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Google Cloud Storage Setup
```bash
npm install @google-cloud/storage
```

## 4. Redis Rate Limiting

### Install Redis Dependencies
```bash
npm install redis ioredis
```

### Redis Configuration
```typescript
// lib/redis.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export default redis;
```

## 5. Monitoring Setup

### Sentry Integration
```bash
npm install @sentry/nextjs
```

### LogRocket Integration
```bash
npm install logrocket
```

## 6. Security Headers

### Next.js Security Configuration
```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

## 7. CDN Configuration

### Static Asset Optimization
- Move PDF worker files to CDN
- Optimize image delivery
- Implement caching strategies

## 8. Performance Optimization

### Bundle Analysis
```bash
npm install @next/bundle-analyzer
```

### Image Optimization
- Use Next.js Image component
- Implement lazy loading
- Optimize PDF rendering

## 9. Backup and Recovery

### Database Backups
```bash
# PostgreSQL
pg_dump novaquill_prod > backup.sql

# MySQL
mysqldump -u username -p novaquill_prod > backup.sql
```

### File Storage Backups
- Implement S3 lifecycle policies
- Cross-region replication
- Versioning for critical documents

## 10. SSL/TLS Configuration

### HTTPS Setup
- Use Let's Encrypt or commercial certificates
- Implement HSTS headers
- Configure secure cookies

## 11. Load Balancing

### Nginx Configuration
```nginx
upstream novaquill {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://novaquill;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 12. Health Checks

### API Endpoint
```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis connection
    await redis.ping();
    
    return new Response(JSON.stringify({ status: 'healthy' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: 'unhealthy', error: error.message }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

## 13. Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrated to production
- [ ] Cloud storage configured
- [ ] Redis rate limiting enabled
- [ ] Monitoring tools integrated
- [ ] Security headers implemented
- [ ] SSL certificates installed
- [ ] CDN configured
- [ ] Health checks implemented
- [ ] Backup strategy in place
- [ ] Load balancing configured
- [ ] Performance monitoring active
- [ ] Error tracking enabled
- [ ] Logging configured
- [ ] Rate limiting tested
- [ ] Security audit completed
