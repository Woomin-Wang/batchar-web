import { useState } from "react";
import { useParams, Link } from "react-router";
import { Heart, Clock, ArrowLeft, User, Share2, MapPin, Eye, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockProduct = {
  id: "1",
  title: "MacBook Pro 16인치 M1 2021 실버",
  currentPrice: 1250000,
  startPrice: 1000000,
  images: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80",
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1200&q=80",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1200&q=80",
  ],
  timeLeft: "2시간 30분 남음",
  wishCount: 24,
  bidderCount: 8,
  location: "한밭대 정문",
  views: 142,
  description: `2021년형 MacBook Pro 16인치 실버 색상입니다.

상태: 사용감 거의 없음
- M1 Pro 칩 (10코어 CPU, 16코어 GPU)
- 메모리 16GB
- 512GB SSD
- 배터리 사이클: 45회

포함 내역:
- 본체
- 정품 충전기 및 케이블
- 정품 박스

학교 근처 직거래 가능합니다.`,
  seller: {
    name: "김철수",
    avatar: "",
    rating: 4.8,
  },
  myBid: 1200000,
};

// Mock bid history data
const bidHistory = [
  { id: 1, time: "09:00", price: 1000000, bidder: "시작가" },
  { id: 2, time: "09:15", price: 1050000, bidder: "user***1" },
  { id: 3, time: "09:45", price: 1100000, bidder: "user***2" },
  { id: 4, time: "10:20", price: 1120000, bidder: "user***3" },
  { id: 5, time: "11:00", price: 1150000, bidder: "user***1" },
  { id: 6, time: "12:30", price: 1180000, bidder: "user***4" },
  { id: 7, time: "13:15", price: 1200000, bidder: "user***5" },
  { id: 8, time: "14:00", price: 1250000, bidder: "user***2" },
];

