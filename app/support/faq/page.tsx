"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      category: "메뉴",
      questions: [
        {
          q: "미박 삼겹살은 어떤 고기인가요?",
          a: "미박 삼겹살은 목구멍에서 엄선한 프리미엄 삼겹살로, 신선하고 육질이 부드러운 것이 특징입니다. 150g 기준 14,000원에 제공됩니다.",
        },
        {
          q: "솥뚜껑에서 구워먹는 이유가 있나요?",
          a: "솥뚜껑은 열전도율이 우수하여 고기를 골고루 익히고, 기름이 자연스럽게 흘러내려 담백하고 건강한 맛을 즐길 수 있습니다.",
        },
        {
          q: "미나리는 무한 리필인가요?",
          a: "네, 신선한 미나리는 무한으로 제공됩니다. 고기와 함께 드시면 더욱 상큼하고 깔끔한 맛을 느끼실 수 있습니다.",
        },
      ],
    },
    {
      category: "예약 및 방문",
      questions: [
        {
          q: "예약은 어떻게 하나요?",
          a: "각 매장으로 전화 예약하시거나, 네이버 예약 시스템을 통해 온라인 예약이 가능합니다.",
        },
        {
          q: "주차는 가능한가요?",
          a: "매장마다 주차 시설이 다릅니다. 각 매장 정보를 확인하시거나 전화로 문의해주세요.",
        },
        {
          q: "영업시간은 어떻게 되나요?",
          a: "대부분의 매장은 매일 11:00 - 23:00 영업하며, 라스트오더는 22:00입니다. 매장별로 차이가 있을 수 있으니 방문 전 확인해주세요.",
        },
      ],
    },
    {
      category: "가맹",
      questions: [
        {
          q: "가맹 비용은 얼마인가요?",
          a: "가맹 비용은 매장 규모와 위치에 따라 다릅니다. 자세한 상담은 가맹문의 페이지를 통해 신청해주세요.",
        },
        {
          q: "가맹점 교육은 어떻게 진행되나요?",
          a: "본사에서 체계적인 교육 프로그램을 제공하며, 조리 교육부터 운영 관리까지 전반적인 교육을 진행합니다.",
        },
        {
          q: "식재료 공급은 어떻게 이루어지나요?",
          a: "본사에서 엄선한 식재료를 정기적으로 공급하며, 철저한 품질 관리를 통해 일정한 맛을 유지합니다.",
        },
      ],
    },
  ]

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">고객 지원</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">자주 묻는 질문을 확인해보세요</p>
        </div>

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-3xl font-bold mb-6">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex
                  const isOpen = openIndex === globalIndex

                  return (
                    <div key={faqIndex} className="bg-card border border-border rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-accent/50 transition-colors"
                      >
                        <span className="font-semibold text-lg pr-4">{faq.q}</span>
                        <ChevronDown
                          className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}>
                        <div className="px-6 pb-5 text-muted-foreground">{faq.a}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 max-w-4xl mx-auto bg-card border border-border rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">추가 문의사항이 있으신가요?</h3>
          <p className="text-muted-foreground mb-6">고객센터로 연락주시면 친절하게 안내해드리겠습니다.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:02-1234-5678"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02]"
            >
              전화 문의
            </a>
            <a
              href="mailto:support@mokgumeong.com"
              className="px-8 py-3 bg-accent text-accent-foreground rounded-xl font-medium hover:bg-accent/80 transition-all duration-300 hover:scale-[1.02]"
            >
              이메일 문의
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
