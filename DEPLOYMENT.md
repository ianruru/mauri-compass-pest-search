# Deployment Guide: Mauri Compass Pest Search

This full-stack application requires a hosting platform that supports Node.js, databases, and file storage. We recommend **Railway** or **Render** for easy deployment.

---

## Prerequisites

Before deploying, ensure you have:
- A GitHub account (to push your code)
- A Railway or Render account
- Your database credentials (MySQL)
- AWS S3 credentials for file storage (or use Railway/Render's built-in storage)

---

## Option 1: Deploy to Railway

Railway provides the easiest deployment experience with built-in database and storage solutions.

### Step 1: Push Code to GitHub

```bash
cd /home/ubuntu/ecan_pest_search
git init
git add .
git commit -m "Initial commit: Full-stack Mauri Compass Pest Search"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Create Railway Project

1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway will automatically detect the Node.js application

### Step 3: Add MySQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database" → "MySQL"**
3. Railway will automatically provision a MySQL database
4. The `DATABASE_URL` environment variable will be automatically set

### Step 4: Add Environment Variables

In Railway project settings, add these environment variables:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
OWNER_OPEN_ID=your-oauth-open-id-here
OWNER_NAME=Your Name
OAUTH_SERVER_URL=https://oauth.manus.im
```

**For S3 Storage (if using AWS):**
```
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### Step 5: Deploy

1. Railway will automatically build and deploy your application
2. Once deployed, click **"Generate Domain"** to get a public URL
3. Your application will be live at `https://your-app.railway.app`

### Step 6: Seed the Database

After the first deployment, run the seed script to populate the pest database:

1. In Railway, go to your project
2. Click on the service → **"Settings" → "Deploy"**
3. Add a custom start command: `pnpm db:push && node scripts/seed-pests.ts && pnpm start`
4. Or use Railway CLI to run the seed script manually

---

## Option 2: Deploy to Render

Render is another excellent platform with a generous free tier.

### Step 1: Push Code to GitHub

(Same as Railway Step 1)

### Step 2: Create Render Web Service

1. Go to [Render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: mauri-compass-pest-search
   - **Environment**: Node
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`

### Step 3: Add MySQL Database

1. In Render dashboard, click **"New +"** → **"PostgreSQL"** (or use external MySQL provider like PlanetScale)
2. Note: Render doesn't provide MySQL directly, so you'll need to use:
   - **PlanetScale** (recommended, free tier available)
   - **Railway MySQL** (can be used separately)
   - **AWS RDS**

### Step 4: Add Environment Variables

In Render service settings, add:

```
DATABASE_URL=mysql://user:password@host:port/database
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
OWNER_OPEN_ID=your-oauth-open-id-here
OWNER_NAME=Your Name
OAUTH_SERVER_URL=https://oauth.manus.im
```

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will build and deploy your application
3. Your app will be live at `https://your-app.onrender.com`

---

## Post-Deployment Steps

### 1. Seed the Database

After the first deployment, you need to populate the pest database with 230 species:

**Via SSH/Shell:**
```bash
npx tsx scripts/seed-pests.ts
```

**Or add to your start command:**
```bash
pnpm db:push && npx tsx scripts/seed-pests.ts && pnpm start
```

### 2. Set Up Admin Access

The first user to log in with the `OWNER_OPEN_ID` will automatically become an admin. To log in:

1. Visit your deployed site
2. Click the login button (if you've added one to the UI)
3. Use OAuth authentication
4. Your account will be granted admin role automatically

### 3. Test the Application

1. **Public Pages**: Visit the home page and search for pests
2. **Pest Details**: Click on any pest to view details
3. **Submit Observation**: Fill out the Mauri Impact Form
4. **Admin Dashboard**: Navigate to `/admin` to view submissions

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MySQL connection string |
| `JWT_SECRET` | Yes | Secret key for JWT tokens |
| `OWNER_OPEN_ID` | Yes | Your OAuth Open ID (for admin access) |
| `OWNER_NAME` | Yes | Your name |
| `OAUTH_SERVER_URL` | Yes | OAuth server URL (default: https://oauth.manus.im) |
| `AWS_ACCESS_KEY_ID` | Optional | AWS S3 access key (for photo storage) |
| `AWS_SECRET_ACCESS_KEY` | Optional | AWS S3 secret key |
| `AWS_REGION` | Optional | AWS region (e.g., us-east-1) |
| `AWS_S3_BUCKET` | Optional | S3 bucket name |

---

## Database Schema

The application uses three main tables:

1. **users**: Stores user accounts and roles
2. **pests**: Contains 230 invasive species records
3. **submissions**: Community observations with photos and impact assessments

The schema is automatically created when you run `pnpm db:push`.

---

## Troubleshooting

### Database Connection Issues

If you see "Database not available" errors:
1. Check that `DATABASE_URL` is correctly set
2. Ensure your database is running
3. Verify network connectivity between your app and database

### Seed Script Fails

If the seed script doesn't run:
1. Manually run: `npx tsx scripts/seed-pests.ts`
2. Check database permissions
3. Verify the `pests.json` file exists in `client/src/data/`

### Photos Not Uploading

If photo uploads fail:
1. Verify S3 credentials are correct
2. Check bucket permissions (must allow PutObject)
3. Ensure CORS is configured on your S3 bucket

---

## Scaling Considerations

As your application grows:

1. **Database**: Upgrade to a larger MySQL instance
2. **Storage**: Consider using a CDN for faster image delivery
3. **Caching**: Add Redis for session storage and API caching
4. **Monitoring**: Set up error tracking (e.g., Sentry)

---

## Support

For deployment issues or questions:
- Railway: https://railway.app/help
- Render: https://render.com/docs
- GitHub Issues: Create an issue in your repository
