import Link from "next/link"
import { Facebook, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">목구멍</h3>
            <p className="text-sm text-muted-foreground">
              불의 깊이를 담다
              <br />
              프리미엄 한식 BBQ
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">메뉴</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/brand" className="hover:text-primary transition-colors">
                  브랜드
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-primary transition-colors">
                  메뉴
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-primary transition-colors">
                  매장찾기
                </Link>
              </li>
              <li>
                <Link href="/franchise" className="hover:text-primary transition-colors">
                  가맹문의
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/support/faq" className="hover:text-primary transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/support/contact" className="hover:text-primary transition-colors">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/support/privacy" className="hover:text-primary transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/support/terms" className="hover:text-primary transition-colors">
                  이용약관
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">소셜 미디어</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2025 목구멍. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
