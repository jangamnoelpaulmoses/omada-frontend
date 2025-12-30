import {
    Instagram,
    Facebook,
    Linkedin,
    Twitter,
    Youtube,
  } from "lucide-react";
  
  export const SOCIAL_PLATFORMS = [
    { key: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-500" },
    { key: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600" },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
    { key: "twitter", label: "Twitter", icon: Twitter, color: "text-blue-400" },
    { key: "youtube", label: "YouTube", icon: Youtube, color: "text-red-600" },
  ] as const;
  
  export const SUPPORTED_GRADING_PLATFORMS = ["instagram"] as const;
  
  export const LOADING_MESSAGES = {
    discover: [
      "Scanning website for social links…",
      "Analyzing page metadata…",
      "Extracting social profiles…",
      "Verifying discovered links…",
    ],
    grade: [
      "Fetching profile data…",
      "Analyzing engagement patterns…",
      "Benchmarking against similar accounts…",
      "Calculating performance score…",
    ],
    report: [
      "Summarizing performance insights…",
      "Generating growth recommendations…",
      "Drafting AI report…",
      "Finalizing actionable steps…",
    ],
  };
  