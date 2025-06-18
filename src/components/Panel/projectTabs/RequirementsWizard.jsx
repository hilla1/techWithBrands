"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FiCheck, FiUpload, FiX, FiFile, FiArrowLeft, FiArrowRight } from "react-icons/fi"

const steps = [
  { id: 1, name: "Project Description", description: "Tell us about your project" },
  { id: 2, name: "Feature List", description: "Define key features and requirements" },
  { id: 3, name: "File Upload", description: "Upload relevant documents and assets" },
  { id: 4, name: "Review", description: "Review and submit your requirements" },
]

const projectSchema = z.object({
  projectName: z.string().min(3, "Project name must be at least 3 characters"),
  projectType: z.string().min(1, "Please select a project type"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  timeline: z.string().min(1, "Please select a timeline"),
  budget: z.string().min(1, "Please select a budget range"),
})

const featuresSchema = z.object({
  features: z.array(z.string()).min(1, "Please add at least one feature"),
  priority: z.string().min(1, "Please select priority level"),
  integrations: z.array(z.string()),
})

export default function RequirementsWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [projectData, setProjectData] = useState({})
  const [featuresData, setFeaturesData] = useState({ features: [], integrations: [] })

  const projectForm = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: projectData,
  })

  const featuresForm = useForm({
    resolver: zodResolver(featuresSchema),
    defaultValues: featuresData,
  })

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onProjectSubmit = (data) => {
    setProjectData(data)
    nextStep()
  }

  const onFeaturesSubmit = (data) => {
    setFeaturesData(data)
    nextStep()
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep > step.id
                      ? "bg-primary-600 border-primary-600 text-white"
                      : currentStep === step.id
                        ? "border-primary-600 text-primary-600"
                        : "border-gray-300 text-gray-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <FiCheck className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-4 min-w-0">
                  <p className={`text-sm font-medium ${currentStep >= step.id ? "text-primary-600" : "text-gray-500"}`}>
                    {step.name}
                  </p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-8 ${currentStep > step.id ? "bg-primary-600" : "bg-gray-300"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="card p-8">
        {currentStep === 1 && (
          <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">Project Description</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input
                    {...projectForm.register("projectName")}
                    type="text"
                    className="input"
                    placeholder="My Awesome Project"
                  />
                  {projectForm.formState.errors.projectName && (
                    <p className="mt-1 text-sm text-red-600">{projectForm.formState.errors.projectName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                  <select {...projectForm.register("projectType")} className="input">
                    <option value="">Select project type</option>
                    <option value="web-app">Web Application</option>
                    <option value="mobile-app">Mobile Application</option>
                    <option value="desktop-app">Desktop Application</option>
                    <option value="api">API Development</option>
                    <option value="other">Other</option>
                  </select>
                  {projectForm.formState.errors.projectType && (
                    <p className="mt-1 text-sm text-red-600">{projectForm.formState.errors.projectType.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                <textarea
                  {...projectForm.register("description")}
                  rows={4}
                  className="textarea"
                  placeholder="Describe your project in detail..."
                />
                {projectForm.formState.errors.description && (
                  <p className="mt-1 text-sm text-red-600">{projectForm.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                  <select {...projectForm.register("timeline")} className="input">
                    <option value="">Select timeline</option>
                    <option value="1-2-weeks">1-2 weeks</option>
                    <option value="1-month">1 month</option>
                    <option value="2-3-months">2-3 months</option>
                    <option value="3-6-months">3-6 months</option>
                    <option value="6-months-plus">6+ months</option>
                  </select>
                  {projectForm.formState.errors.timeline && (
                    <p className="mt-1 text-sm text-red-600">{projectForm.formState.errors.timeline.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                  <select {...projectForm.register("budget")} className="input">
                    <option value="">Select budget range</option>
                    <option value="under-5k">Under $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-25k">$10,000 - $25,000</option>
                    <option value="25k-50k">$25,000 - $50,000</option>
                    <option value="50k-plus">$50,000+</option>
                  </select>
                  {projectForm.formState.errors.budget && (
                    <p className="mt-1 text-sm text-red-600">{projectForm.formState.errors.budget.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary flex items-center gap-2">
                Next Step <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Feature Requirements</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Features (Add one per line)</label>
              <textarea
                rows={6}
                className="textarea"
                placeholder="User authentication&#10;Dashboard with analytics&#10;Payment processing&#10;Email notifications&#10;Mobile responsive design"
                onChange={(e) => {
                  const features = e.target.value.split("\n").filter((f) => f.trim())
                  setFeaturesData((prev) => ({ ...prev, features }))
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
              <select
                className="input"
                onChange={(e) => setFeaturesData((prev) => ({ ...prev, priority: e.target.value }))}
              >
                <option value="">Select priority</option>
                <option value="low">Low - Nice to have</option>
                <option value="medium">Medium - Important</option>
                <option value="high">High - Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Integrations</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["Stripe", "PayPal", "Google Analytics", "Mailchimp", "Slack", "Zapier", "AWS", "Firebase"].map(
                  (integration) => (
                    <label key={integration} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFeaturesData((prev) => ({
                              ...prev,
                              integrations: [...prev.integrations, integration],
                            }))
                          } else {
                            setFeaturesData((prev) => ({
                              ...prev,
                              integrations: prev.integrations.filter((i) => i !== integration),
                            }))
                          }
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-700">{integration}</span>
                    </label>
                  ),
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={prevStep} className="btn btn-secondary flex items-center gap-2">
                <FiArrowLeft className="w-4 h-4" /> Previous
              </button>
              <button onClick={nextStep} className="btn btn-primary flex items-center gap-2">
                Next Step <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Upload Files</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
              <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">Drop files here or click to upload</p>
                <p className="text-gray-500">Upload wireframes, mockups, documents, or any relevant files</p>
                <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="btn btn-primary cursor-pointer inline-flex">
                  Choose Files
                </label>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Uploaded Files</h3>
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FiFile className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFile(file.id)} className="text-red-500 hover:text-red-700">
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={prevStep} className="btn btn-secondary flex items-center gap-2">
                <FiArrowLeft className="w-4 h-4" /> Previous
              </button>
              <button onClick={nextStep} className="btn btn-primary flex items-center gap-2">
                Review <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Review & Submit</h2>

            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-4">Project Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Project Name:</span>
                    <p>{projectData.projectName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <p>{projectData.projectType}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">Description:</span>
                    <p>{projectData.description}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Timeline:</span>
                    <p>{projectData.timeline}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Budget:</span>
                    <p>{projectData.budget}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-4">Features & Requirements</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Key Features:</span>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {featuresData.features.map((feature, index) => (
                        <li key={index} className="text-sm">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Priority:</span>
                    <p className="text-sm">{featuresData.priority}</p>
                  </div>
                  {featuresData.integrations.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Integrations:</span>
                      <p className="text-sm">{featuresData.integrations.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-semibold text-lg mb-4">Uploaded Files</h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center gap-3 text-sm">
                        <FiFile className="h-4 w-4 text-gray-400" />
                        <span>{file.name}</span>
                        <span className="text-gray-500">({formatFileSize(file.size)})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button onClick={prevStep} className="btn btn-secondary flex items-center gap-2">
                <FiArrowLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={() => alert("Requirements submitted successfully!")}
                className="btn btn-primary flex items-center gap-2"
              >
                Submit Requirements <FiCheck className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
