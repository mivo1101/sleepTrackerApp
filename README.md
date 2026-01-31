# SIT725 - 8.2HD - Dockerisation

The Dockerisation task was implemented based on Group 33's project - Alive
Sleep Tracker App.

## Student Details
- **Name:** Chau Tra Mi Vo (Mi Vo)
- **ID:** 224505179

## How to Run

### 1. Prerequisites
- Ensure Docker Desktop installed and running.
- Open your terminal and clone this repository to your local machine:
```bash
git clone https://github.com/mivo1101/sleepTrackerApp.git
cd sleepTrackerApp
```

### 2. Set up environment variables  
- Create a `.env` file in the project root based on `.env.example`
- Find the configuration values in the chat on Ontrack under Chau Tra Mi Vo (Mi Vo) submission for this 8.2HD task.

| Variable                  | Example                                         | Description                                            |
|---------------------------|-------------------------------------------------|--------------------------------------------------------|
| MONGODB_URI             | `mongodb://localhost:27017/alive-sleep-tracker` | MongoDB connection string                              |
| NODE_ENV                | `development`                                   | Node environment (development, test, production) |
| ENCRYPTION_KEY          | `development-only-secret-key`                   | Secret used to hash Auth0 identifiers                  |
| AUTH0_ISSUER_BASE_URL   | `https://dev-example.us.auth0.com`              | Auth0 application domain                               |
| AUTH0_CLIENT_ID         | `replace-with-auth0-client-id`                  | Auth0 client ID                                        |
| AUTH0_CLIENT_SECRET     | `replace-with-auth0-client-secret`              | Auth0 client secret                                    |
| AUTH0_SECRET            | `replace-with-auth0-session-secret`             | Auth0 session secret                                   |
| OPENAI_API_KEY          | `replace-with-openai-api-key`                   | OpenAI API key for AI-generated sleep insights         |
| CONTENTFUL_SPACE_ID     | `replace-with-space-id`                         | Contentful space ID for insights/articles              |
| CONTENTFUL_ACCESS_TOKEN | `replace-with-access-token`                     | Contentful access token for CMS content                |

### 3. Start the Application (Docker)
- Make sure you saved the .env file in the project root.
- Run the following command in your terminal to build and start the containerised environment.
This will start both the Node.js App and the MongoDB Database.
```bash
docker-compose up --build
```
- Wait until you see a message `"sleep-tracker-app-1  | Alive Sleep Tracker App server listening on http://localhost:3000"`

## Check Student Identity
To verify my submission details, navigate to: http://localhost:3000/api/student

You will see a JSON response containing the my Name and ID.
```bash
{
  "name": "Chau Tra Mi Vo (Mi Vo)",
  "studentId": "224505179"
}
```

## Access the Application
Open your web browser and navigate to: http://localhost:3000

### 1. Before Authentication (Main Site)
Alive Sleep Tracker App includes 3 pages in the Main Site (before signing in):
- `Home`
- `About Us`
- `Insights`: You can click any `articles` to see the detailed inisght subpages.

### 2. Authentication
To access your personalised dashboard:
- Click `Sign in` in the right corner of the screen.
- You will see the Auth0 interface to sign in, simply choose `Continue with Google` and select your email.
- After successfully signing in, you will see your dashboard with your name.

### 3. After Authentication (Personal Dashboard)
- You can actively interact with either the Main Site or Dashboard by clicking the button `Main Site/Dashboard`.
- You can see your person-icon widget containing the notification, and other features like `Profile`, `Sleep Schedules`, and `Support Chat`.

---

In your personalised dashboard, there are 3 sections:
- `Log Sleep`: The 1st section where you can enter/edit, save your sleep logs, and review your sleep history or remove a record.
- `Trends`: The 2nd section where you can see your sleep trends visualised by a bar chart and a goal line, see your sleep summary and generate `AI Insights` by clicking `View` button.
- `Goal`: The 3rd section where you can set/change your sleep goal, check your goal history, and review your progress within a month.

---

In your profile, you can:
- See the `Announcement History`
- `Export sleep entries` into aCSV file
- `Delete Account`

---

You can also explore other features, including:
- `Sleep Schedules`
- `Support Chat`