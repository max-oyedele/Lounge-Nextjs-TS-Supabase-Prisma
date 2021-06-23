<h1 align="center">
  Lounge Business - Fullstack Next.js
</h1>

## 🚀 Getting started

    Navigate into your new site’s directory install modules and start it up.

    ```shell
    yarn
    yarn dev
    ```
    
    Your site is now running at [localhost:3000](http://localhost:3000)!

### Migrations

1.  **Modify your schema file.**

    Open the project in your code editor of choice and edit `prisma/schema.prisma`. Add Book model for example.

    ```prisma
    model Book {
      id         String   @id @default(cuid())
      title      String
      authors    User[]   @relation(references: [id])
      published  Boolean  @default(false)
      content    String
      createdAt  DateTime @default(now())
      updatedAt  DateTime @updatedAt
    }
    ```
    
1.  **Generate migration files.**

    Use Prisma migrate tool.

    ```shell
    npx prisma migrate dev --create-only --name init
    ```
    
    You can find migration files in `prisma/migrations`.
    
1.  **Apply migration.**

    Use Prisma migrate tool.

    ```shell
    npx prisma migrate dev
    ```

1.  **Apply seed.**

    Use Prisma db seed.

    ```shell
    npx prisma db seed --preview-feature
    ``` 

1.  **Generate new fresh Prisma client.**

    ```shell
    yarn generate
    ```

1. **Run sql on supabase.**
      
    Copy supabase/.sql and paste to [supabase sql editor](https://app.supabase.io/project/pulostcrffoezivocrdm/editor/sql)

    Run sql 

### Prisma studio

Prisma Studio is a visual editor for your database.
Open [prisma studio](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-studio) interface:

```
yarn studio
```

## 📜 ENV

Use `.env.local` on production or `.env.development` on dev. [Read more](https://nextjs.org/docs/basic-features/environment-variables)

```
DATABASE_URL="postgres://postgres:[password]@db.xzglaobocriywjuqkekw.supabase.co:5432/postgres"
```
## 💫 Deploy

Before deploy, you need to set up a database.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/likewagon/Lounge-Nextjs-TS-Supabase-Prisma)

## ScreenShots

<img src="./screenshots/guest.png" width="1000px" height="500px">



<img src="./screenshots/admin.png" width="1000px" height="500px">



<img src="./screenshots/server.png" width="1000px" height="500px">



<img src="./screenshots/auth.png" width="1000px" height="500px">