

// ar report + business url
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Calendar, Target, Sparkles, Instagram, Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';
import { useEffect } from "react";
import { useRef } from "react";
import { downloadHtmlAsPdf } from "@/lib/htmlToPdf";


interface InstagramMetrics {
  posts_last_30_days: number;
  avg_posts_per_week: number;
  days_since_last_post: number;
  followers: number;
  engagement_rate: number;
}

interface GradeResponse {
  instagram: {
    handle: string;
    metrics: InstagramMetrics;
    grade: string;
    score: number;
    urgency: string[];
  };
}

interface DiscoverResponse {
  website: string;
  socials: {
    instagram: string[];
    facebook: string[];
    linkedin: string[];
    twitter: string[];
    youtube: string[];
    tiktok: string[];
  };
}

type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'youtube' | 'tiktok';

const socialPlatforms: { key: SocialPlatform; label: string; icon: React.ComponentType<any>; color: string }[] = [
  { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { key: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { key: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600' },
];

export default function Home() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [error, setError] = useState('');
  const [socials, setSocials] = useState<DiscoverResponse['socials'] | null>(null);
  const [result, setResult] = useState<GradeResponse | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [report, setReport] = useState<string | null>(null);
  type LoadingPhase = null | "discover" | "grade" | "report";
const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>(null);
const LOADING_MESSAGES_BY_PHASE: Record<Exclude<LoadingPhase, null>, string[]> = {
  discover: [
    "Scanning website for social links…",
    "Analyzing page metadata…",
    "Extracting social profiles…",
    "Verifying discovered links…"
  ],
  grade: [
    "Fetching profile data…",
    "Analyzing engagement patterns…",
    "Benchmarking against similar accounts…",
    "Calculating performance score…"
  ],
  report: [
    "Summarizing performance insights…",
    "Generating growth recommendations…",
    "Drafting AI report…",
    "Finalizing actionable steps…"
  ]
};

  const reportRef = useRef<HTMLDivElement>(null);

  type EntryMode = "website" | "social";
  const [entryMode, setEntryMode] = useState<"website" | "social">("website");
const [socialUsername, setSocialUsername] = useState("");
const [socialPlatform, setSocialPlatform] = useState<"instagram" | "facebook">("instagram");
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;


  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  useEffect(() => {
    if (!loadingPhase) return;
  
    setLoadingMessageIndex(0);
  
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => {
        const msgs = LOADING_MESSAGES_BY_PHASE[loadingPhase];
        return (prev + 1) % msgs.length;
      });
    }, 3200);
  
    return () => clearInterval(interval);
  }, [loadingPhase]);
  
  


  const handleDiscoverSocials = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setLoadingPhase("discover");
    setError("");
    setSocials(null);
    setResult(null);
    setSelectedPlatform(null);
  
    try {
      const response = await fetch( `${API_BASE_URL}/discover-socials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website_url: normalizeWebsiteUrl(websiteUrl),
        }),
      });
  
      if (!response.ok) throw new Error();
  
      const data = await response.json();
      setSocials(data.socials);
      setEntryMode("social");
    } catch {
      setError("Failed to discover social media handles.");
    } finally {
      setLoadingPhase(null);
    }
  };
  

  const handleGradeProfile = async (platform: SocialPlatform) => {
    setLoadingPhase("grade");
    setError("");
    setResult(null);
    setSelectedPlatform(platform);
  
    try {
      const url =
        socials && socials[platform]?.length
          ? socials[platform][0]
          : `https://www.${platform}.com/${socialUsername}`;
  
      const response = await fetch(`${API_BASE_URL}/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: url }),
      });
  
      if (!response.ok) throw new Error();
  
      const data = await response.json();
      setResult(data);
    } catch {
      setError("Failed to grade profile. Please try again.");
    } finally {
      setLoadingPhase(null);
    }
  };
  
  
  const normalizeWebsiteUrl = (input: string) => {
    let value = input.trim();
  
    // Add scheme if missing
    if (!/^https?:\/\//i.test(value)) {
      value = `https://${value}`;
    }
  
    try {
      const url = new URL(value);
  
      // Force https
      url.protocol = "https:";
  
      // Remove path, query, hash
      return url.origin;
    } catch {
      throw new Error("Invalid website URL");
    }
  };
  
  
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-green-600';
      case 'B':
        return 'text-lime-600';
      case 'C':
        return 'text-yellow-600';
      case 'D':
        return 'text-orange-600';
      default:
        return 'text-red-600';
    }
  };

  const hasSocials = () => {
    if (!socials) return false;
    return Object.values(socials).some(platform => Array.isArray(platform) && platform.length > 0);
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-300 to-blue-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gray-700" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Omada</span>
          </div>
          <div className="flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</a>
            <Button variant="ghost" className="text-gray-600">Login</Button>
            <Button className="bg-gradient-to-r from-green-200 to-blue-200 text-gray-900 hover:from-green-300 hover:to-blue-300">
              Try for Free
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center shadow-lg">
              <Sparkles className="w-10 h-10 text-gray-700" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            The Marketing Assistant.
          </h1>

          <p className="text-xl text-gray-500 mb-2">
            Your growth partner that thinks, acts, and keeps you in the loop.
          </p>

          <p className="text-gray-400 max-w-2xl mx-auto mb-12">
            Your Marketing Assistant keeps your marketing on track — it monitors performance,
            optimizes strategies, creates content, and analyzes feedback to uncover new opportunities.
            It's also bilingual, supporting English and Spanish.
          </p>

<div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-8 shadow-sm border border-gray-100">
  {/* ===== WEBSITE FLOW ===== */}
  {entryMode === "website" && (
    <>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Get Started
      </h2>
      <p className="text-gray-600 mb-6">
        Connect your business—we do the rest.
      </p>

      <form onSubmit={handleDiscoverSocials} className="flex gap-3 max-w-xl mx-auto">
        <Input
          type="text"
          placeholder="Enter business website"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          className="flex-1 h-12 text-base bg-white"
        />
        <Button type="submit" className="h-12 px-6 bg-gray-900 text-white">
          →
        </Button>
      </form>
      {loadingPhase === "discover" && (
  <div className="mt-6 flex items-center justify-center gap-3 text-sm text-gray-600">
    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-200 to-blue-200 animate-pulse" />
    {LOADING_MESSAGES_BY_PHASE.discover[loadingMessageIndex]}
  </div>
)}


      <button
        type="button"
        onClick={() => setEntryMode("social")}
        className="mt-6 text-sm text-gray-700 underline hover:text-gray-900"
      >
        Don’t have a website? Connect your social media →
      </button>
    </>
  )}
  {entryMode === "social" && socials && !hasSocials() && (
  <Card className="max-w-xl mx-auto mt-8 border border-yellow-200 bg-yellow-50">
    <CardContent className="p-6 text-center">
      <p className="text-gray-900 font-medium mb-2">
        Sorry — we couldn’t find any social profiles for this website.
      </p>
      <p className="text-sm text-gray-600 mb-4">
        Please enter a specific social media username to continue.
      </p>

      <Button
        variant="outline"
        className="border-gray-300"
        onClick={() => {
          setSocials(null);        // allow manual entry
          setSocialUsername("");   // clean state
        }}
      >
        Enter Social Username Manually
      </Button>
    </CardContent>
  </Card>
)}

{entryMode === "social" && socials && hasSocials() && (
  <div className="max-w-4xl mx-auto mt-10">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
      We found these social profiles
    </h3>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {socialPlatforms.map(({ key, label, icon: Icon, color }) => {
        const hasHandle = socials[key]?.length > 0;
        return (
          <button
            key={key}
            onClick={() => hasHandle && handleGradeProfile(key)}
            disabled={!hasHandle}
            className={`p-6 rounded-xl border-2 transition-all ${
              hasHandle
                ? "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
            }`}
          >
            <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
            <p className="font-semibold text-sm text-gray-900">{label}</p>
            <p className="text-xs mt-1">
              {hasHandle ? "Available" : "Not found"}
            </p>
          </button>
        );
      })}
    </div>
  </div>
)}



  {/* ===== SOCIAL FLOW ===== */}
  {entryMode === "social" && !socials && (
    <>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Get Started
      </h2>
      <p className="text-gray-600 mb-6">
        Connect your business—we do the rest.
      </p>

      {/* PLATFORM TOGGLE */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-full border bg-white overflow-hidden">
          <button
            onClick={() => setSocialPlatform("instagram")}
            className={`px-6 py-2 flex items-center gap-2 ${
              socialPlatform === "instagram"
                ? "bg-gray-900 text-white"
                : "text-gray-600"
            }`}
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </button>

          <button
            onClick={() => setSocialPlatform("facebook")}
            className={`px-6 py-2 flex items-center gap-2 ${
              socialPlatform === "facebook"
                ? "bg-gray-900 text-white"
                : "text-gray-600"
            }`}
          >
            <Facebook className="w-4 h-4" />
            Facebook
          </button>
        </div>
      </div>

      {/* USERNAME INPUT */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGradeProfile(socialPlatform);
        }}
        className="flex gap-3 max-w-xl mx-auto"
      >
        <Input
          type="text"
          placeholder={`Enter ${socialPlatform} username`}
          value={socialUsername}
          onChange={(e) => setSocialUsername(e.target.value)}
          className="flex-1 h-12 text-base bg-white"
        />
        <Button type="submit" className="h-12 px-6 bg-gray-900 text-white">
          →
        </Button>
      </form>

      <button
        type="button"
        onClick={() => setEntryMode("website")}
        className="mt-6 text-sm text-gray-700 underline hover:text-gray-900"
      >
        ← Back to website
      </button>
    </>
  )}
</div>

        </div>
        <p className="text-sm text-gray-500 mb-3 text-center">
  Analysis for <span className="font-medium text-gray-700">{websiteUrl}</span>
</p>
{loadingPhase === "grade" && (
  <Card className="max-w-3xl mx-auto mt-12 border border-gray-200">
    <CardContent className="p-8">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-200 to-blue-200 animate-pulse" />
        <p className="text-sm text-gray-600">
          {LOADING_MESSAGES_BY_PHASE.grade[loadingMessageIndex]}
        </p>
      </div>
    </CardContent>
  </Card>
)}




        {result && selectedPlatform && (
          <div className="max-w-4xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-gradient-to-br from-gray-900 to-green-900 text-white border-none shadow-2xl">

              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-green-200 text-sm font-medium mb-1">
                      {selectedPlatform.toUpperCase()} PROFILE
                    </p>
                    <h3 className="text-3xl font-bold">@{result.instagram.handle}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-green-200 text-sm font-medium mb-1">OVERALL GRADE</p>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-6xl font-bold ${getGradeColor(result.instagram.grade)}`}>
                        {result.instagram.grade}
                      </span>
                      <span className="text-3xl text-gray-300">
                        {result.instagram.score}/100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-green-300" />
                      <p className="text-xs text-green-200 font-medium">POSTS (30d)</p>
                    </div>
                    <p className="text-2xl font-bold">{result.instagram.metrics.posts_last_30_days}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-300" />
                      <p className="text-xs text-green-200 font-medium">AVG/WEEK</p>
                    </div>
                    <p className="text-2xl font-bold">{result.instagram.metrics.avg_posts_per_week}x</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-green-300" />
                      <p className="text-xs text-green-200 font-medium">LAST POST</p>
                    </div>
                    <p className="text-2xl font-bold">{result.instagram.metrics.days_since_last_post}d</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-green-300" />
                      <p className="text-xs text-green-200 font-medium">FOLLOWERS</p>
                    </div>
                    <p className="text-2xl font-bold">{result.instagram.metrics.followers.toLocaleString()}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-green-300" />
                      <p className="text-xs text-green-200 font-medium">ENGAGEMENT</p>
                    </div>
                    <p className="text-2xl font-bold">{result.instagram.metrics.engagement_rate.toFixed(1)}%</p>
                  </div>
                </div>

                {result.instagram.urgency && result.instagram.urgency.length > 0 && (
                  <div className="bg-yellow-500/20 backdrop-blur rounded-xl p-6 border border-yellow-500/30">
                    <p className="text-yellow-200 text-sm font-medium mb-3">RECOMMENDATIONS</p>
                    <div className="space-y-2">
                      {result.instagram.urgency.map((item, index) => (
                        <p key={index} className="text-white text-base">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-10 pt-6 border-t border-white/10 flex justify-center">
                <div className="flex flex-col items-center gap-4">
  <Button
    disabled={loadingPhase === "report"}
    onClick={async () => {
      setLoadingPhase("report");
      setReport(null);

      try {
        const response = await fetch(`${API_BASE_URL}/generate-report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platform: selectedPlatform,
            handle: result!.instagram.handle,
            metrics: result!.instagram.metrics,
            grade: result!.instagram.grade,
            score: result!.instagram.score,
            urgency: result!.instagram.urgency,
          }),
        });

        const data = await response.json();
        setReport(data.report);
      } finally {
        setLoadingPhase(null);
      }
    }}
    className="bg-white text-gray-900 hover:bg-gray-100 px-8 p-3 text-base font-semibold rounded-xl shadow"
  >
    {loadingPhase === "report"
      ? "Generating AI Report…"
      : "Generate AI Growth Report"}
  </Button>

  {loadingPhase === "report" && (
    <div className="flex items-center gap-3 text-sm text-gray-300">
      <div className="w-4 h-4 rounded-full bg-white/70 animate-pulse" />
      {LOADING_MESSAGES_BY_PHASE.report[loadingMessageIndex]}
    </div>
  )}
</div>


  

</div>

              </CardContent>
            </Card>

{report && (
  <>
    <div ref={reportRef}>
      <Card className="mt-12 border border-gray-200 shadow-sm">
        <CardContent className="p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            AI Growth Report
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            Strategic analysis based on current performance and engagement patterns.
          </p>

          <div className="space-y-4 text-gray-700 leading-relaxed whitespace-pre-line">
            {report.split(". ").map((line, i) => (
              <p key={i}>{line.trim()}.</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="flex justify-center mt-6">
      <Button
        onClick={() => {
          if (!reportRef.current) return;
          downloadHtmlAsPdf(
            reportRef.current,
            `omada-ai-report-${result?.instagram.handle}.pdf`
          );
        }}
        className="bg-gray-900 text-white hover:bg-gray-800"
      >
        Download Full Report
      </Button>
    </div>
  </>
)}



            <div className="text-center mt-8">
            <Button
  variant="outline"
  className="border-gray-300"
  onClick={() => {
    // Clear results
    setResult(null);
    setSelectedPlatform(null);
    setReport(null);
    setError("");
    setLoadingPhase(null);

    // Reset inputs
    setSocials(null);
    setWebsiteUrl("");
    setSocialUsername("");

    // Go back to start
    setEntryMode("website");
  }}
>
  Grade Another Platform
</Button>



            </div>
          </div>
        )}
        
      </main>

      <footer className="border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center text-gray-500 text-sm">
          <p>&copy; 2024 Omada. Your growth partner for social media success.</p>
        </div>
      </footer>
    </div>
  );
}











// // without social handles
// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent } from '@/components/ui/card';
// import { TrendingUp, Users, Calendar, Target, Sparkles } from 'lucide-react';

// interface InstagramMetrics {
//   posts_last_30_days: number;
//   avg_posts_per_week: number;
//   days_since_last_post: number;
//   followers: number;
//   engagement_rate: number;
// }

// interface GradeResponse {
//   instagram: {
//     handle: string;
//     metrics: InstagramMetrics;
//     grade: string;
//     score: number;
//     urgency: string[];
//   };
// }

// export default function Home() {
//   const [username, setUsername] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<GradeResponse | null>(null);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setResult(null);

//     try {
//       const cleanUsername = username.replace('@', '').replace('https://www.instagram.com/', '').replace('/', '');

//       const response = await fetch('http://localhost:4000/grade', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ input: `https://www.instagram.com/${cleanUsername}/` }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch grade');
//       }

//       const data = await response.json();
//       setResult(data);
//     } catch (err) {
//       setError('Failed to grade profile. Please check the username and try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getGradeColor = (grade: string) => {
//     switch (grade) {
//       case 'A':
//         return 'text-green-600';
//       case 'B':
//         return 'text-lime-600';
//       case 'C':
//         return 'text-yellow-600';
//       case 'D':
//         return 'text-orange-600';
//       default:
//         return 'text-red-600';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <nav className="border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-300 to-blue-200 flex items-center justify-center">
//               <Sparkles className="w-5 h-5 text-gray-700" />
//             </div>
//             <span className="text-xl font-semibold text-gray-900">Omada</span>
//           </div>
//           <div className="flex items-center space-x-8">
//             <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
//             <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</a>
//             <Button variant="ghost" className="text-gray-600">Login</Button>
//             <Button className="bg-gradient-to-r from-green-200 to-blue-200 text-gray-900 hover:from-green-300 hover:to-blue-300">
//               Try for Free
//             </Button>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 py-20">
//         <div className="max-w-3xl mx-auto text-center mb-16">
//           <div className="inline-block mb-6">
//             <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center shadow-lg">
//               <Sparkles className="w-10 h-10 text-gray-700" />
//             </div>
//           </div>

//           <h1 className="text-5xl font-bold text-gray-900 mb-4">
//             The Marketing Assistant.
//           </h1>

//           <p className="text-xl text-gray-500 mb-2">
//             Your growth partner that thinks, acts, and keeps you in the loop.
//           </p>

//           <p className="text-gray-400 max-w-2xl mx-auto mb-12">
//             Your Marketing Assistant keeps your marketing on track — it monitors performance,
//             optimizes strategies, creates content, and analyzes feedback to uncover new opportunities.
//             It's also bilingual, supporting English and Spanish.
//           </p>

//           <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-8 shadow-sm border border-gray-100">
//             <h2 className="text-2xl font-semibold text-gray-900 mb-2">
//               Grade Your Instagram Profile
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Get instant insights and actionable recommendations for your social media presence.
//             </p>

//             <form onSubmit={handleSubmit} className="flex gap-3 max-w-xl mx-auto">
//               <Input
//                 type="text"
//                 placeholder="Enter Instagram username (e.g., @hirehack.ai)"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="flex-1 h-12 text-base bg-white"
//                 disabled={loading}
//               />
//               <Button
//                 type="submit"
//                 disabled={loading || !username}
//                 className="h-12 px-8 bg-gray-900 text-white hover:bg-gray-800"
//               >
//                 {loading ? 'Analyzing...' : 'Grade Profile'}
//               </Button>
//             </form>

//             {error && (
//               <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>

//         {result && (
//           <div className="max-w-4xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <Card className="bg-gradient-to-br from-gray-900 to-green-900 text-white border-none shadow-2xl">
//               <CardContent className="p-8">
//                 <div className="flex items-center justify-between mb-8">
//                   <div>
//                     <p className="text-green-200 text-sm font-medium mb-1">INSTAGRAM PROFILE</p>
//                     <h3 className="text-3xl font-bold">@{result.instagram.handle}</h3>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-green-200 text-sm font-medium mb-1">OVERALL GRADE</p>
//                     <div className="flex items-baseline gap-2">
//                       <span className={`text-6xl font-bold ${getGradeColor(result.instagram.grade)}`}>
//                         {result.instagram.grade}
//                       </span>
//                       <span className="text-3xl text-gray-300">
//                         {result.instagram.score}/100
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
//                   <div className="bg-white/10 backdrop-blur rounded-xl p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Calendar className="w-4 h-4 text-green-300" />
//                       <p className="text-xs text-green-200 font-medium">POSTS (30d)</p>
//                     </div>
//                     <p className="text-2xl font-bold">{result.instagram.metrics.posts_last_30_days}</p>
//                   </div>

//                   <div className="bg-white/10 backdrop-blur rounded-xl p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <TrendingUp className="w-4 h-4 text-green-300" />
//                       <p className="text-xs text-green-200 font-medium">AVG/WEEK</p>
//                     </div>
//                     <p className="text-2xl font-bold">{result.instagram.metrics.avg_posts_per_week}x</p>
//                   </div>

//                   <div className="bg-white/10 backdrop-blur rounded-xl p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Target className="w-4 h-4 text-green-300" />
//                       <p className="text-xs text-green-200 font-medium">LAST POST</p>
//                     </div>
//                     <p className="text-2xl font-bold">{result.instagram.metrics.days_since_last_post}d</p>
//                   </div>

//                   <div className="bg-white/10 backdrop-blur rounded-xl p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Users className="w-4 h-4 text-green-300" />
//                       <p className="text-xs text-green-200 font-medium">FOLLOWERS</p>
//                     </div>
//                     <p className="text-2xl font-bold">{result.instagram.metrics.followers.toLocaleString()}</p>
//                   </div>

//                   <div className="bg-white/10 backdrop-blur rounded-xl p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Sparkles className="w-4 h-4 text-green-300" />
//                       <p className="text-xs text-green-200 font-medium">ENGAGEMENT</p>
//                     </div>
//                     <p className="text-2xl font-bold">{result.instagram.metrics.engagement_rate.toFixed(1)}%</p>
//                   </div>
//                 </div>

//                 {result.instagram.urgency && result.instagram.urgency.length > 0 && (
//                   <div className="bg-yellow-500/20 backdrop-blur rounded-xl p-6 border border-yellow-500/30">
//                     <p className="text-yellow-200 text-sm font-medium mb-3">RECOMMENDATIONS</p>
//                     <div className="space-y-2">
//                       {result.instagram.urgency.map((item, index) => (
//                         <p key={index} className="text-white text-base">
//                           {item}
//                         </p>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             <div className="text-center mt-8">
//               <Button
//                 onClick={() => {
//                   setResult(null);
//                   setUsername('');
//                 }}
//                 variant="outline"
//                 className="border-gray-300"
//               >
//                 Grade Another Profile
//               </Button>
//             </div>
//           </div>
//         )}
//       </main>

//       <footer className="border-t border-gray-100 mt-20">
//         <div className="max-w-7xl mx-auto px-6 py-12 text-center text-gray-500 text-sm">
//           <p>&copy; 2024 Omada. Your growth partner for social media success.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }











// // with posts
// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent } from '@/components/ui/card';
// import { TrendingUp, Users, Calendar, Target, Sparkles } from 'lucide-react';

// interface InstagramMetrics {
//   posts_last_30_days: number;
//   avg_posts_per_week: number;
//   days_since_last_post: number;
//   followers: number;
//   engagement_rate: number;
// }

// interface GradeResponse {
//   instagram: {
//     handle: string;
//     metrics: InstagramMetrics;
//     grade: string;
//     score: number;
//     urgency: string[];
//   };
// }
// interface LatestPost {
//   url: string;
//   media_type: string;
//   thumbnail?: string;
// }

// interface LatestPostsResponse {
//   posts: LatestPost[];
// }


// export default function Home() {
//   const [username, setUsername] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<GradeResponse | null>(null);
//   const [error, setError] = useState('');
//   const [latestPosts, setLatestPosts] = useState<LatestPost[]>([]);
//   const [loadingPosts, setLoadingPosts] = useState(false);
  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setLoadingPosts(true);
//     setError('');
//     setResult(null);
//     setLatestPosts([]);
  
//     try {
//       const cleanUsername = username
//         .replace('@', '')
//         .replace('https://www.instagram.com/', '')
//         .replace('/', '');
  
//       const payload = {
//         input: `https://www.instagram.com/${cleanUsername}/`,
//       };
  
//       // 🚀 CALL BOTH APIS IN PARALLEL
//       const [latestRes, gradeRes] = await Promise.allSettled([
//         fetch('http://localhost:4000/latest-posts', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         }),
//         fetch('http://localhost:4000/grade', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         }),
//       ]);
  
//       // FAST VISUALS
//       if (latestRes.status === 'fulfilled' && latestRes.value.ok) {
//         const latestData: LatestPostsResponse = await latestRes.value.json();
//         setLatestPosts(latestData.posts || []);
//       }
  
//       // SLOW ANALYTICS
//       if (gradeRes.status === 'fulfilled' && gradeRes.value.ok) {
//         const gradeData = await gradeRes.value.json();
//         setResult(gradeData);
//       } else {
//         throw new Error('Failed to fetch grade');
//       }
//     } catch (err) {
//       setError('Failed to grade profile. Please check the username and try again.');
//     } finally {
//       setLoading(false);
//       setLoadingPosts(false);
//     }
//   };
  

//   const getGradeColor = (grade: string) => {
//     switch (grade) {
//       case 'A':
//         return 'text-green-600';
//       case 'B':
//         return 'text-lime-600';
//       case 'C':
//         return 'text-yellow-600';
//       case 'D':
//         return 'text-orange-600';
//       default:
//         return 'text-red-600';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <nav className="border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-300 to-blue-200 flex items-center justify-center">
//               <Sparkles className="w-5 h-5 text-gray-700" />
//             </div>
//             <span className="text-xl font-semibold text-gray-900">Omada</span>
//           </div>
//           <div className="flex items-center space-x-8">
//             <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
//             <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</a>
//             <Button variant="ghost" className="text-gray-600">Login</Button>
//             <Button className="bg-gradient-to-r from-green-200 to-blue-200 text-gray-900 hover:from-green-300 hover:to-blue-300">
//               Try for Free
//             </Button>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 py-20">
//         <div className="max-w-3xl mx-auto text-center mb-16">
//           <div className="inline-block mb-6">
//             <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center shadow-lg">
//               <Sparkles className="w-10 h-10 text-gray-700" />
//             </div>
//           </div>

//           <h1 className="text-5xl font-bold text-gray-900 mb-4">
//             The Marketing Assistant.
//           </h1>

//           <p className="text-xl text-gray-500 mb-2">
//             Your growth partner that thinks, acts, and keeps you in the loop.
//           </p>

//           <p className="text-gray-400 max-w-2xl mx-auto mb-12">
//             Your Marketing Assistant keeps your marketing on track — it monitors performance,
//             optimizes strategies, creates content, and analyzes feedback to uncover new opportunities.
//             It's also bilingual, supporting English and Spanish.
//           </p>
//           <img
//         src="https://instagram.fphl1-1.fna.fbcdn.net/v/t51.2885-15/570053006_17842703232603734_3482022406384471385_n.jpg?stp=dst-jpg_e15_fr_p1080x1080_tt6&_nc_ht=instagram.fphl1-1.fna.fbcdn.net&_nc_cat=102&_nc_oc=Q6cZ2QF8L3Qg8gXLct56luciauz9hVKz7IHDoK98dvU2RRzegYS5f8V0WvTZcnWoE9XIB_s&_nc_ohc=axV0uuj01JEQ7kNvwHjOcbw&_nc_gid=zGws6jHeOlMRrK7duhqioQ&edm=ANTKIIoBAAAA&ccb=7-5&oh=00_AflZD7BhT3Ru4WA6RMUx0gw9R09g69QTRKohBxfdUB717w&oe=694B166E&_nc_sid=d885a2"
//         alt="Instagram CDN test"
//         width={400}
//         style={{ border: '2px solid red', display: 'block' }}
//       />

//           <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-8 shadow-sm border border-gray-100">
//             <h2 className="text-2xl font-semibold text-gray-900 mb-2">
//               Grade Your Instagram Profile
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Get instant insights and actionable recommendations for your social media presence.
//             </p>

//             <form onSubmit={handleSubmit} className="flex gap-3 max-w-xl mx-auto">
//               <Input
//                 type="text"
//                 placeholder="Enter Instagram username (e.g., @hirehack.ai)"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="flex-1 h-12 text-base bg-white"
//                 disabled={loading}
//               />
//               <Button
//                 type="submit"
//                 disabled={loading || !username}
//                 className="h-12 px-8 bg-gray-900 text-white hover:bg-gray-800"
//               >
//                 {loading ? 'Analyzing...' : 'Grade Profile'}
//               </Button>
//             </form>

//             {error && (
//               <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>
//         {latestPosts.length > 0 && (
//   <div className="max-w-4xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-3 duration-300">
//     <p className="text-sm text-gray-500 mb-3 text-center">
//       Latest Instagram posts
//     </p>

//     <div className="grid grid-cols-2 gap-4">
//       {latestPosts.map((post, idx) => (
//         <a
//           key={idx}
//           href={post.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="relative group rounded-xl overflow-hidden border border-gray-200"
//         >
//           <img
//             src={post.thumbnail || '/placeholder.png'}
//             alt="Instagram post"
//             className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
//           />

//           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//             <span className="text-white text-sm font-medium capitalize">
//               {post.media_type}
//             </span>
//           </div>
//         </a>
//       ))}
//     </div>
//   </div>
// )}

//         {result && (
//           <div className="max-w-4xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <Card className="bg-gradient-to-br from-gray-900 to-green-900 text-white border-none shadow-2xl">
//               <CardContent className="p-8">
//                 <div className="flex items-center justify-between mb-8">
//                   <div>
//                     <p className="text-green-200 text-sm font-medium mb-1">INSTAGRAM PROFILE</p>
//                     <h3 className="text-3xl font-bold">@{result.instagram.handle}</h3>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-green-200 text-sm font-medium mb-1">OVERALL GRADE</p>
//                     <div className="flex items-baseline gap-2">
//                       <span className={`text-6xl font-bold ${getGradeColor(result.instagram.grade)}`}>
//                         {result.instagram.grade}
//                       </span>
//                       <span className="text-3xl text-gray-300">
//                         {result.instagram.score}/100
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
//                   <div className="bg-white/10 backdrop-blur rounded-xl p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Calendar className="w-4 h-4 text-green-300" />
//                       <p className="text-xs text-green-200 font-medium">POSTS (30d)</p>
//                     </div>
//                     <p className="text-2xl font-bold">{result.instagram.metrics.posts_last_30_days}</p>
//                   </div>

//                   <div className="bg-white/10 backdrop-blur rounded-xl p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <TrendingUp className="w-4 h-4 text-green-300" />
//                       <p className="text-xs text-green-200 font-medium">AVG/WEEK</p>
//                     </div>
//                     <p className="text-2xl font-bold">{result.instagram.metrics.avg_posts_per_week}x</p>
//                   </div>

//                   <div className="bg-white/10 backdrop-blur rounded-xl p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Target className="w-4 h-4 text-green-300" />
//                       <p className="text-xs text-green-200 font-medium">LAST POST</p>
//                     </div>
//                     <p className="text-2xl font-bold">{result.instagram.metrics.days_since_last_post}d</p>
//                   </div>

//                   <div className="bg-white/10 backdrop-blur rounded-xl p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Users className="w-4 h-4 text-green-300" />
//                       <p className="text-xs text-green-200 font-medium">FOLLOWERS</p>
//                     </div>
//                     <p className="text-2xl font-bold">{result.instagram.metrics.followers.toLocaleString()}</p>
//                   </div>

//                   <div className="bg-white/10 backdrop-blur rounded-xl p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Sparkles className="w-4 h-4 text-green-300" />
//                       <p className="text-xs text-green-200 font-medium">ENGAGEMENT</p>
//                     </div>
//                     <p className="text-2xl font-bold">{result.instagram.metrics.engagement_rate.toFixed(1)}%</p>
//                   </div>
//                 </div>

//                 {result.instagram.urgency && result.instagram.urgency.length > 0 && (
//                   <div className="bg-yellow-500/20 backdrop-blur rounded-xl p-6 border border-yellow-500/30">
//                     <p className="text-yellow-200 text-sm font-medium mb-3">RECOMMENDATIONS</p>
//                     <div className="space-y-2">
//                       {result.instagram.urgency.map((item, index) => (
//                         <p key={index} className="text-white text-base">
//                           {item}
//                         </p>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             <div className="text-center mt-8">
//               <Button
//                 onClick={() => {
//                   setResult(null);
//                   setUsername('');
//                 }}
//                 variant="outline"
//                 className="border-gray-300"
//               >
//                 Grade Another Profile
//               </Button>
//             </div>
//           </div>
//         )}
//       </main>

//       <footer className="border-t border-gray-100 mt-20">
//         <div className="max-w-7xl mx-auto px-6 py-12 text-center text-gray-500 text-sm">
//           <p>&copy; 2024 Omada. Your growth partner for social media success.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }







