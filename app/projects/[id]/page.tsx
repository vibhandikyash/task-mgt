import ProjectDetailPage from '@/components/templates/ProjectDetailPage';
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ProjectPage() {
    return ( 
    <ProtectedRoute>
        <ProjectDetailPage />
    </ProtectedRoute>
    );

}
 