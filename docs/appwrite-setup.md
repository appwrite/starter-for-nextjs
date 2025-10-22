## Appwrite Setup for JAM Events Signups

Use these steps to configure the Appwrite backend that powers the JAM Events landing page form.

---

### 1. Project and Endpoint
1. Create (or reuse) an Appwrite project.
2. Copy the following values into `.env` and `.env.example`:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT`
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
   - `NEXT_PUBLIC_APPWRITE_PROJECT_NAME`

---

### 2. Database and Collection
1. Go to **Database > Create Database** and use the ID from `NEXT_PUBLIC_APPWRITE_DATABASE_ID` (for example `jam_events`).
2. Inside the database, create a collection whose ID matches `NEXT_PUBLIC_APPWRITE_COLLECTION_ID` (for example `jam_signups`).
3. Set permissions so that unauthenticated visitors can create documents:
   - Enable `Create` for `Any` (or for a dedicated API key if you plan to proxy requests through a server action).
   - Restrict `Read`, `Update`, and `Delete` to trusted roles (team members or service accounts).

---

### 3. Collection Attributes
Define the attributes below for the signup collection:

| Attribute          | Type     | Required | Suggested Options                                      |
|--------------------|----------|----------|--------------------------------------------------------|
| `fullName`         | string   | Yes      | Size 1-80                                              |
| `email`            | string   | Yes      | Size 4-191, mark as email                              |
| `phone`            | string   | No       | Size 0-32                                              |
| `eventInterests`   | string[] | Yes      | Array of strings, allow up to 8 values                 |
| `notes`            | string   | No       | Size 0-400                                             |
| `marketingConsent` | boolean  | Yes      | Default value `false`                                  |
| `createdAt`        | string   | Yes      | Store ISO timestamps (size 24 or greater)              |

> Tip: If you prefer Appwrite-managed timestamps, you can add an `updatedAt` attribute with the default value `now()`.

---

### 4. Indexes (Required for Duplicate Checks)
Create a **key index** on the `email` attribute so the application can call `Query.equal("email", value)`:
- Attributes: `email`
- Orders: ascending

Without this index, the duplicate submission guard inside `submitSignup` will fail.

---

### 5. Optional Automation
- **Email notifications:** Trigger an Appwrite Function or webhook on `documents.create` to notify the JAM team or send automatic replies.
- **CRM sync:** Connect Appwrite Functions to your CRM or marketing automation stack if you need downstream workflows.

---

### 6. Smoke Test
1. Run `npm run dev` locally.
2. Complete the signup form.
3. Confirm that:
   - A document appears in the collection with matching data.
   - Resubmitting the same email produces the duplicate message.
   - Public users cannot list or read the collection.

Update this document whenever the schema, permissions, or automations evolve so contributors stay aligned.
