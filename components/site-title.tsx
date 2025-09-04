"use client"

import { useEffect } from "react"

export function SiteTitle() {
  useEffect(() => {
    // 저장된 제목 불러오기
    const savedTitle = localStorage.getItem('portfolio-site-title')
    if (savedTitle) {
      document.title = savedTitle
    }
    // 저장된 제목이 없으면 기본 title 태그 값 유지
    
    // storage 이벤트 리스너 (다른 탭에서 변경시)
    const handleStorageChange = () => {
      const savedTitle = localStorage.getItem('portfolio-site-title')
      if (savedTitle) {
        document.title = savedTitle
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])
  
  return null
}