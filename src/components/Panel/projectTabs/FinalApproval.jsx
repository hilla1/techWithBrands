"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FiStar, FiThumbsUp, FiDownload, FiEye, FiFile, FiImage, FiVideo, FiCheck, FiX } from "react-icons/fi"

const approvalSchema = z.object({
  rating: z.number().min(1, "Please provide a rating").max(5),
  feedback: z.string().min(10, "Feedback must be at least 10 characters"),
  improvements: z.string().optional(),
})

const projectDeliverables = [
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

const projectSummary = {
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

export default function FinalApproval() {
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [previewFile, setPreviewFile] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(approvalSchema),
  })

  const watchedRating = watch("rating")

  const onSubmit = (data) => {
    console.log("Approval data:", data)
    alert("Thank you for your feedback! Your approval has been submitted.")
  }

  const handleRatingClick = (rating) => {
    setSelectedRating(rating)
    setValue("rating", rating)
  }

  const getFileIcon = (type) => {
    switch (type) {
      case "application":
        return <FiEye className="h-6 w-6 text-blue-600" />
      case "code":
        return <FiFile className="h-6 w-6 text-green-600" />
      case "design":
        return <FiImage className="h-6 w-6 text-purple-600" />
      case "documentation":
        return <FiFile className="h-6 w-6 text-orange-600" />
      case "video":
        return <FiVideo className="h-6 w-6 text-red-600" />
      default:
        return <FiFile className="h-6 w-6 text-gray-600" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Final Project Approval</h1>
        <p className="text-xl text-gray-600">Review your completed project and provide final approval and feedback</p>
      </div>

      {/* Project Summary */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Project Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Project Name:</span>
                <span className="font-medium">{projectSummary.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{projectSummary.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Completed</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {projectSummary.technologies.map((tech) => (
                <span key={tech} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Completed Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {projectSummary.completedFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <FiCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Team Members</h3>
          <div className="space-y-1">
            {projectSummary.teamMembers.map((member, index) => (
              <div key={index} className="text-sm text-gray-700">
                • {member}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Deliverables */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Deliverables</h2>

        <div className="space-y-4">
          {projectDeliverables.map((deliverable) => (
            <div
              key={deliverable.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">{getFileIcon(deliverable.type)}</div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{deliverable.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{deliverable.description}</p>
                      {deliverable.size && <p className="text-xs text-gray-500 mt-1">Size: {deliverable.size}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {deliverable.status}
                      </span>
                      <div className="flex gap-1">
                        {deliverable.url ? (
                          <a
                            href={deliverable.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary p-2"
                            title="Preview"
                          >
                            <FiEye className="h-4 w-4" />
                          </a>
                        ) : (
                          <button
                            onClick={() => setPreviewFile(deliverable)}
                            className="btn btn-secondary p-2"
                            title="Preview"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                        )}
                        <button className="btn btn-secondary p-2" title="Download">
                          <FiDownload className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rating and Feedback */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Feedback</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Overall Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-colors"
                >
                  <FiStar
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || selectedRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm text-gray-600">
                {selectedRating > 0 && (
                  <>
                    {selectedRating} of 5 stars
                    {selectedRating >= 4 && " - Excellent!"}
                    {selectedRating === 3 && " - Good"}
                    {selectedRating <= 2 && " - Needs improvement"}
                  </>
                )}
              </span>
            </div>
            {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>}
          </div>

          {/* Feedback Text */}
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Project Feedback
            </label>
            <textarea
              {...register("feedback")}
              rows={4}
              className="textarea"
              placeholder="Share your thoughts about the project, what you liked, and overall experience..."
            />
            {errors.feedback && <p className="mt-1 text-sm text-red-600">{errors.feedback.message}</p>}
          </div>

          {/* Improvement Suggestions */}
          <div>
            <label htmlFor="improvements" className="block text-sm font-medium text-gray-700 mb-2">
              Suggestions for Improvement (Optional)
            </label>
            <textarea
              {...register("improvements")}
              rows={3}
              className="textarea"
              placeholder="Any suggestions for future improvements or additional features..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              className="btn btn-secondary flex items-center gap-2 flex-1"
              onClick={() => alert("Change requests submitted. The team will review and get back to you.")}
            >
              <FiX className="h-4 w-4" />
              Request Changes
            </button>
            <button type="submit" className="btn btn-primary flex items-center gap-2 flex-1">
              <FiThumbsUp className="h-4 w-4" />
              Approve Project
            </button>
          </div>
        </form>
      </div>

      {/* Success Message */}
      <div className="card p-6 bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <FiCheck className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-green-900">Project Ready for Review</h3>
            <p className="text-sm text-green-700 mt-1">
              All deliverables are complete and ready for your final approval. Take your time to review everything
              thoroughly.
            </p>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{previewFile.name}</h3>
                <button onClick={() => setPreviewFile(null)} className="text-gray-400 hover:text-gray-600">
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="text-center">
                <div className="p-8 bg-gray-50 rounded-lg">
                  {getFileIcon(previewFile.type)}
                  <p className="mt-4 text-gray-600">{previewFile.description}</p>
                  <button className="btn btn-primary mt-4 flex items-center gap-2 mx-auto">
                    <FiDownload className="h-4 w-4" />
                    Download {previewFile.name}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
