"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { EditableText } from "@/components/editable/editable-text"
import { EditableBackground } from "@/components/editable/editable-background"
import { useInlineEditor } from "@/contexts/inline-editor-context"

// Notion API 데이터 타입 정의
interface NotionFile {
  name: string
  type: "file"
  file: {
    url: string
    expiry_time: string
  }
}

interface NotionRichText {
  type: "text"
  text: {
    content: string
    link: null | string
  }
  plain_text: string
}

interface NotionPage {
  id: string
  properties: {
    Cover: {
      files: NotionFile[]
    }
    Link: {
      url: string | null
    }
    Skills: {
      rich_text: NotionRichText[]
    }
    Category: {
      select: {
        name: string
        color: string
      }
    }
    Name: {
      title: NotionRichText[]
    }
  }
}

// 변환된 프로젝트 데이터 타입
interface Project {
  id: string
  image: string
  link?: string
  skills: string
  category: string
}

interface ProjectCategory {
  name: string
  projects: Project[]
}

interface ProjectsSliderInfo {
  title: string
  subtitle: string
  background: {
    image: string
    video: string
    color: string
    opacity: number
  }
}

export function ProjectsSlider() {
  const { getData, saveData, isEditMode } = useInlineEditor()
  
  // 기본 설정
  const defaultInfo: ProjectsSliderInfo = {
    title: "프로젝트",
    subtitle: "카테고리별 프로젝트 포트폴리오",
    background: { image: "", video: "", color: "", opacity: 0.1 }
  }

  const [sliderInfo, setSliderInfo] = useState(defaultInfo)
  const [categories, setCategories] = useState<ProjectCategory[]>([])
  const [backgroundData, setBackgroundData] = useState(defaultInfo.background)
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // 슬라이더 참조
  const sliderRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // localStorage에서 데이터 로드
  useEffect(() => {
    const savedData = getData('projects-slider-info') as typeof defaultInfo | null
    if (savedData) {
      const mergedData = { ...defaultInfo, ...savedData }
      setSliderInfo(mergedData)
      if (savedData.background) {
        setBackgroundData(savedData.background)
      }
    }

    const savedBg = getData('projects-slider-background') as typeof defaultInfo.background | null
    if (savedBg) {
      setBackgroundData(savedBg)
    }

    // Notion 데이터 로드
    loadProjectsFromNotion()
  }, [isEditMode])

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null)
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  // Notion API에서 데이터 로드
  const loadProjectsFromNotion = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/notion/projects')
      const data = await response.json()
      
      if (data.success) {
        const transformedCategories = transformNotionData(data.results)
        setCategories(transformedCategories)
      } else {
        console.error('Notion 데이터 로드 실패:', data.error)
      }
    } catch (error) {
      console.error('Notion API 호출 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // Notion 데이터를 컴포넌트 형식으로 변환
  const transformNotionData = (results: NotionPage[]): ProjectCategory[] => {
    const projectMap = new Map<string, Project[]>()

    results.forEach((page) => {
      const { Cover, Link, Skills, Category } = page.properties

      // 필수 데이터 검증
      if (!Cover.files.length || !Category.select || !Skills.rich_text.length) {
        return
      }

      const project: Project = {
        id: page.id,
        image: Cover.files[0].file.url,
        link: Link.url || undefined,
        skills: Skills.rich_text.map(text => text.plain_text).join(', '),
        category: Category.select.name
      }

      const categoryName = Category.select.name
      if (!projectMap.has(categoryName)) {
        projectMap.set(categoryName, [])
      }
      projectMap.get(categoryName)?.push(project)
    })

    // Map을 배열로 변환
    return Array.from(projectMap.entries()).map(([name, projects]) => ({
      name,
      projects
    }))
  }

  // 슬라이더 정보 업데이트
  const updateSliderInfo = (key: keyof ProjectsSliderInfo, value: string) => {
    const newInfo = { ...sliderInfo, [key]: value }
    setSliderInfo(newInfo)
    saveData('projects-slider-info', newInfo)
  }

  // 슬라이더 스크롤
  const scrollSlider = (categoryName: string, direction: 'left' | 'right') => {
    const slider = sliderRefs.current[categoryName]
    if (!slider) return

    const scrollAmount = 320 // 카드 너비 + gap
    const newScrollLeft = direction === 'left' 
      ? slider.scrollLeft - scrollAmount
      : slider.scrollLeft + scrollAmount

    slider.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })
  }

  return (
    <>
      <EditableBackground
        image={backgroundData.image}
        video={backgroundData.video}
        color={backgroundData.color}
        opacity={backgroundData.opacity}
        onChange={(data) => {
          const newData = { ...backgroundData, ...data }
          setBackgroundData(newData)
          saveData('projects-slider-background', newData)
          
          const updatedSliderInfo = { ...sliderInfo, background: newData }
          setSliderInfo(updatedSliderInfo)
          saveData('projects-slider-info', updatedSliderInfo)
        }}
        storageKey="projects-slider-background"
        className="relative"
      >
        <section id="projects" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 섹션 제목 */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                <EditableText
                  value={sliderInfo.title}
                  onChange={(value) => updateSliderInfo('title', value)}
                  storageKey="projects-slider-title"
                />
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                <EditableText
                  value={sliderInfo.subtitle}
                  onChange={(value) => updateSliderInfo('subtitle', value)}
                  storageKey="projects-slider-subtitle"
                />
              </p>
            </div>

            {/* 로딩 상태 */}
            {loading && (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">프로젝트를 불러오는 중...</p>
              </div>
            )}

            {/* 카테고리별 프로젝트 슬라이더 */}
            {!loading && categories.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-6xl block mb-4">🚀</span>
                <p className="text-xl text-muted-foreground">프로젝트를 준비 중입니다</p>
              </div>
            ) : (
              <div className="space-y-12">
                {categories.map((category) => (
                  <div key={category.name} className="relative">
                    {/* 카테고리 제목 */}
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-semibold text-foreground">
                        {category.name}
                      </h3>
                      
                      {/* 슬라이더 네비게이션 버튼 */}
                      {category.projects.length > 1 && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => scrollSlider(category.name, 'left')}
                            className="p-2 rounded-full bg-background/80 hover:bg-background border border-border hover:border-primary transition-all"
                            aria-label={`${category.name} 이전 프로젝트`}
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => scrollSlider(category.name, 'right')}
                            className="p-2 rounded-full bg-background/80 hover:bg-background border border-border hover:border-primary transition-all"
                            aria-label={`${category.name} 다음 프로젝트`}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 프로젝트 슬라이더 */}
                    <div className="relative overflow-hidden">
                      <div
                        ref={(el) => { sliderRefs.current[category.name] = el }}
                        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {category.projects.map((project) => {
                          const ProjectCard = (
                            <>
                              {/* 프로젝트 이미지 */}
                              <div className="relative aspect-[4/3] rounded-lg bg-muted mb-3 overflow-hidden">
                                <img
                                  src={project.image}
                                  alt={`${category.name} 프로젝트`}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  onError={(e) => {
                                    const target = e.currentTarget
                                    target.src = '/placeholder-project.png' // 플레이스홀더 이미지
                                  }}
                                />
                              </div>
                              
                              {/* 프로젝트 기술 스택 */}
                              <div className="px-1">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {project.skills}
                                </p>
                              </div>
                            </>
                          )

                          // 링크가 있으면 링크로 감싸기, 없으면 div로 감싸기
                          return project.link ? (
                            <a
                              key={project.id}
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 w-80 group cursor-pointer block"
                            >
                              {ProjectCard}
                            </a>
                          ) : (
                            <div
                              key={project.id}
                              className="flex-shrink-0 w-80 group cursor-pointer"
                              onClick={() => setSelectedImage(project.image)}
                            >
                              {ProjectCard}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </EditableBackground>

      {/* 이미지 팝업 모달 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          {/* 모달 컨테이너 */}
          <div 
            className="relative bg-background rounded-lg shadow-2xl max-w-4xl max-h-[85vh] w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 hover:bg-background shadow-lg transition-all hover:scale-110"
              aria-label="닫기"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            {/* 확대된 이미지 */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <img
                src={selectedImage}
                alt="확대된 프로젝트 이미지"
                className="max-w-full max-h-[75vh] object-contain rounded"
                onError={(e) => {
                  const target = e.currentTarget
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    const placeholder = document.createElement('div')
                    placeholder.className = 'text-muted-foreground text-center py-20'
                    placeholder.innerHTML = '<span class="text-6xl">📁</span><p class="mt-4">이미지를 불러올 수 없습니다</p>'
                    parent.appendChild(placeholder)
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}