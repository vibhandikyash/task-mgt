import ClientPageContainer from "@/components/templates/ClientPageContainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <ClientPageContainer />
    </ProtectedRoute>
  );
}

