import { NextResponse } from 'next/server'

// Notion API 응답 타입 정의
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
    link: string | null
  }
  plain_text: string
}

interface NotionSelect {
  id: string
  name: string
  color: string
}

interface NotionPage {
  object: "page"
  id: string
  archived: boolean
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
      select: NotionSelect | null
    }
    Name: {
      title: NotionRichText[]
    }
  }
}

interface NotionDatabaseResponse {
  object: "list"
  results: NotionPage[]
  next_cursor: string | null
  has_more: boolean
}

export async function GET() {
  try {
    const notionToken = process.env.NOTION_TOKEN
    const databaseId = process.env.NOTION_DATABASE_ID || '26a7cb44e75d8045a568f9f8741bec2d'

    if (!notionToken) {
      return NextResponse.json(
        { success: false, error: 'Notion API 토큰이 설정되지 않았습니다' },
        { status: 500 }
      )
    }

    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      next: { revalidate: 300 } // 5분 캐시
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Notion API 오류:', errorData)
      return NextResponse.json(
        { success: false, error: `Notion API 호출 실패: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json() as NotionDatabaseResponse

    // 응답 데이터 검증
    if (!data.results || !Array.isArray(data.results)) {
      return NextResponse.json(
        { success: false, error: '올바르지 않은 Notion 응답 형식입니다' },
        { status: 500 }
      )
    }

    // 필터링: archived되지 않고 필수 필드가 있는 항목만
    const filteredResults = data.results.filter((page: NotionPage) => {
      return (
        !page.archived &&
        page.properties?.Cover?.files?.length > 0 &&
        page.properties?.Category?.select?.name &&
        page.properties?.Skills?.rich_text?.length > 0
      )
    })

    return NextResponse.json({
      success: true,
      results: filteredResults,
      total: filteredResults.length
    })

  } catch (error) {
    console.error('Notion 프로젝트 데이터 로드 실패:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// 정렬 타입 정의
interface NotionSort {
  property: string
  direction: "ascending" | "descending"
}

interface PostRequestBody {
  filters?: Record<string, unknown>
  sorts?: NotionSort[]
}

// POST 요청도 지원 (필터링 등을 위해)
export async function POST(request: Request) {
  try {
    const body = await request.json() as PostRequestBody
    const { filters = {}, sorts = [] } = body

    const notionToken = process.env.NOTION_TOKEN
    const databaseId = process.env.NOTION_DATABASE_ID || '26a7cb44e75d8045a568f9f8741bec2d'

    if (!notionToken) {
      return NextResponse.json(
        { success: false, error: 'Notion API 토큰이 설정되지 않았습니다' },
        { status: 500 }
      )
    }

    const requestBody: Record<string, unknown> = {}
    
    if (Object.keys(filters).length > 0) {
      requestBody.filter = filters
    }
    
    if (sorts.length > 0) {
      requestBody.sorts = sorts
    }

    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify(requestBody),
      next: { revalidate: 300 }
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Notion API 오류:', errorData)
      return NextResponse.json(
        { success: false, error: `Notion API 호출 실패: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json() as NotionDatabaseResponse

    // 필터링
    const filteredResults = data.results.filter((page: NotionPage) => {
      return (
        !page.archived &&
        page.properties?.Cover?.files?.length > 0 &&
        page.properties?.Category?.select?.name &&
        page.properties?.Skills?.rich_text?.length > 0
      )
    })

    return NextResponse.json({
      success: true,
      results: filteredResults,
      total: filteredResults.length
    })

  } catch (error) {
    console.error('Notion 프로젝트 데이터 로드 실패:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}