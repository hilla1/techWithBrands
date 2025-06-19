import { useState } from "react"
import ProjectSummary from "./approval/ProjectSummary"
import ProjectDeliverables from "./approval/ProjectDeliverables"
import FeedbackForm from "./approval/FeedbackForm"
import FilePreviewModal from "./approval/FilePreviewModal"

const summary = {
  title: "E-commerce Platform Development",
  duration: "3 months",
  completedFeatures: [
    "User authentication and authorization",
    "Product catalog with search and filtering",
    "Shopping cart and checkout process",
    "Payment integration (Stripe)",
    "Admin dashboard for inventory management",
    "Order tracking and history",
    "Email notifications",
    "Responsive design for all devices",
    "SEO optimization",
    "Performance optimization",
  ],
  technologies: ["React", "Node.js", "MongoDB", "Stripe API", "AWS"],
  teamMembers: ["Sarah Chen (Lead Developer)", "Mike Johnson (UI/UX Designer)", "Emily Davis (Backend Developer)"],
}

const deliverables = [
  {
    id: 1,
    name: "Final Web Application",
    type: "application",
    description: "Complete responsive web application with all requested features",
    url: "https://demo.example.com",
    status: "ready",
  },
  {
    id: 2,
    name: "Source Code Repository",
    type: "code",
    description: "Complete source code with documentation and setup instructions",
    size: "45.2 MB",
    status: "ready",
  },
  {
    id: 3,
    name: "Design Assets",
    type: "design",
    description: "All design files, mockups, and brand assets used in the project",
    size: "12.8 MB",
    status: "ready",
  },
  {
    id: 4,
    name: "Documentation",
    type: "documentation",
    description: "User manual, technical documentation, and deployment guide",
    size: "3.4 MB",
    status: "ready",
  },
  {
    id: 5,
    name: "Video Walkthrough",
    type: "video",
    description: "Complete walkthrough of the application features and functionality",
    size: "156 MB",
    status: "ready",
  },
]

export default function FinalApproval() {
  const [previewFile, setPreviewFile] = useState(null)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Sections */}
      <ProjectSummary summary={summary} />
      <ProjectDeliverables deliverables={deliverables} setPreview={setPreviewFile} />
      <FeedbackForm />

      {/* Modal */}
      {previewFile && (
        <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  )
}
