"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import apiClient from "@/lib/api/client";
import { motion } from "framer-motion";
import { 
  History, 
  ArrowLeft, 
  CheckCircle2, 
  Hash, 
  Calendar, 
  Layers, 
  Activity,
  ChevronRight
} from "lucide-react";

type TaskHistoryItem = {
  id: string;
  status: string;
  createdAt: string;
  completedAt?: string | null;
  request?: {
    id: string;
    status: string;
  };
};

export default function TaskHistoryPage() {
  // --- LOGIC: UNTOUCHED ---
  const [tasks, setTasks] = useState<TaskHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    apiClient
      .get<TaskHistoryItem[]>("/api/worker/tasks")
      .then((res) => {
        const completed = res.data.filter(
          (task) => task.status === "DONE"
        );
        setTasks(completed);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // --- DESIGN: ARTISAN ARCHIVE ---
  return (
    <ProtectedRoute allowedRoles={[UserRole.WORKER]}>
      <div className="min-h-screen w-full bg-[#E0F2F1] overflow-y-auto custom-scrollbar relative font-sans">
        
        {/* Background Aesthetic Orbs */}
        <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#00B4D8]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="fixed bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-[#0077B6]/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto p-6 md:p-10 lg:p-14 space-y-10 relative z-10"
        >
          {/* Header Section */}
          <header className="space-y-6">
            <button
              onClick={() => router.push("/worker/dashboard")}
              className="group flex items-center gap-3 text-[#001D29] hover:text-[#00B4D8] transition-colors"
            >
              <div className="p-2.5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#001D29]/10 pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#001D29] rounded-xl shadow-lg shadow-[#001D29]/20">
                    <History className="w-5 h-5 text-[#48CAE4]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0077B6]">Performance Log</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-black text-[#001D29] tracking-tighter italic leading-none">
                  Task <span className="text-[#00B4D8]">History</span>
                </h1>
              </div>

              {!loading && (
                <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/60 shadow-sm">
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#0077B6] opacity-60">Total Completed</p>
                    <p className="text-xl font-bold text-[#001D29] leading-none">{tasks.length}</p>
                  </div>
                  <Activity className="w-5 h-5 text-[#00B4D8] animate-pulse" />
                </div>
              )}
            </div>
          </header>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0077B6]">Accessing Archive...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white/40 backdrop-blur-sm border border-white/60 rounded-[3rem] border-dashed">
              <History className="w-12 h-12 text-[#00B4D8]/20 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-[#001D29]/40">No completed tasks yet.</p>
            </div>
          )}

          {/* Task List */}
          <div className="grid gap-4">
            {tasks.map((task, idx) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => router.push(`/worker/tasks/${task.id}`)}
                className="group relative bg-white/70 backdrop-blur-md border border-white/80 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl hover:shadow-[#0077B6]/10 transition-all cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden"
              >
                {/* Status Indicator Bar */}
                <div className="absolute left-0 top-0 h-full w-1.5 bg-[#00B4D8] opacity-20 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-6 w-full">
                  <div className="w-14 h-14 bg-[#001D29] rounded-2xl flex flex-col items-center justify-center text-[#48CAE4] shadow-lg group-hover:bg-[#0077B6] transition-colors">
                    <Hash className="w-3 h-3 opacity-40 mb-0.5" />
                    <span className="text-xs font-black">{task.id.slice(-2)}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#001D29] group-hover:text-[#0077B6] transition-colors leading-none">Task #{task.id}</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#001D29]/40 uppercase tracking-widest">
                        <Calendar className="w-3 h-3 text-[#00B4D8]" />
                        Completed: {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : "—"}
                      </div>
                      {task.request && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#001D29]/40 uppercase tracking-widest">
                          <Layers className="w-3 h-3 text-[#00B4D8]" />
                          Ref: {task.request.id.slice(0, 6)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-[#E0F2F1] text-[#0077B6] border border-[#CAF0F8] rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                    <CheckCircle2 className="w-3 h-3" />
                    {task.status}
                  </div>
                  <div className="p-3 bg-white border border-[#001D29]/5 rounded-xl text-[#001D29] group-hover:bg-[#001D29] group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Branding */}
          {!loading && tasks.length > 0 && (
            <footer className="flex justify-center pt-10 opacity-[0.05] pointer-events-none select-none">
              <span className="text-6xl font-serif font-black italic text-[#001D29] uppercase tracking-tighter">Artisan Archive</span>
            </footer>
          )}
        </motion.div>
      </div>

      {/* Custom Scrollbar Theme */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00B4D8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0077B6;
        }
      `}</style>
    </ProtectedRoute>
  );
}