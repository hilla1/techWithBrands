import { useEffect, useState } from "react";
import { FiCheck, FiStar } from "react-icons/fi";

// Map of keywords to feature suggestions
const keywordFeaturesMap = [
  { keywords: ["api", "backend", "integration"], feature: "Robust API Support" },
  { keywords: ["mobile", "android", "ios"], feature: "Cross-platform Mobile Support" },
  { keywords: ["web", "frontend", "react", "vite"], feature: "Responsive Web Interface" },
  { keywords: ["branding", "identity", "logo"], feature: "Brand Identity Package" },
  { keywords: ["dashboard", "admin", "panel"], feature: "Advanced Admin Dashboard" },
  { keywords: ["ecommerce", "shop", "store"], feature: "Payment Gateway Integration" },
  { keywords: ["auth", "login", "secure"], feature: "User Authentication & Authorization" },
  { keywords: ["analytics", "metrics", "reports"], feature: "Custom Analytics & Reporting" },
];

// Extract dynamic features from description and custom list
const extractRelevantFeatures = (description = "", features = []) => {
  const matched = new Set();
  const combinedText = [description, ...(features || [])].join(" ").toLowerCase();

  keywordFeaturesMap.forEach(({ keywords, feature }) => {
    if (keywords.some((k) => combinedText.includes(k))) {
      matched.add(feature);
    }
  });

  const fallback = ["Optimized Performance", "Email & Chat Support", "Basic Documentation"];
  fallback.forEach((f) => {
    if (matched.size < 4) matched.add(f);
  });

  return Array.from(matched);
};

// Tailored plan descriptions by project type
const getPlanDescription = (type, plan) => {
  const fallback = {
    Basic: "Essential features for small projects",
    Pro: "Best for growing businesses",
    Premium: "Full-stack support and scaling",
  };

  const map = {
    "web-app": {
      Basic: "Covers essentials like UI, responsiveness & SEO",
      Pro: "Full-featured web app with auth, analytics & support",
      Premium: "Scalable web architecture, automation, and optimization",
    },
    "mobile-app": {
      Basic: "Starter setup for mobile platforms",
      Pro: "Cross-platform mobile development & testing",
      Premium: "Advanced mobile scaling, CI/CD & analytics",
    },
    "api": {
      Basic: "Simple REST API structure with basic endpoints",
      Pro: "Robust API with documentation & rate limiting",
      Premium: "Secure, scalable API with deployment pipelines",
    },
    "branding": {
      Basic: "Logo + primary brand elements",
      Pro: "Brand kit with typography, color & usage guidelines",
      Premium: "Full brand identity and launch materials",
    },
    "logo-design": {
      Basic: "1–2 logo concepts with revisions",
      Pro: "Multiple concepts + brand color guide",
      Premium: "Logo suite + social, print, and launch files",
    },
    "desktop-app": {
      Basic: "Core desktop functions for Windows/macOS",
      Pro: "Installer, UI & data sync support",
      Premium: "Enterprise-ready with scaling & maintenance tools",
    },
  };

  return (map[type]?.[plan] || fallback[plan]) + (type ? ` (${type.replace("-", " ")})` : "");
};

export default function PaymentPlans({
  selectedPlan,
  setSelectedPlan,
  projectData = {},
  featuresData = {},
  setAvailablePlans = () => {},
}) {
  const [plansToRender, setPlansToRender] = useState([]);

  useEffect(() => {
    const relevantFeatures = extractRelevantFeatures(
      projectData.description,
      featuresData.features
    );

    const projectType = projectData.projectType || "other";

    const basic = {
      name: "Basic",
      description: getPlanDescription(projectType, "Basic"),
      price: "$499",
      period: "/project",
      features: relevantFeatures.slice(0, 3),
    };

    const pro = {
      name: "Pro",
      description: getPlanDescription(projectType, "Pro"),
      price: "$1499",
      period: "/project",
      features: relevantFeatures.slice(0, 5).concat([
        "Basic Maintenance",
        "Priority Support",
      ]),
      popular: true,
    };

    const premium = {
      name: "Premium",
      description: getPlanDescription(projectType, "Premium"),
      price: "$2999",
      period: "/project",
      features: relevantFeatures.concat([
        "Dedicated Project Manager",
        "Continuous Deployment Setup",
        "Post-launch Optimization",
      ]),
    };

    const plans = [basic, pro, premium];
    setPlansToRender(plans);
    setAvailablePlans(plans);
    if (!selectedPlan) setSelectedPlan("Pro");
  }, [projectData, featuresData, selectedPlan, setSelectedPlan, setAvailablePlans]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plansToRender.map((plan) => {
        const isSelected = selectedPlan === plan.name;

        return (
          <div
            key={plan.name}
            onClick={() => setSelectedPlan(plan.name)}
            className={`relative cursor-pointer border rounded-xl p-6 transition-all duration-300
              bg-white hover:ring-2 hover:ring-[#2E3191]/30
              ${isSelected ? "ring-2 ring-[#2E3191]" : ""}
              ${plan.popular ? "scale-[1.02]" : ""}`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-[#2E3191] to-[#F89F2D] text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <FiStar className="h-4 w-4" />
                  Most Popular
                </span>
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
              <div className="text-3xl font-extrabold text-gray-900">
                {plan.price}
                <span className="text-base font-medium text-gray-500">{plan.period}</span>
              </div>
            </div>

            {/* Features List */}
            <ul className="mb-6 space-y-3 text-sm text-gray-700">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <FiCheck className="text-green-500 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Select Button */}
            <button
              className={`w-full font-semibold py-2 px-4 rounded-md text-sm transition
                ${isSelected
                  ? "bg-gradient-to-r from-[#2E3191] to-[#F89F2D] text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            >
              {isSelected ? "✓ Selected" : "Select Plan"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
