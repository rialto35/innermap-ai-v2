"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { routeQuick, routeDeep } from "@/lib/routes";

export default function StartTestCTA() {
  const [open, setOpen] = useState(false);

  // Body scroll lock/unlock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleClose = () => setOpen(false);

  return (
    <div>
      <button 
        className="inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.02]"
        onClick={() => setOpen(true)}
      >
        검사 시작하기
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          >
            <motion.div 
              className="bg-white rounded-2xl p-6 w-[420px] shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold">분석 모드를 선택하세요</h2>
              <p className="text-sm text-gray-500 mt-1">
                QuickMap(퀵맵) — 나의 성향을 빠르게 스캔하다<br/>
                DeepMap(딥맵) — 내면의 지도를 정밀하게 완성하다
              </p>
              <div className="mt-4 space-y-2">
                <Link href={routeQuick} onClick={handleClose} className="block">
                  <button className="w-full border rounded-xl py-2 hover:bg-gray-50 transition">QuickMap (퀵맵)</button>
                </Link>
                <Link href={routeDeep} onClick={handleClose} className="block">
                  <button className="w-full bg-black text-white rounded-xl py-2 hover:bg-gray-800 transition">DeepMap (딥맵)</button>
                </Link>
              </div>
              <button className="mt-3 text-xs text-gray-500 hover:text-gray-700 transition" onClick={handleClose}>닫기</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
