import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  // 🔒 개발 환경에서만 작동 (배포 시 자동 비활성화)
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: '개발 모드에서만 사용 가능합니다' },
      { status: 403 }
    )
  }

  try {
    const { component, section, data } = await request.json()
    
    // 📁 수정 가능한 컴포넌트 파일들
    const componentFiles: Record<string, string> = {
      'hero': 'components/hero.tsx',
      'about': 'components/about.tsx',
      'projects': 'components/projects.tsx',
      'contact': 'components/contact.tsx',
      'footer': 'components/footer.tsx',
      'header': 'components/header.tsx',
      'navbar': 'components/navbar.tsx'
    }
    
    const fileName = componentFiles[component]
    if (!fileName) {
      return NextResponse.json(
        { error: '허용되지 않은 컴포넌트입니다' },
        { status: 400 }
      )
    }
    
    // 파일 읽기
    const filePath = path.join(process.cwd(), fileName)
    let content = await fs.readFile(filePath, 'utf-8')
    
    // 🎯 defaultInfo 객체 찾아서 교체
    // 더 정확한 방법: AST를 사용하거나 균형잡힌 중괄호 찾기
    const objectName = `default${section || 'Info'}`
    
    // SocialLinks는 배열이므로 다르게 처리
    const isArray = section === 'SocialLinks'
    
    // 여러 패턴 시도 (타입 정의가 있는 경우와 없는 경우)
    let startIndex = -1
    let startPattern = ''
    
    if (isArray) {
      // 배열의 경우 여러 패턴 시도
      const patterns = [
        `const ${objectName} = [`,
        `const ${objectName}: { name: string; icon: string; url: string }[] = [`,
        `const ${objectName}: Array<{ name: string; icon: string; url: string }> = [`,
        `const ${objectName}: any[] = [`
      ]
      
      for (const pattern of patterns) {
        startIndex = content.indexOf(pattern)
        if (startIndex !== -1) {
          startPattern = pattern
          break
        }
      }
    } else {
      startPattern = `const ${objectName} = {`
      startIndex = content.indexOf(startPattern)
    }
    
    if (startIndex === -1) {
      return NextResponse.json(
        { error: `${objectName} 객체를 찾을 수 없습니다` },
        { status: 400 }
      )
    }
    
    // 중괄호/대괄호 균형 맞추기로 객체 끝 찾기
    let braceCount = 0
    let bracketCount = 0
    let inString = false
    let escapeNext = false
    let stringChar = ''
    let endIndex = startIndex + startPattern.length - 1
    const openChar = isArray ? '[' : '{'
    const closeChar = isArray ? ']' : '}'
    
    // 시작 문자부터 카운트 시작
    if (isArray) {
      bracketCount = 1
    } else {
      braceCount = 1
    }
    
    for (let i = startIndex + startPattern.length; i < content.length; i++) {
      const char = content[i]
      
      if (escapeNext) {
        escapeNext = false
        continue
      }
      
      if (char === '\\') {
        escapeNext = true
        continue
      }
      
      // 문자열 처리 (싱글쿼트와 더블쿼트 모두)
      if (!inString && (char === '"' || char === "'" || char === '`')) {
        inString = true
        stringChar = char
        continue
      } else if (inString && char === stringChar && !escapeNext) {
        inString = false
        stringChar = ''
        continue
      }
      
      if (!inString) {
        if (isArray) {
          // 배열인 경우
          if (char === '[') {
            bracketCount++
          } else if (char === ']') {
            bracketCount--
            if (bracketCount === 0) {
              endIndex = i
              break
            }
          } else if (char === '{') {
            braceCount++
          } else if (char === '}') {
            braceCount--
          }
        } else {
          // 객체인 경우
          if (char === '{') {
            braceCount++
          } else if (char === '}') {
            braceCount--
            if (braceCount === 0) {
              endIndex = i
              break
            }
          } else if (char === '[') {
            bracketCount++
          } else if (char === ']') {
            bracketCount--
          }
        }
      }
    }
    
    // 새로운 defaultInfo 객체 생성
    // 배열인 경우 다르게 처리
    let newDefaultInfoContent: string
    
    if (isArray) {
      // SocialLinks는 배열이므로 JSON.stringify로 처리
      newDefaultInfoContent = JSON.stringify(data, null, 2)
        .split('\n')
        .map((line, index) => index === 0 ? line : `  ${line}`)
        .join('\n')
    } else {
      // 객체인 경우 기존 로직
      const contentArray = Object.entries(data).map(([key, value]) => {
      // header 컴포넌트의 items 처리 - 아이콘을 문자열로 변환
      if (component === 'header' && key === 'items' && Array.isArray(value)) {
        const itemsWithStringIcons = value.map((item: { icon?: unknown; [key: string]: unknown }) => ({
          ...item,
          icon: typeof item.icon === 'string' ? item.icon : "Home"
        }))
        return `    ${key}: ${JSON.stringify(itemsWithStringIcons)}`
      } else if (typeof value === 'string') {
        // 문자열 값 이스케이프 처리
        const escaped = value.replace(/"/g, '\\"').replace(/\n/g, '\\n')
        return `    ${key}: "${escaped}"`
      } else if (Array.isArray(value)) {
        // projects 배열인 경우 타입 정의 추가
        if (component === 'projects' && key === 'projects') {
          return `    ${key}: ${JSON.stringify(value)} as Array<{ image: string; video?: string; title: string; description: string }>`
        }
        return `    ${key}: ${JSON.stringify(value)}`
      } else {
        return `    ${key}: ${JSON.stringify(value)}`
      }
      }).join(',\n')
      
      newDefaultInfoContent = contentArray
    }
    
    // 타입 정의를 유지하면서 새로운 객체 생성
    let newDefaultInfo: string
    if (isArray) {
      // 원래 타입 정의 추출 (있는 경우)
      const typeMatch = startPattern.match(new RegExp(`const ${objectName}(:[^=]+)? = \\[`))
      const typeDefinition = typeMatch && typeMatch[1] ? typeMatch[1] : ': { name: string; icon: string; url: string }[]'
      newDefaultInfo = `const ${objectName}${typeDefinition} = ${newDefaultInfoContent}`
    } else {
      newDefaultInfo = `const ${objectName} = {\n${newDefaultInfoContent}\n  }`
    }
    
    // 파일 내용 교체
    const beforeContent = content.substring(0, startIndex)
    const afterContent = content.substring(endIndex + 1)
    content = beforeContent + newDefaultInfo + afterContent
    
    // 파일 저장
    await fs.writeFile(filePath, content, 'utf-8')
    
    console.log(`✅ ${fileName} 파일이 업데이트되었습니다`)
    
    return NextResponse.json({ 
      success: true,
      message: '파일이 성공적으로 저장되었습니다'
    })
    
  } catch (error) {
    console.error('파일 저장 오류:', error)
    return NextResponse.json(
      { error: '파일 저장 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}