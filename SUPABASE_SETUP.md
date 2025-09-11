# Supabase Setup Instructions

This guide will help you set up Supabase for the Incident Reporting System.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `incident-reporting`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## 3. Set Up Environment Variables

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 4. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create:
- `profiles` table for user information
- `incidents` table for incident reports
- Row Level Security (RLS) policies
- Triggers for automatic profile creation
- Indexes for better performance

## 5. Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000/**`
4. Save the changes

## 6. Test the Setup

1. Start the development server:
   ```bash
   bun run dev
   ```

2. Open `http://localhost:3000`
3. Try creating a new account
4. Try reporting an incident

## 7. Optional: Enable Email Authentication

If you want to use email authentication:

1. Go to **Authentication** → **Settings**
2. Under **Email**, configure your SMTP settings
3. Or use Supabase's built-in email service

## 8. Optional: Set Up Real-time Subscriptions

The app is already configured to use real-time updates. You can enable this in Supabase:

1. Go to **Database** → **Replication**
2. Enable replication for the `incidents` table
3. The app will automatically show real-time updates

## Troubleshooting

### Common Issues

1. **"Invalid API key"**: Check that your `.env` file has the correct Supabase URL and anon key
2. **"User not found"**: Make sure the database schema was created correctly
3. **CORS errors**: Ensure your Site URL and Redirect URLs are configured correctly
4. **RLS errors**: Check that the Row Level Security policies are set up correctly

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Look at the browser console for error messages
- Check the Supabase dashboard logs under **Logs** → **API**

## Security Notes

- Never commit your `.env` file to version control
- The `anon` key is safe to use in client-side code
- Row Level Security ensures users can only access their own data
- All database operations are authenticated and authorized
