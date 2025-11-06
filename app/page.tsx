import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Clock, Award, Circle, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const featuredMenuItems = [
    {
      name: "미박 삼겹살",
      nameEn: "Mibak Samgyeopsal",
      price: "14,000원",
      image: "/premium-korean-pork-belly-grilling.jpg",
    },
    {
      name: "목살",
      nameEn: "Pork Neck",
      price: "14,000원",
      image: "/korean-pork-jowl-meat.jpg",
    },
    {
      name: "갈비 본살",
      nameEn: "Galbi Bonsal",
      price: "22,000원",
      image: "/premium-korean-beef-galbi-on-grill.jpg",
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(/placeholder.svg?height=1080&width=1920&query=korean bbq grill fire flames dark atmospheric)",
            filter: "brightness(0.35)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 text-balance text-white tracking-tight leading-[1.1]">
            불의 깊이를 담다,
            <br />
            <span className="text-accent">목구멍</span>의 BBQ
          </h1>
          <p className="text-xl md:text-3xl mb-12 text-gray-100 font-light tracking-wide">
            프리미엄 한식 BBQ의 새로운 기준
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 rounded-full shadow-2xl hover:scale-105 transition-transform"
            >
              <Link href="/locations">매장 찾기</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full bg-white/10 backdrop-blur-md text-white border-2 border-white/50 hover:bg-white hover:text-black hover:scale-105 transition-all"
            >
              <Link href="/franchise">가맹 문의</Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance">대표 메뉴</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              엄선된 최고급 식재료로 만드는 목구멍의 시그니처 메뉴
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMenuItems.map((item, idx) => (
              <Card
                key={idx}
                className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-card hover:-translate-y-2"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 tracking-wide">{item.nameEn}</p>
                  <p className="text-3xl font-bold text-primary">{item.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform bg-transparent"
            >
              <Link href="/menu">전체 메뉴 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-secondary text-secondary-foreground">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl md:text-6xl font-bold text-balance leading-tight">목구멍의 철학</h2>
              <p className="text-xl leading-relaxed text-secondary-foreground/90">
                솥뚜껑에서 구워지는 고기의 풍미, 신선한 미나리의 향긋함, 그리고 정성스러운 서비스.
                <br />
                목구멍은 한식 BBQ의 본질을 지키며 새로운 가치를 창조합니다.
              </p>
              <div className="grid grid-cols-3 gap-8 py-8">
                <div className="text-center group">
                  <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Circle className="h-10 w-10 text-primary" />
                  </div>
                  <p className="font-semibold text-lg">솥뚜껑</p>
                </div>
                <div className="text-center group">
                  <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Award className="h-10 w-10 text-primary" />
                  </div>
                  <p className="font-semibold text-lg">프리미엄 품질</p>
                </div>
                <div className="text-center group">
                  <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <p className="font-semibold text-lg">정성 서비스</p>
                </div>
              </div>
              <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform">
                <Link href="/brand">브랜드 스토리</Link>
              </Button>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/korean-bbq-restaurant-interior-premium-dark-atmosp.jpg"
                alt="목구멍 매장"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance">매장 안내</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              전국 주요 도시에서 목구멍을 만나보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "강남점", address: "서울시 강남구 테헤란로 123", phone: "02-1234-5678" },
              { name: "홍대점", address: "서울시 마포구 홍익로 456", phone: "02-2345-6789" },
              { name: "부산 해운대점", address: "부산시 해운대구 해운대로 789", phone: "051-3456-7890" },
            ].map((location, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-primary">{location.name}</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <span className="text-base leading-relaxed">{location.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                      <span className="text-base">{location.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-6 w-6 text-primary flex-shrink-0" />
                      <span className="text-base">매일 11:00 - 22:00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform bg-transparent"
            >
              <Link href="/locations">전체 매장 보기</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
