import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiArrowRight } from "react-icons/fi";

// Zod schema for form validation
const schema = z.object({
  projectName: z.string().min(3, "Min 3 characters"),
  projectType: z.string().min(1, "Project type is required"),
  description: z.string().min(50, "Min 50 characters"),
  timeline: z.string().min(1, "Timeline is required"),
  budget: z.string().min(1, "Budget is required"),
});

export default function ProjectForm({ defaultValues, onSubmit }) {
  const form = useForm({ defaultValues, resolver: zodResolver(schema) });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 text-sm sm:text-base break-words"
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
        Project Description
      </h2>

      {/* Project Name */}
      <div>
        <label className="block font-medium text-gray-700 mb-1">Project Name</label>
        <input
          {...form.register("projectName")}
          className="w-full rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="My Awesome Project"
        />
        {form.formState.errors.projectName && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.projectName.message}
          </p>
        )}
      </div>

      {/* Project Type */}
      <div>
        <label className="block font-medium text-gray-700 mb-1">Project Type</label>
        <select
          {...form.register("projectType")}
          className="w-full rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">-- Select Project Type --</option>
          <option value="web-app">Web Application</option>
          <option value="mobile-app">Mobile Application</option>
          <option value="desktop-app">Desktop Application</option>
          <option value="api">API Development</option>
          <option value="branding">Branding</option>
          <option value="logo-design">Logo Design</option>
          <option value="other">Other</option>
        </select>
        {form.formState.errors.projectType && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.projectType.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium text-gray-700 mb-1">Description</label>
        <textarea
          {...form.register("description")}
          rows={4}
          className="w-full rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Describe your project in detail..."
        />
        {form.formState.errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      {/* Timeline & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Timeline */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Timeline</label>
          <select
            {...form.register("timeline")}
            className="w-full rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Select Timeline --</option>
            <option value="1-2-weeks">1–2 weeks</option>
            <option value="1-month">1 month</option>
            <option value="2-3-months">2–3 months</option>
            <option value="3-6-months">3–6 months</option>
            <option value="6-months-plus">6+ months</option>
          </select>
          {form.formState.errors.timeline && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.timeline.message}
            </p>
          )}
        </div>

        {/* Budget */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Budget Range</label>
          <select
            {...form.register("budget")}
            className="w-full rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">-- Select Budget Range --</option>
            <option value="under-0.5k">Under $500</option>
            <option value="1k-5k">$1,000–$5,000</option>
            <option value="5k-15k">$5,000–$15,000</option>
            <option value="15k-50k">$15,000–$50,000</option>
            <option value="50k-plus">$50,000+</option>
          </select>
          {form.formState.errors.budget && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.budget.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-400 to-orange-300 text-white font-medium rounded-md hover:opacity-90 transition"
        >
          Next <FiArrowRight className="ml-2" />
        </button>
      </div>
    </form>
  );
}
