import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame } from "lucide-react"

export default function MenuPage() {
  const menuCategories = [
    {
      category: "목구멍 시그니처",
      items: [
        {
          name: "미박 삼겹살",
          nameEn: "Mibak Samgyeopsal",
          description: "프리미엄 미박 삼겹살 (150g)",
          price: "14,000원",
          origin: "국내산",
          spicy: 0,
          best: true,
        },
        {
          name: "목살",
          nameEn: "Pork Neck",
          description: "특선 목살 (150g)",
          price: "14,000원",
          origin: "국내산",
          spicy: 0,
          best: true,
        },
        {
          name: "갈비 본살",
          nameEn: "Galbi Bonsal",
          description: "프리미엄 갈비 본살 (150g)",
          price: "22,000원",
          origin: "국내산(한우)",
          spicy: 0,
          best: true,
        },
      ],
    },
  ]

  const getSpicyLevel = (level: number) => {
    if (level === 0) return null
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: level }).map((_, i) => (
          <Flame key={i} className="h-4 w-4 text-red-500" />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-[50vh] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url(/placeholder.svg?height=800&width=1920&query=korean bbq meat variety display)",
              filter: "brightness(0.5)",
            }}
          />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">메뉴</h1>
            <p className="text-xl text-gray-200">엄선된 최고급 식재료로 만드는 목구멍의 메뉴</p>
          </div>
        </section>

        {/* Menu Categories */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            {menuCategories.map((category, catIdx) => (
              <div key={catIdx} className="mb-16">
                <h2 className="text-3xl font-bold mb-8 pb-4 border-b-2 border-primary text-center">
                  {category.category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {category.items.map((item, itemIdx) => (
                    <Card key={itemIdx} className="hover:shadow-lg transition-all hover:scale-105 duration-300">
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          {item.best && (
                            <Badge variant="default" className="bg-primary mb-3">
                              BEST
                            </Badge>
                          )}
                          <h3 className="text-2xl font-bold mb-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{item.nameEn}</p>
                          {item.description && <p className="text-sm text-muted-foreground mb-3">{item.description}</p>}
                          <p className="text-3xl font-bold text-primary mb-4">{item.price}</p>
                        </div>
                        <div className="flex items-center justify-center text-sm border-t pt-4">
                          <span className="text-muted-foreground">원산지: {item.origin}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Origin & Allergy Info */}
        <section className="py-12 px-4 bg-muted">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-2xl font-bold mb-6">원산지 및 알레르기 정보</h3>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                <strong>원산지:</strong> 쇠고기(한우) - 국내산 / 돼지고기 - 국내산 / 닭고기 - 국내산 / 쌀 - 국내산 /
                배추김치 - 국내산
              </p>
              <p>
                <strong>알레르기 유발 식품:</strong> 본 매장에서 제공하는 음식은 대두, 밀, 계란, 우유, 돼지고기, 쇠고기
                등의 알레르기 유발 식품을 포함하고 있습니다. 알레르기가 있으신 고객께서는 주문 전 직원에게 문의해 주시기
                바랍니다.
              </p>
              <p className="text-muted-foreground">* 메뉴 및 가격은 매장 사정에 따라 변경될 수 있습니다.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
