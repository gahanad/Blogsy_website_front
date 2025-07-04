// frontend_next/app/register/page.tsx

import RegisterPageContent from './registerPageContent'; // Import the component

// This is a Server Component by default, which renders the Client Component.
export default function RegisterPageContainer() {
  return <RegisterPageContent />;
}