import { Building2, TrendingUp, Users, Award } from "lucide-react"

export default function FranchisePage() {
  const benefits = [
    {
      icon: Building2,
      title: "검증된 브랜드",
      description: "목구멍만의 독특한 솥뚜껑 구이 방식으로 차별화된 경쟁력",
    },
    {
      icon: TrendingUp,
      title: "높은 수익성",
      description: "최적화된 운영 시스템과 프리미엄 메뉴로 안정적인 매출",
    },
    {
      icon: Users,
      title: "체계적인 교육",
      description: "본사의 전문적인 교육 프로그램과 지속적인 운영 지원",
    },
    {
      icon: Award,
      title: "품질 관리",
      description: "엄선된 식재료 공급과 철저한 품질 관리 시스템",
    },
  ]

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">가맹 문의</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            목구멍과 함께 성공적인 사업을 시작하세요
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground text-pretty">{benefit.description}</p>
              </div>
            )
          })}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 text-center">가맹 상담 신청</h2>

          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                이름 *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="홍길동"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                연락처 *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="010-1234-5678"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                이메일 *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                희망 지역
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="서울시 강남구"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                문의 내용
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                placeholder="가맹 관련 문의사항을 자유롭게 작성해주세요"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02]"
            >
              상담 신청하기
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-2">전화 문의</p>
            <a href="tel:02-1234-5678" className="text-xl font-bold text-primary hover:underline">
              02-1234-5678
            </a>
            <p className="text-sm text-muted-foreground mt-2">평일 09:00 - 18:00</p>
          </div>
        </div>
      </div>
    </main>
  )
}
