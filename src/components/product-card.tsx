import { Heart } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  title: string;
  currentPrice: number;
  imageUrl: string;
  timeLeft: string;
  wishCount: number;
  location?: string;
  isWished?: boolean;
  soldStatus?: "판매완료" | "유찰" | null;
}

export function ProductCard({
  id,
  title,
  currentPrice,
  imageUrl,
  timeLeft,
  wishCount,
  location = "한밭대",
  isWished = false,
  soldStatus = null,
}: ProductCardProps) {
  const [wished, setWished] = useState(isWished);

  return (
    <div className="group bg-white overflow-hidden hover:shadow-md transition-shadow border border-transparent hover:border-gray-200 rounded-lg relative">
      <Link to={`/product/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              soldStatus ? "opacity-50" : ""
            }`}
          />
          
          {/* Sold Status Overlay Badge */}
          {soldStatus && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-base text-center leading-tight whitespace-pre-line">
                  {soldStatus}
                </span>
              </div>
            </div>
          )}
          
          <button
            onClick={(e) => {
              e.preventDefault();
              setWished(!wished);
            }}
            className="absolute top-3 right-3 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-md active:scale-95"
            aria-label={wished ? "찜 취소" : "찜하기"}
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                wished ? "fill-[#FF6B6B] text-[#FF6B6B] scale-110" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        <div className="p-3">
          <h3 className="text-sm text-gray-900 line-clamp-2 mb-2 min-h-[40px] font-normal">
            {title}
          </h3>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-bold text-base text-[#1B3A22]">
              {currentPrice.toLocaleString()}원
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{location}</span>
            <div className="flex items-center gap-2">
              <span>{timeLeft}</span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {wishCount}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}