export function ProductDetailPage() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wished, setWished] = useState(false);
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");

  const handleBid = () => {
    const amount = parseInt(bidAmount.replace(/,/g, ""));
    if (amount <= mockProduct.currentPrice) {
      toast.error("현재 최고가보다 높은 금액을 입찰해주세요.");
      return;
    }
    toast.success(`₩${amount.toLocaleString()}에 입찰했습니다!`);
    setBidModalOpen(false);
    setBidAmount("");
  };

  const handleBuyNow = () => {
    // Navigate to payment page with product details
    // This is a placeholder for actual navigation logic
    console.log("즉시 구매 클릭됨");
  };

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Desktop: Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: Image */}
          <div>
            <div className="bg-gray-100 overflow-hidden mb-4 aspect-square rounded-lg">
              <img
                src={mockProduct.images[currentImageIndex]}
                alt={mockProduct.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-2">
              {mockProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative aspect-square w-20 overflow-hidden rounded-md border-2 transition-all hover:border-[#6BCF7F] ${
                    currentImageIndex === idx
                      ? "border-[#6BCF7F] ring-2 ring-[#6BCF7F] ring-offset-2"
                      : "border-gray-200"
                  }`}
                  aria-label={`이미지 ${idx + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              {mockProduct.title}
            </h1>

            <div className="text-3xl sm:text-4xl font-bold text-[#1B3A22] mb-6">
              {mockProduct.currentPrice.toLocaleString()}원
            </div>

            <div className="space-y-3 pb-6 border-b mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">시작가</span>
                <span className="text-gray-900 font-medium">{mockProduct.startPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">입찰자</span>
                <span className="text-gray-900 font-medium">{mockProduct.bidderCount}명</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">남은 시간</span>
                <span className="text-[#FF6B6B] font-semibold flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {mockProduct.timeLeft}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">거래 희망 지역</span>
                <span className="text-gray-900 font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {mockProduct.location}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">조회수</span>
                <span className="text-gray-900 font-medium flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {mockProduct.views}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              {/* Primary Action */}
              <Button
                onClick={() => setBidModalOpen(true)}
                className="w-full bg-[#6BCF7F] hover:bg-[#5ABD6D] text-white h-14 text-lg font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                입찰하기
              </Button>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-12 font-medium border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-transform"
                  onClick={() => {
                    setWished(!wished);
                    toast.success(wished ? "찜 목록에서 제거했습니다." : "찜 목록에 추가했습니다.");
                  }}
                >
                  <Heart
                    className={`w-5 h-5 mr-2 ${wished ? "fill-[#FF6B6B] text-[#FF6B6B]" : ""}`}
                  />
                  {wished ? "찜 취소" : "찜하기"} ({mockProduct.wishCount})
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 font-medium border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-transform"
                  onClick={() => {
                    toast.success("링크가 복사되었습니다.");
                  }}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  공유하기
                </Button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                    <AvatarImage src={mockProduct.seller.avatar} />
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">{mockProduct.seller.name}</div>
                    <div className="text-sm text-gray-500">평점 {mockProduct.seller.rating} ⭐</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="font-medium hover:bg-white active:scale-95 transition-transform"
                >
                  상점 보기
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-lg font-bold text-gray-900 mb-4">상품 정보</h2>
          <div className="whitespace-pre-line text-gray-700 leading-relaxed">
            {mockProduct.description}
          </div>
        </div>

        {/* Bid History Section */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-[#6BCF7F]" />
            <h2 className="text-lg font-bold text-gray-900">입찰 가격 추이</h2>
          </div>

          {/* Chart */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 border border-gray-200">
            <ResponsiveContainer width="100%" height={300} key="bid-chart">
              <LineChart data={bidHistory} key="line-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" key="grid" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#9ca3af' }}
                  key="x-axis"
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#9ca3af' }}
                  tickFormatter={(value) => `₩${(value / 10000).toFixed(0)}만`}
                  key="y-axis"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: number) => [`₩${value.toLocaleString()}`, '입찰가']}
                  labelFormatter={(label) => `시간: ${label}`}
                  key="tooltip"
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#6BCF7F" 
                  strokeWidth={3}
                  dot={{ fill: '#6BCF7F', r: 4 }}
                  activeDot={{ r: 6, fill: '#5ABD6D' }}
                  isAnimationActive={false}
                  key="price-line"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bid History List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">입찰 내역</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {[...bidHistory].reverse().map((bid) => (
                <div 
                  key={bid.id} 
                  className={`px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    bid.id === bidHistory[bidHistory.length - 1].id ? 'bg-green-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      bid.id === bidHistory[bidHistory.length - 1].id ? 'bg-[#6BCF7F] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {bid.id}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        ₩{bid.price.toLocaleString()}
                        {bid.id === bidHistory[bidHistory.length - 1].id && (
                          <span className="ml-2 text-xs font-semibold text-[#6BCF7F] bg-green-100 px-2 py-1 rounded">
                            최고가
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{bid.bidder}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{bid.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      <Dialog open={bidModalOpen} onOpenChange={setBidModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">입찰 금액 입력</DialogTitle>
            <DialogDescription>
              현재 최고가보다 높은 금액을 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">현재 최고가</div>
            <div className="text-3xl font-bold text-[#6BCF7F]">
              ₩{mockProduct.currentPrice.toLocaleString()}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">
                입찰 금액
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium text-lg">
                  ₩
                </span>
                <Input
                  type="text"
                  placeholder="금액을 입력하세요"
                  value={bidAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setBidAmount(value ? parseInt(value).toLocaleString() : "");
                  }}
                  className="pl-9 h-14 text-lg font-semibold focus-visible:ring-2 focus-visible:ring-[#6BCF7F] border-gray-300"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                <span className="font-medium">최소 입찰가:</span>
                <span className="font-semibold text-gray-700">₩{(mockProduct.currentPrice + 10000).toLocaleString()}</span>
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setBidModalOpen(false)}
              className="flex-1 h-12 font-medium border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-transform"
            >
              취소
            </Button>
            <Button
              onClick={handleBid}
              className="flex-1 h-12 bg-[#6BCF7F] hover:bg-[#5ABD6D] text-white font-semibold shadow-md active:scale-[0.98] transition-transform"
            >
              입찰하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}