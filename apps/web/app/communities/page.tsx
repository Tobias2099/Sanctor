"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Home, MessageSquare, Search, SlidersHorizontal, User } from "lucide-react";
import { CommunityCard } from "@/components/community-card";

type ApiCommunity = {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  createdAt?: string;
};

type CommunityCardData = {
  id: string;
  href: string;
  name: string;
  description: string;
  category: string;
  members: number;
  postsPerWeek: number;
  image?: string;
  isJoined: boolean;
};

const fallbackImages = [
  "/images/community-1.jpg",
  "/images/community-4.jpg",
  "/images/community-5.jpg",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getStoredToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt") ||
    ""
  );
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<CommunityCardData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
    const token = getStoredToken();

    if (!token) {
      setError("Log in first so we can load your communities.");
      setIsLoading(false);
      return;
    }

    const loadCommunities = async () => {
      try {
        const response = await fetch(`${apiBase}/api/communities`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "Failed to load communities.");
        }

        const data: ApiCommunity[] = await response.json();
        const mapped = data.map((community, index) => ({
          id: community.id,
          href: `/communities/${slugify(community.name) || community.id}`,
          name: community.name,
          description: community.description?.trim() || "No description yet.",
          category: community.isPrivate ? "PRIVATE" : "PUBLIC",
          members: 0,
          postsPerWeek: 0,
          image: fallbackImages[index % fallbackImages.length],
          isJoined: false,
        }));

        setCommunities(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load communities.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCommunities();
  }, []);

  const filteredCommunities = communities.filter((community) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return (
      community.name.toLowerCase().includes(query) ||
      community.description.toLowerCase().includes(query) ||
      community.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" className="flex items-center gap-2 group" id="nav-logo">
              <div className="p-2 bg-brand-orange rounded-xl text-white shadow-lg shadow-brand-orange/20">
                <Home size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-brand-orange transition-colors">
                Renting
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/communities" className="text-sm font-medium text-brand-orange transition-colors">
                Communities
              </Link>
              <Link href="/post-listings" className="text-sm font-medium text-gray-600 hover:text-brand-orange transition-colors">
                Post Listing
              </Link>
              <div className="h-4 w-px bg-gray-200" />
              <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-orange text-white rounded-full font-medium shadow-md hover:shadow-lg hover:bg-orange-600 transition-all active:scale-95">
                <User size={18} />
                <span>Login</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Find communities..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full bg-brand-cream border border-gray-100 rounded-3xl pl-14 pr-6 py-4 text-base font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-orange/20 transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <label className="relative">
                <span className="sr-only">Community category</span>
                <select className="w-full sm:w-44 appearance-none bg-brand-cream border border-gray-100 rounded-2xl px-5 py-4 pr-10 text-sm font-bold text-gray-700 cursor-pointer hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange/20">
                  <option>All Categories</option>
                  <option>Public</option>
                  <option>Private</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </label>

              <label className="relative">
                <span className="sr-only">Sort communities</span>
                <select className="w-full sm:w-40 appearance-none bg-brand-cream border border-gray-100 rounded-2xl px-5 py-4 pr-10 text-sm font-bold text-gray-700 cursor-pointer hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange/20">
                  <option>Newest</option>
                  <option>Name A-Z</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </label>

              <button className="h-[54px] w-full sm:w-[54px] rounded-2xl bg-brand-cream border border-gray-100 text-gray-700 hover:bg-white transition-colors flex items-center justify-center">
                <SlidersHorizontal size={20} />
                <span className="sr-only">More filters</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-[2rem] border border-gray-100 bg-white p-10 text-center text-gray-500 shadow-sm">
              Loading communities...
            </div>
          ) : error ? (
            <div className="rounded-[2rem] border border-red-100 bg-red-50 p-10 text-center text-red-700 shadow-sm">
              {error}
            </div>
          ) : filteredCommunities.length === 0 ? (
            <div className="rounded-[2rem] border border-gray-100 bg-white p-10 text-center text-gray-500 shadow-sm">
              No communities matched your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCommunities.map((community) => (
                <CommunityCard key={community.id} {...community} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-brand-orange rounded-lg text-white">
                <Home size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight">Renting</span>
            </Link>
            <div className="flex gap-8 text-sm font-medium text-gray-500">
              <a href="#" className="hover:text-brand-orange">
                Terms
              </a>
              <a href="#" className="hover:text-brand-orange">
                Privacy
              </a>
              <a href="#" className="hover:text-brand-orange">
                Contact
              </a>
              <a href="#" className="hover:text-brand-orange">
                Help
              </a>
            </div>
          </div>
          <div className="text-center text-gray-400 text-xs font-medium">
            &copy; {new Date().getFullYear()} Renting. Dedicated to student housing solutions.
          </div>
        </div>
      </footer>

      <button className="fixed bottom-8 right-6 sm:right-8 flex items-center gap-2 px-5 py-4 bg-brand-orange text-white rounded-full font-bold shadow-xl shadow-brand-orange/30 hover:bg-orange-600 transition-all active:scale-95">
        <MessageSquare className="w-5 h-5" />
        <span>Create a community</span>
      </button>
    </div>
  );
}
