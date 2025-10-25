"use client";

import { useState } from "react";
import type { ProfileInput } from "@/types/assessment";

interface ProfileFormProps {
  onSubmit: (values: ProfileInput) => void;
}

export default function ProfileForm({ onSubmit }: ProfileFormProps) {
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [consentRequired, setConsentRequired] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gender || !birthdate || !email || !consentRequired) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    onSubmit({
      gender: gender as "male" | "female" | "other",
      birthdate,
      email,
      consentRequired,
      consentMarketing,
    });
  };

  return (
    <form
      className="space-y-6 max-w-xl mx-auto"
      onSubmit={handleSubmit}
    >
      {/* 성별 */}
      <fieldset className="space-y-3">
        <label className="font-semibold text-white block">성별</label>
        <div className="flex gap-4">
          {[
            { value: "male", label: "남성" },
            { value: "female", label: "여성" },
            { value: "other", label: "기타" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="gender"
                value={option.value}
                checked={gender === option.value}
                onChange={() => setGender(option.value as any)}
                className="w-4 h-4 accent-violet-500"
              />
              <span className="text-white/80">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* 생년월일 */}
      <div className="space-y-2">
        <label className="font-semibold text-white block">생년월일</label>
        <input
          type="date"
          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:border-violet-500 focus:outline-none"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />
        <p className="text-xs text-white/50 mt-1">
          💡 생년월일은 사주 보조지표 분석을 위해 사용돼요.
        </p>
      </div>

      {/* 이메일 */}
      <div className="space-y-2">
        <label className="font-semibold text-white block">이메일</label>
        <input
          type="email"
          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:border-violet-500 focus:outline-none"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="text-xs text-white/50 mt-1">
          📧 이메일은 검사 리포트 발송 및 계정 확인 용도로만 사용돼요.
        </p>
      </div>

      {/* 동의 체크박스 */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consentRequired}
            onChange={(e) => setConsentRequired(e.target.checked)}
            className="w-5 h-5 mt-0.5 accent-violet-500"
          />
          <span className="text-white/80 text-sm">
            <strong className="text-white">[필수]</strong> 개인정보 처리·보관에 동의합니다.
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consentMarketing}
            onChange={(e) => setConsentMarketing(e.target.checked)}
            className="w-5 h-5 mt-0.5 accent-violet-500"
          />
          <span className="text-white/80 text-sm">
            <strong className="text-white/70">[선택]</strong> 이메일로 소식/업데이트를 받겠습니다.
          </span>
        </label>
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={!consentRequired}
        className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold shadow-lg shadow-violet-500/20 transition hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        다음
      </button>
    </form>
  );
}

