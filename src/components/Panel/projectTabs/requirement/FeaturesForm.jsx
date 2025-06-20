import { useState, useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const availableIntegrations = [
  "Stripe", "PayPal", "Google Analytics", "Mailchimp", "Social Auth", "Mails",
  "HubSpot", "Salesforce", "SendGrid", "Twilio", "Firebase", "Auth0", "AWS",
  "Google Cloud", "Mpesa", "Notion", "Trello", "Jira", "Hotjar", "Facebook Pixel",
];

export default function FeaturesForm({ featuresData, setFeaturesData, prevStep, onSubmit }) {
  // A piece of local state just for the textarea's raw text
  const [rawFeatures, setRawFeatures] = useState("");

  // Initialize from featuresData.features on mount or when featuresData changes
  useEffect(() => {
    setRawFeatures(featuresData.features.join(", "));
  }, [featuresData.features]);

  const handleNext = () => {
    // Parse the raw text into an array
    const list = rawFeatures
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    if (!list.length || !featuresData.priority) {
      return alert("Please add at least one feature and select priority.");
    }

    // Commit parsed features back into the parent state
    onSubmit({ ...featuresData, features: list });
  };

  const toggleIntegration = (integration) => {
    setFeaturesData((prev) => {
      const exists = prev.integrations.includes(integration);
      const updated = exists
        ? prev.integrations.filter((i) => i !== integration)
        : [...prev.integrations, integration];
      return { ...prev, integrations: updated };
    });
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-gray-800">Feature Requirements</h2>

      {/* Features Textarea */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Key Features <span className="text-gray-400">(separate with commas)</span>
        </label>
        <textarea
          rows={3}
          value={rawFeatures}
          onChange={(e) => setRawFeatures(e.target.value)}
          className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="User authentication, Dashboard with analytics, Payment processing"
        />
      </div>

      {/* Priority Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority Level
        </label>
        <select
          value={featuresData.priority || ""}
          onChange={(e) =>
            setFeaturesData((prev) => ({ ...prev, priority: e.target.value }))
          }
          className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="">-- Select Priority --</option>
          <option value="low">Low – Nice to have</option>
          <option value="medium">Medium – Important</option>
          <option value="high">High – Critical</option>
        </select>
      </div>

      {/* Optional Integrations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Required Integrations <span className="text-gray-400">(optional)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
          {availableIntegrations.map((intg) => (
            <label
              key={intg}
              className="flex items-center text-sm text-gray-700 space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={featuresData.integrations.includes(intg)}
                onChange={() => toggleIntegration(intg)}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-400"
              />
              <span>{intg}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={prevStep}
          className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <button
          onClick={handleNext}
          className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-400 to-orange-300 text-white rounded-md hover:opacity-90 transition"
        >
          Next <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
}
