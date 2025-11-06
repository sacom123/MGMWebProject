import { MapPin, Phone, Clock } from "lucide-react"

export default function LocationsPage() {
  const locations = [
    {
      name: "목구멍 강남점",
      address: "서울특별시 강남구 테헤란로 123",
      phone: "02-1234-5678",
      hours: "매일 11:00 - 23:00 (라스트오더 22:00)",
      mapUrl: "https://maps.google.com",
    },
    {
      name: "목구멍 홍대점",
      address: "서울특별시 마포구 홍익로 456",
      phone: "02-2345-6789",
      hours: "매일 11:00 - 23:00 (라스트오더 22:00)",
      mapUrl: "https://maps.google.com",
    },
    {
      name: "목구멍 판교점",
      address: "경기도 성남시 분당구 판교역로 789",
      phone: "031-3456-7890",
      hours: "매일 11:00 - 23:00 (라스트오더 22:00)",
      mapUrl: "https://maps.google.com",
    },
  ]

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">매장 찾기</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">가까운 목구멍 매장을 찾아보세요</p>
        </div>

        {/* Locations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {locations.map((location, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mb-6">{location.name}</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">{location.address}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <a
                    href={`tel:${location.phone}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {location.phone}
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">{location.hours}</p>
                </div>
              </div>

              <a
                href={location.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium text-center hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02]"
              >
                지도에서 보기
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
