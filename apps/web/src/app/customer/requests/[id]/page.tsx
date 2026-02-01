"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import { customerService } from "@/lib/api/customer.service";
import { motion } from "framer-motion";
import { 
  User, ClipboardList, ShieldAlert, Clock, 
  ArrowLeft, CheckCircle2, Hash, Layers, 
  Activity, Compass, Box
} from "lucide-react";

export default function CustomerRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!id) return;
    
    customerService.getRequestDetail(id)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#001D29] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0077B6]">Loading...</p>
      </div>
    </div>
  );
  
  if (!data) return (
    <div className="min-h-screen bg-[#001D29] flex items-center justify-center text-white font-bold italic">
      Request Not Found.
    </div>
  );

  const { request, tasks, auditActions } = data;

  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <div className="min-h-screen w-full bg-[#001D29] overflow-y-auto custom-scrollbar relative font-sans text-white">
        
        {/* Background Aesthetic Orbs */}
        <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#00B4D8]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="fixed bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-[#0077B6]/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto p-4 md:p-10 lg:p-14 space-y-8 relative z-10"
        >
          {/* Header Action Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <button onClick={() => router.back()} className="group flex items-center gap-3 text-white hover:text-[#00B4D8] transition-colors">
              <div className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-[1.5rem] shadow-2xl border border-white/5">
              <Compass className="w-5 h-5 text-[#48CAE4]" />
              <div className="h-6 w-[1px] bg-white/10" />
              <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Tracker</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* LEFT: Request Info */}
            <div className="lg:col-span-5 space-y-8">
              <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-xl">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 bg-[#001D29] rounded-[2rem] flex flex-col items-center justify-center text-[#48CAE4] shadow-xl border border-white/5">
                    <Hash className="w-6 h-6 opacity-40 mb-1" />
                    <span className="text-xl font-black">{request.id.toString().slice(0, 4)}</span>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white/90">Request Details</h1>
                    <div className={`mt-3 inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                      request.status === 'PENDING' || request.status === 'NEW'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {request.status}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">Type</span>
                        <span className="font-bold">{request.payload?.type?.toUpperCase() || "N/A"}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">Created</span>
                        <span className="font-bold">{new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
              </section>

               {/* Request Payload Summary (if needed) */}
               {request.payload && (
                  <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                      <h3 className="text-sm font-bold text-[#48CAE4] uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Box className="w-4 h-4" /> Request Items
                      </h3>
                      <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                           <pre className="text-xs text-white/60 whitespace-pre-wrap font-mono">
                               {JSON.stringify(request.payload, null, 2)}
                           </pre>
                      </div>
                  </section>
               )}
            </div>

            {/* RIGHT: Timeline */}
            <div className="lg:col-span-7 space-y-8">
              
              <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
                  <Activity className="w-5 h-5 text-[#0077B6]" /> progress Timeline
                </h3>

                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-white/10 before:-translate-x-1/2">
                  {/* Combine tasks and audit logs into a single timeline if desired, or just show audit logs */}
                  {auditActions.map((log: any) => (
                    <div key={log.id} className="relative pl-10 group">
                      <div className="absolute left-[14px] top-1 w-3 h-3 rounded-full bg-[#001D29] border-2 border-[#00B4D8] z-10 group-hover:scale-125 transition-transform" />
                      
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-bold text-white uppercase tracking-wide">{log.action.replace(/_/g, " ")}</p>
                          <span className="text-[10px] font-medium text-white/40">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                        
                        <p className="text-xs text-[#00B4D8] uppercase tracking-wider font-bold">
                             {log.actor}
                        </p>

                        {log.reason && (
                          <div className="mt-2 p-3 bg-white/5 text-white/70 rounded-xl text-xs border border-white/5">
                            {log.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {auditActions.length === 0 && (
                      <div className="pl-10 text-white/40 text-sm">No activity recorded yet.</div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #00B4D8; border-radius: 10px; }
      `}</style>
    </ProtectedRoute>
  );
}
