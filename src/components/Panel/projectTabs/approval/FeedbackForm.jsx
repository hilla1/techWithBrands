// components/FinalApproval/FeedbackForm.jsx
import { FiStar, FiThumbsUp, FiX } from "react-icons/fi"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"

const approvalSchema = z.object({
  rating: z.number().min(1, "Please rate your experience (1-5 stars)").max(5),
  feedback: z.string().min(10, "Please provide at least 10 characters of feedback"),
  improvements: z.string().optional(),
})

export default function FeedbackForm() {
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(approvalSchema) })

  const onSubmit = (data) => {
    console.log("Approval Data:", data)
    alert("✅ Thank you! Your final approval and suggestions have been submitted successfully.")
  }

  const handleRating = (value) => {
    setSelectedRating(value)
    setValue("rating", value)
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
      <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-orange-500 to-yellow-500 mb-6">
        Final Thoughts & Approval
      </h2>
      <p className="text-gray-600 text-sm mb-6">
        We value your feedback! Please rate your experience and let us know how we can improve.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Overall Experience</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <FiStar
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || selectedRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            {selectedRating > 0 && (
              <span className="ml-3 text-sm text-gray-500 italic">
                {selectedRating === 5 && "Excellent!"}
                {selectedRating === 4 && "Great job!"}
                {selectedRating === 3 && "Satisfactory"}
                {selectedRating <= 2 && "Needs Improvement"}
              </span>
            )}
          </div>
          {errors.rating && <p className="text-sm text-red-600 mt-1">{errors.rating.message}</p>}
        </div>

        {/* Feedback */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Your Feedback</label>
          <textarea
            {...register("feedback")}
            rows={4}
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder="Tell us what stood out, what worked well, and your overall satisfaction..."
          />
          {errors.feedback && <p className="text-sm text-red-600 mt-1">{errors.feedback.message}</p>}
        </div>

        {/* Improvements */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Suggestions for Improvement <span className="text-gray-400 text-sm">(Optional)</span></label>
          <textarea
            {...register("improvements")}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"
            placeholder="Have ideas for new features or anything we could improve next time?"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 rounded-md border border-red-500 text-red-500 hover:bg-red-50 font-semibold py-2 transition"
            onClick={() => alert("📝 Change request submitted! Our team will review it promptly.")}
          >
            <FiX className="h-4 w-4" />
            Request Changes
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-orange-500 text-white font-semibold py-2 hover:opacity-90 transition"
          >
            <FiThumbsUp className="h-4 w-4" />
            Submit Final Approval
          </button>
        </div>
      </form>
    </div>
  )
}
