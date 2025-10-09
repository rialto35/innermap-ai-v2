'use client'

import { useState } from 'react'

interface TagFilterProps {
  tags: string[]
  onTagChange?: (tag: string) => void
}

export default function TagFilter({ tags, onTagChange }: TagFilterProps) {
  const [activeTag, setActiveTag] = useState(tags[0])

  const handleTagClick = (tag: string) => {
    setActiveTag(tag)
    onTagChange?.(tag)
  }

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={`px-4 py-2 rounded-lg transition-all min-h-[44px] ${
            activeTag === tag
              ? 'bg-indigo-500 text-white shadow-lg scale-105'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
