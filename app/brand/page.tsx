import { Card, CardContent } from "@/components/ui/card"
import { Award, Target, Heart } from "lucide-react"

export default function BrandPage() {
  return (
    <div className="min-h-screen">
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(/placeholder.svg?height=800&width=1920&query=korean bbq restaurant premium interior)",
              filter: "brightness(0.5)",
            }}
          />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">브랜드 스토리</h1>
            <p className="text-xl text-gray-200">불의 깊이를 담다, 목구멍</p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Card>
                <CardContent className="p-8">
                  <Target className="h-12 w-12 text-primary mb-4" />
                  <h2 className="text-3xl font-bold mb-4">미션</h2>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    한국 전통 BBQ의 정수를 현대적으로 재해석하여, 최고의 맛과 경험을 제공합니다. 우리는 고객에게 특별한
                    순간을 선사하는 것을 목표로 합니다.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <Heart className="h-12 w-12 text-primary mb-4" />
                  <h2 className="text-3xl font-bold mb-4">비전</h2>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    대한민국을 대표하는 프리미엄 BBQ 브랜드로 성장하여, 전 세계에 한식 BBQ의 우수성을 알리고 글로벌 외식
                    문화를 선도합니다.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-20 px-4 bg-secondary text-secondary-foreground">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">목구멍의 철학</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-4">01</div>
                <h3 className="text-2xl font-bold mb-4">최고의 식재료</h3>
                <p className="leading-relaxed">
                  엄선된 국내산 한우와 프리미엄 돼지고기만을 사용하여 최상의 맛을 보장합니다.
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-4">02</div>
                <h3 className="text-2xl font-bold mb-4">정통 숯불 구이</h3>
                <p className="leading-relaxed">참나무 숯을 사용한 전통 방식으로 고기 본연의 깊은 맛을 살립니다.</p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-4">03</div>
                <h3 className="text-2xl font-bold mb-4">정성스러운 서비스</h3>
                <p className="leading-relaxed">고객 한 분 한 분께 최상의 경험을 제공하기 위해 끊임없이 노력합니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* History */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold text-center mb-12">연혁</h2>
            <div className="space-y-8">
              {[
                { year: "2025", event: "목구멍 브랜드 론칭 및 1호점 오픈" },
                { year: "2024", event: "브랜드 개발 및 레시피 연구" },
                { year: "2023", event: "창업팀 구성 및 시장 조사" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-8 items-start">
                  <div className="text-3xl font-bold text-primary min-w-[100px]">{item.year}</div>
                  <div className="flex-1">
                    <p className="text-lg">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards */}
        <section className="py-20 px-4 bg-muted">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">수상 내역</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "2025 외식업 혁신상", org: "한국외식산업협회" },
                { title: "프리미엄 BBQ 부문 대상", org: "대한민국 음식문화대전" },
                { title: "고객만족도 1위", org: "외식산업 리서치" },
              ].map((award, idx) => (
                <Card key={idx}>
                  <CardContent className="p-6 text-center">
                    <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">{award.title}</h3>
                    <p className="text-muted-foreground">{award.org}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
