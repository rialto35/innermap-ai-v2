/**
 * IM-Core v3.0 토글 컴포넌트
 * 
 * 사용자가 v3.0 엔진 사용 여부를 선택할 수 있음
 */

"use client";

import { useState } from "react";

export default function ImV3Toggle({ 
  defaultOn = true,
  onChange,
}: {
  defaultOn?: boolean;
  onChange?: (enabled: boolean) => void;
}) {
  const [on, setOn] = useState(defaultOn);

  const handleChange = (checked: boolean) => {
    setOn(checked);
    onChange?.(checked);
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-purple-200 bg-purple-50/50">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="im-v3-toggle"
          checked={on}
          onChange={(e) => handleChange(e.target.checked)}
          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
        />
        <label htmlFor="im-v3-toggle" className="text-sm font-medium text-gray-700 cursor-pointer">
          IM-Core v3.0 사용
        </label>
      </div>
      
      {on && (
        <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
          연구 베타
        </span>
      )}
    </div>
  );
}

