import { useState, useRef } from "react";
import Slider from "react-slick";
import { ProductCard } from "../components/product-card";
import { ChevronRight, ChevronLeft, Gift, Tag, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router";

const categories = [
  { id: "all", name: "전체", icon: null },
  { id: "electronics", name: "전자기기", icon: null },
  { id: "fashion", name: "의류", icon: null },
  { id: "books", name: "도서", icon: null },
  { id: "living", name: "생활용품", icon: null },
  { id: "sports", name: "스포츠", icon: null },
  { id: "etc", name: "기타", icon: null },
];

const bannerData = [
  {
    id: 1,
    title: "럭셔리 고민 끝!",
    subtitle: "10만 원 더블 혜택",
    backgroundColor: "#1B2B4D",
    textColor: "#ffffff",
  },
  {
    id: 2,
    title: "신규 회원 가입하고",
    subtitle: "5,000원 쿠폰 받기",
    backgroundColor: "#6BCF7F",
    textColor: "#ffffff",
  },
  {
    id: 3,
    title: "한밭대 학생 특가",
    subtitle: "경매 수수료 50% 할인",
    backgroundColor: "#FF6B6B",
    textColor: "#ffffff",
  },
];

const mockProducts = [
  {
    id: "1",
    title: "MacBook Pro 16인치 M1 2021 실버",
    currentPrice: 1250000,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    timeLeft: "2시간 전",
    wishCount: 24,
    location: "한밭대",
  },
  {
    id: "2",
    title: "Nike 에어포스 1 화이트 270mm",
    currentPrice: 45000,
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    timeLeft: "1일 전",
    wishCount: 18,
    location: "한밭대 정문",
  },
  {
    id: "3",
    title: "자바 프로그래밍 완벽 가이드",
    currentPrice: 15000,
    imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",
    timeLeft: "3일 전",
    wishCount: 7,
    location: "대전",
  },
  {
    id: "4",
    title: "아이패드 에어 5세대 256GB 퍼플",
    currentPrice: 580000,
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    timeLeft: "45분 전",
    wishCount: 32,
    location: "한밭대",
  },
  {
    id: "5",
    title: "무선 블루투스 헤드폰 소니 WH-1000XM4",
    currentPrice: 180000,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    timeLeft: "5시간 전",
    wishCount: 15,
    location: "유성구",
  },
  {
    id: "6",
    title: "노스페이스 패딩 점퍼 블랙 M사이즈",
    currentPrice: 95000,
    imageUrl: "https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=800&q=80",
    timeLeft: "2일 전",
    wishCount: 11,
    location: "한밭대",
  },
  {
    id: "7",
    title: "로지텍 MX Master 3 무선 마우스",
    currentPrice: 65000,
    imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80",
    timeLeft: "1일 전",
    wishCount: 9,
    location: "대전",
  },
  {
    id: "8",
    title: "필립스 전기면도기 9000시리즈",
    currentPrice: 125000,
    imageUrl: "https://images.unsplash.com/photo-1499938971550-7ad4500ee3c1?w=800&q=80",
    timeLeft: "4시간 전",
    wishCount: 6,
    location: "한밭대 정문",
  },
  {
    id: "9",
    title: "캐논 EOS M50 미러리스 카메라",
    currentPrice: 420000,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    timeLeft: "3시간 전",
    wishCount: 28,
    location: "한밭대",
  },
  {
    id: "10",
    title: "아디다스 운동화 새상품 260mm",
    currentPrice: 55000,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    timeLeft: "6시간 전",
    wishCount: 14,
    location: "대전",
  },
  {
    id: "11",
    title: "LG 그램 17인치 노트북 2022년형",
    currentPrice: 980000,
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
    timeLeft: "12시간 전",
    wishCount: 41,
    location: "유성구",
  },
  {
    id: "12",
    title: "스타벅스 텀블러 세트 한정판",
    currentPrice: 35000,
    imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
    timeLeft: "1일 전",
    wishCount: 19,
    location: "한밭대",
  },
];

// 입찰 참여 중인 상품
const myBiddingProducts = [
  {
    id: "1",
    title: "MacBook Pro 16인치",
    imageUrl: "https://images.unsplash.com/photo-1532198528077-0d9e4ca9bb40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwbGFwdG9wJTIwZGVza3xlbnwxfHx8fDE3NzQ5NTM2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    myBid: 1250000,
    currentBid: 1320000,
    timeLeft: "2시간 25분",
    isWinning: false,
  },
  {
    id: "2",
    title: "소니 WH-1000XM4",
    imageUrl: "https://images.unsplash.com/photo-1572119244337-bcb4aae995af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwYXVkaW98ZW58MXx8fHwxNzc0ODc5OTkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    myBid: 180000,
    currentBid: 180000,
    timeLeft: "5시간 13분",
    isWinning: true,
  },
  {
    id: "3",
    title: "캐논 EOS M50",
    imageUrl: "https://images.unsplash.com/photo-1579535984712-92fffbbaa266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NzQ5MjE2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    myBid: 420000,
    currentBid: 420000,
    timeLeft: "3시간 47분",
    isWinning: true,
  },
  {
    id: "4",
    title: "아이패드 에어 5세대",
    imageUrl: "https://images.unsplash.com/photo-1672298597883-aba600a9b5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcGFkJTIwdGFibGV0fGVufDF8fHx8MTc3NDk1NDI4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    myBid: 580000,
    currentBid: 610000,
    timeLeft: "1시간 15분",
    isWinning: false,
  },
  {
    id: "5",
    title: "Nike 에어포스 1",
    imageUrl: "https://images.unsplash.com/photo-1637744360335-4df6d1d5ecf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWtlJTIwc2hvZXMlMjBzbmVha2Vyc3xlbnwxfHx8fDE3NzQ5NTM0Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    myBid: 45000,
    currentBid: 45000,
    timeLeft: "4시간 32분",
    isWinning: true,
  },
  {
    id: "6",
    title: "기계식 키보드 RGB",
    imageUrl: "https://images.unsplash.com/photo-1626958390898-162d3577f293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmR8ZW58MXx8fHwxNzc0ODk1ODAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    myBid: 85000,
    currentBid: 92000,
    timeLeft: "6시간 45분",
    isWinning: false,
  },
  {
    id: "7",
    title: "에어팟 프로 2세대",
    imageUrl: "https://images.unsplash.com/photo-1580087608274-bf7969a7e870?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwb2RzJTIwd2lyZWxlc3N8ZW58MXx8fHwxNzc0OTU0MjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    myBid: 195000,
    currentBid: 195000,
    timeLeft: "7시간 20분",
    isWinning: true,
  },
  {
    id: "8",
    title: "자바 완벽 가이드 책",
    imageUrl: "https://images.unsplash.com/photo-1763098844932-7240ee8ff180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwamF2YSUyMHByb2dyYW1taW5nfGVufDF8fHx8MTc3NDk1NDI4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    myBid: 15000,
    currentBid: 18000,
    timeLeft: "9시간 10분",
    isWinning: false,
  },
  {
    id: "9",
    title: "애플워치 시리즈 8",
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwYXBwbGV8ZW58MXx8fHwxNzc0OTU0MjgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    myBid: 320000,
    currentBid: 320000,
    timeLeft: "12시간 35분",
    isWinning: true,
  },
];

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const sliderRef = useRef<Slider>(null);
  const biddingSliderRef = useRef<Slider>(null);

  const filteredProducts = mockProducts;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    appendDots: (dots: React.ReactNode) => (
      <div style={{ bottom: "20px" }}>
        <ul style={{ margin: "0px" }}>{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2 h-2 bg-white/50 rounded-full hover:bg-white transition-all" />
    ),
  };

  const biddingSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Banner Slider */}
        <div className="mb-8 -mx-4 sm:mx-0 relative group">
          <Slider {...sliderSettings} ref={sliderRef}>
            {bannerData.map((banner) => (
              <div key={banner.id}>
                <div
                  className="h-[200px] sm:h-[240px] sm:rounded-2xl flex items-center justify-center px-8 sm:px-12 relative overflow-hidden"
                  style={{ backgroundColor: banner.backgroundColor }}
                >
                  <div className="relative z-10 text-center sm:text-left w-full">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                      <Gift className="w-5 h-5" style={{ color: banner.textColor }} />
                      <span className="text-sm font-medium" style={{ color: banner.textColor, opacity: 0.9 }}>
                        이벤트
                      </span>
                    </div>
                    <h2
                      className="text-2xl sm:text-3xl font-bold mb-2"
                      style={{ color: banner.textColor }}
                    >
                      {banner.title}
                    </h2>
                    <p
                      className="text-xl sm:text-2xl font-semibold"
                      style={{ color: banner.textColor }}
                    >
                      {banner.subtitle}
                    </p>
                  </div>
                  {/* Decorative Elements */}
                  <div
                    className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-10"
                    style={{ backgroundColor: banner.textColor }}
                  />
                  <div
                    className="absolute right-24 bottom-4 w-20 h-20 rounded-full opacity-10"
                    style={{ backgroundColor: banner.textColor }}
                  />
                </div>
              </div>
            ))}
          </Slider>

          {/* Navigation Arrows */}
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="이전 배너"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="다음 배너"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        </div>

        {/* My Bidding Section */}
        {myBiddingProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#6BCF7F]" />
                내가 입찰한 상품
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => biddingSliderRef.current?.slickPrev()}
                  className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center transition-all"
                  aria-label="이전 입찰상품"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => biddingSliderRef.current?.slickNext()}
                  className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center transition-all"
                  aria-label="다음 입찰상품"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
                <Link to="/profile" className="text-sm text-gray-600 hover:text-[#6BCF7F] flex items-center gap-1 font-medium ml-2">
                  전체보기
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <Slider {...biddingSliderSettings} ref={biddingSliderRef}>
                {myBiddingProducts.map((product) => (
                  <div key={product.id} className="px-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="block p-4 border-r border-gray-200 last:border-r-0 hover:bg-gray-50 transition-colors h-full"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
                            {product.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500">내 입찰가</span>
                            <span className="text-sm font-bold text-gray-900">
                              {product.myBid.toLocaleString()}원
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {product.isWinning ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#6BCF7F]/10 text-[#6BCF7F] rounded text-xs font-semibold">
                                  <TrendingUp className="w-3 h-3" />
                                  최고가
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-xs font-semibold">
                                  현재가 {product.currentBid.toLocaleString()}원
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {product.timeLeft}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  className={`px-5 py-3 text-sm whitespace-nowrap transition-all font-medium rounded-full flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? "bg-[#6BCF7F] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#6BCF7F]" />
            오늘의 상품 추천
          </h2>
          <Link to="/products" className="text-sm text-gray-600 hover:text-[#6BCF7F] flex items-center gap-1 font-medium">
            전체보기
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}