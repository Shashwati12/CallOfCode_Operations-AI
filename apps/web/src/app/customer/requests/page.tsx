"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft, Search, Clock, AlertCircle, CheckCircle2, ChevronRight, SlidersHorizontal
} from "lucide-react";
import { useEffect, useState } from "react";
import { customerService } from "@/lib/api/customer.service";
import type { CustomerRequest } from "@/lib/types/customer";

export default function CustomerRequestsPage() {
    const router = useRouter();
    const [requests, setRequests] = useState<CustomerRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const data = await customerService.getMyRequests();
            setRequests(data);
        } catch (error) {
            console.error("Failed to load requests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DONE":
            case "COMPLETED": return "text-emerald-400 bg-emerald-400/10";
            case "IN_PROGRESS": return "text-blue-400 bg-blue-400/10";
            case "NEW": return "text-amber-400 bg-amber-400/10";
            case "CANCELLED": return "text-red-400 bg-red-400/10";
            default: return "text-white/60 bg-white/5";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DONE":
            case "COMPLETED": return <CheckCircle2 className="w-5 h-5" />;
            case "IN_PROGRESS": return <Clock className="w-5 h-5" />;
            case "NEW": return <AlertCircle className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesStatus = filter === "ALL" || req.status === filter;
        const matchesSearch = searchQuery === "" || 
            req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.payload?.type?.toLowerCase().includes(searchQuery.toLowerCase());
            
        return matchesStatus && matchesSearch;
    });

    return (
        <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
            <div className="min-h-screen bg-[#001D29] text-white p-4 md:p-8 lg:p-12 font-sans relative">
                 {/* --- Ambient Background Elements --- */}
                <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0096C7] rounded-full blur-[150px] opacity-10 pointer-events-none" />
                <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#00B4D8] rounded-full blur-[120px] opacity-10 pointer-events-none" />

                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all hover:scale-105 active:scale-95 border border-white/5"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
                                <p className="text-[#00B4D8] font-medium mt-1">
                                    Track all your service history
                                </p>
                            </div>
                        </div>

                         <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    placeholder="Search ID or Type..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#00B4D8] transition-all w-48 focus:w-64"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-4 custom-scrollbar">
                        {["ALL", "NEW", "IN_PROGRESS", "COMPLETED"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all ${
                                    filter === status 
                                    ? "bg-[#00B4D8] text-[#001D29] shadow-lg shadow-[#00B4D8]/20" 
                                    : "bg-white/5 text-white/60 hover:bg-white/10"
                                }`}
                            >
                                {status.replace("_", " ")}
                            </button>
                        ))}
                    </div>

                    {/* Request List */}
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex justify-center p-20">
                                <div className="w-10 h-10 border-4 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : filteredRequests.length > 0 ? (
                            filteredRequests.map((req, index) => (
                                <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => router.push(`/customer/requests/${req.id}` as any)}
                                    className="group bg-white/5 border border-white/5 rounded-[2rem] p-6 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
                                    
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getStatusColor(req.status)}`}>
                                                {getStatusIcon(req.status)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-bold">
                                                        {req.payload?.type ? req.payload.type.toUpperCase() : "REQUEST"} 
                                                    </h3>
                                                    <span className="text-white/20 font-light">|</span>
                                                    <span className="font-mono text-[#00B4D8] opacity-80">#{req.id.slice(0, 8)}</span>
                                                </div>
                                                <p className="text-sm text-white/40">
                                                    Created {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                             <div className="text-right hidden md:block">
                                                <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-1">Status</p>
                                                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00B4D8] group-hover:text-[#001D29] transition-all">
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                             <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/20">
                                    <Search className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No requests found</h3>
                                <p className="text-white/40">Try adjusting your filters or create a new request.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #00B4D8; border-radius: 10px; }
            `}</style>
        </ProtectedRoute>
    );
}
