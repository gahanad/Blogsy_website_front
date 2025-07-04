// frontend_next/app/login/page.tsx

import LoginPageContent from './loginPageContent'; // Import the component

// This is a Server Component by default, which renders the Client Component.
export default function LoginPageContainer() {
  return <LoginPageContent />;
}