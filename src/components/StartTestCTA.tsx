"use client";
import { useState } from "react";
import Link from "next/link";

export default function StartTestCTA() {
  const [open,setOpen]=useState(false);
  return (
    <div className="flex items-center">
      <button className="px-6 py-3 rounded-xl bg-black text-white" onClick={()=>setOpen(true)}>
        검사 시작
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-[420px] shadow-xl">
            <h2 className="text-lg font-semibold">분석 모드를 선택하세요</h2>
            <p className="text-sm text-gray-500 mt-1">
              QuickMap(퀵맵) — 나의 성향을 빠르게 스캔하다<br/>
              DeepMap(딥맵) — 내면의 지도를 정밀하게 완성하다
            </p>
            <div className="mt-4 space-y-2">
              <Link href="/analyze/quick" className="block">
                <button className="w-full border rounded-xl py-2">QuickMap (퀵맵)</button>
              </Link>
              <Link href="/analyze/deep" className="block">
                <button className="w-full bg-black text-white rounded-xl py-2">DeepMap (딥맵)</button>
              </Link>
            </div>
            <button className="mt-3 text-xs text-gray-500" onClick={()=>setOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
