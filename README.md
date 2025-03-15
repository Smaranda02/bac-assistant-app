# BAC Assistant

![Screenshot 2025-02-06 184549](https://github.com/user-attachments/assets/162b834a-9944-49f7-9e0e-da2153c11b96)

Application for students and teachers to cram for baccalaureate exam using gamification techniques.

## Clone and run locally

1. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   SUPABASE_SERVICE_KEY=[INSERT SUPABASE PROJECT SERVICE KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

2. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).



## Tool scripts
### Create admin users
```bash
npm run create-admin -- <email> <password> <fistName> <lastName>
```

### Sync Supabase auth user metadata with database
```bash
npm run sync-user-meta
```

## Final app aspect

![Screenshot 2025-02-02 142926](https://github.com/user-attachments/assets/b5fec7c7-86b8-4c35-8b9e-fb3f66e41aca)

![Screenshot 2025-02-06 183816](https://github.com/user-attachments/assets/a0170278-42fc-481b-82fd-7a060142d783)


![Screenshot 2025-02-06 184849](https://github.com/user-attachments/assets/e669fe17-103f-44b0-b725-3c46346ab35d)


![Screenshot 2025-02-06 184156](https://github.com/user-attachments/assets/977e61c3-dd75-4626-8db6-093fef6dcba8)


![Screenshot 2025-02-06 184210](https://github.com/user-attachments/assets/e356ee3a-cb3e-4d16-9bed-57ae5016a745)


![Screenshot 2025-02-06 184231](https://github.com/user-attachments/assets/d2acaace-afd1-4573-bd51-7d0a9cfe232e)


