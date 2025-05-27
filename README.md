# National Police Index

## Introduction

Welcome to the National Police Index, a comprehensive database providing employment history data for law enforcement officers across multiple states in the United States.

## States Included

As of our latest update, the National Police Index includes data from the following states:

1. Arizona
2. California
3. Florida
4. Georgia
5. Illinois
6. Kentucky
7. Maryland
8. Idaho
9. Ohio
10. Oregon
11. New Mexico
12. South Carolina
13. Tennessee
14. Texas
15. Utah
16. Washington
17. Vermont
18. West Virginia
19. Wyoming

We are continuously working to expand our coverage to include more states and provide a more comprehensive national overview.

## Data Available

The National Police Index provides a range of information about law enforcement officers, including but not limited to:

- Agency Name
- Unique Identifier (UID)
- First Name
- Last Name
- Employment Start Date
- Employment End Date
- Separation Reason (where available)
- Race (where available)
- Sex (where available)
- Employment Status (where available)
- Birth Year (where available)
- Rank (where available)

Please note that the availability of specific data points may vary by state and agency due to differences in reporting requirements and data collection practices.

## Data Sources and Updates

The data in the National Police Index is sourced from the from Peace Officer Standards and Training (POST) agency, which is responsible for certifiying police officers in each given state.

## Privacy and Ethical Considerations

While we aim to promote transparency, we also respect privacy concerns. All data presented in the National Police Index is already part of the public record. We do not include any private or sensitive information beyond what is officially released by state agencies.

## Disclaimer

The National Police Index is an information resource and should not be used as a definitive source for making decisions about individuals. Users are encouraged to verify information through other channels when necessary.

## How to Run

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- A Firebase account and project

### Initial Setup

1. Clone the repository:

```bash
git clone https://github.com/ayyubibrahimi/us-post-front-end.git
cd us-post-front-end
```

2. Navigate to the web directory:

```bash
cd web
```

3. Install dependencies:

```bash
npm ci
```

### Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)

2. Generate your Firebase configuration:

   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web icon (</>)
   - Register your app and copy the configuration object

3. Create a new file `firebase.config.js` in the `utils` directory:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-auth-domain',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket',
  messagingSenderId: 'your-messenger-id',
  appId: 'your-app-id',
  measurementId: 'your-measurement-id',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
```

### Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to:

```
http://localhost:3000
```

### Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to:

```
http://localhost:3000
```

### Deploying the Application

#### Installing Vercel CLI

Before deploying, you need to install the Vercel CLI:

```bash
npm install -g vercel
```

After installation, log in to your Vercel account:

```bash
vercel login
```

Follow the prompts to complete the authentication process. Ensure that your account is linked to this project.

#### Deploying to Production

To deploy changes to the live site, use the Vercel CLI with the production flag:

```bash
vercel --prod
```

This command will build and deploy your application to the production environment.

If you encounter any errors during deployment, they will be returned by the `vercel --prod` command. For each error:

1. Create a new Pull Request (PR) addressing the specific issue
2. Push your changes to the repository
3. Run the deployment command again

Continue this process until the deployment succeeds without errors. Thanks.
