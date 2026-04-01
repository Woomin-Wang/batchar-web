import { motion, AnimatePresence } from "motion/react";
import { X, Search, MapPin, Building2, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

interface CampusMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Building {
  id: string;
  name: string;
  code: string;
  category: "학과건물" | "행정건물" | "편의시설" | "기숙사" | "주차장";
  position: { x: number; y: number };
  size: { width: number; height: number }; // 건물 크기
  floors: number; // 층수 (높이 표현용)
  description?: string;
}

const buildings: Building[] = [
  // 실제 한밭대학교 건물 배치 참고
  { id: "1", name: "N1동", code: "N1", category: "학과건물", position: { x: 22, y: 42 }, size: { width: 70, height: 90 }, floors: 5, description: "공과대학" },
  { id: "2", name: "N2동", code: "N2", category: "학과건물", position: { x: 30, y: 38 }, size: { width: 80, height: 100 }, floors: 6, description: "전자정보통신공학과" },
  { id: "3", name: "N3동", code: "N3", category: "학과건물", position: { x: 38, y: 35 }, size: { width: 75, height: 95 }, floors: 5, description: "건축공학과" },
  { id: "4", name: "N4동", code: "N4", category: "학과건물", position: { x: 46, y: 32 }, size: { width: 85, height: 105 }, floors: 7, description: "기계공학과" },
  { id: "5", name: "N5동", code: "N5", category: "학과건물", position: { x: 22, y: 52 }, size: { width: 70, height: 85 }, floors: 4, description: "화학생명공학과" },
  { id: "6", name: "N7동", code: "N7", category: "학과건물", position: { x: 30, y: 58 }, size: { width: 80, height: 95 }, floors: 5, description: "신소재공학과" },
  { id: "7", name: "N8동", code: "N8", category: "학과건물", position: { x: 38, y: 62 }, size: { width: 90, height: 110 }, floors: 8, description: "컴퓨터공학과" },
  { id: "8", name: "S1동", code: "S1", category: "학과건물", position: { x: 54, y: 45 }, size: { width: 85, height: 100 }, floors: 6, description: "인문사회관" },
  { id: "9", name: "S2동", code: "S2", category: "학과건물", position: { x: 62, y: 48 }, size: { width: 80, height: 95 }, floors: 5, description: "경상관" },
  { id: "10", name: "학생회관", code: "학생", category: "편의시설", position: { x: 70, y: 52 }, size: { width: 95, height: 110 }, floors: 4, description: "학생복지시설" },
  { id: "11", name: "도서관", code: "도서관", category: "편의시설", position: { x: 54, y: 55 }, size: { width: 100, height: 90 }, floors: 6, description: "중앙도서관" },
  { id: "12", name: "본관", code: "본관", category: "행정건물", position: { x: 45, y: 48 }, size: { width: 110, height: 85 }, floors: 5, description: "행정관" },
  { id: "13", name: "기숙사", code: "기숙사", category: "기숙사", position: { x: 75, y: 65 }, size: { width: 70, height: 120 }, floors: 10, description: "학생기숙사" },
  { id: "14", name: "정문주차장", code: "P1", category: "주차장", position: { x: 45, y: 78 }, size: { width: 80, height: 40 }, floors: 1, description: "정문 주차장" },
  { id: "15", name: "후문주차장", code: "P2", category: "주차장", position: { x: 68, y: 72 }, size: { width: 70, height: 40 }, floors: 1, description: "후문 주차장" },
];

const categoryColors = {
  학과건물: "#6BCF7F",
  행정건물: "#3B82F6",
  편의시설: "#F59E0B",
  기숙사: "#8B5CF6",
  주차장: "#6B7280",
};

export function CampusMapModal({ isOpen, onClose }: CampusMapModalProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredBuildings = buildings.filter((building) => {
    const matchesSearch = building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || building.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#6BCF7F]/10 to-transparent">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#6BCF7F] p-2 rounded-lg"
                  >
                    <MapPin className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-xl font-bold text-gray-900"
                    >
                      한밭대학교 캠퍼스 지도
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="text-sm text-gray-600"
                    >
                      건물을 클릭하여 상세정보를 확인하세요
                    </motion.p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-9 w-9 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Search and Filters */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="px-6 py-4 border-b border-gray-200 bg-gray-50"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="건물명 또는 코드 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10 border-gray-300"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {Object.entries(categoryColors).map(([category, color]) => (
                      <Button
                        key={category}
                        onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                        variant="outline"
                        size="sm"
                        className={`whitespace-nowrap ${
                          selectedCategory === category
                            ? "border-2 shadow-sm"
                            : "hover:border-gray-400"
                        }`}
                        style={{
                          borderColor: selectedCategory === category ? color : undefined,
                          color: selectedCategory === category ? color : undefined,
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: color }}
                        />
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1 flex overflow-hidden">
                {/* Map Area */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="flex-1 p-6 overflow-auto"
                >
                  <div className="relative w-full h-full min-h-[500px] bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-gray-200 shadow-inner">
                    {/* Sky and Mountain Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-green-50 rounded-xl overflow-hidden">
                      {/* Mountains in background */}
                      <svg className="absolute bottom-0 w-full h-32 opacity-40" viewBox="0 0 1200 160" preserveAspectRatio="none">
                        <path d="M0,160 L0,80 Q200,20 400,80 T800,80 T1200,80 L1200,160 Z" fill="#22c55e" opacity="0.3" />
                        <path d="M0,160 L0,100 Q150,40 300,100 T600,100 T900,100 T1200,100 L1200,160 Z" fill="#16a34a" opacity="0.4" />
                        <path d="M0,160 L0,120 Q100,60 200,120 T400,120 T600,120 T800,120 T1000,120 T1200,120 L1200,160 Z" fill="#15803d" opacity="0.5" />
                      </svg>
                    </div>

                    {/* Grass Pattern */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: 'radial-gradient(circle at 20% 80%, #86efac 1px, transparent 1px), radial-gradient(circle at 80% 20%, #86efac 1px, transparent 1px)',
                      backgroundSize: '30px 30px, 40px 40px'
                    }} />

                    {/* Trees decorations */}
                    {[
                      { x: 10, y: 25 }, { x: 15, y: 35 }, { x: 12, y: 65 },
                      { x: 85, y: 20 }, { x: 88, y: 30 }, { x: 90, y: 55 },
                      { x: 10, y: 85 }, { x: 88, y: 85 }
                    ].map((pos, i) => (
                      <motion.div
                        key={`tree-${i}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.05, type: "spring" }}
                        className="absolute"
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      >
                        {/* Tree */}
                        <div className="relative">
                          {/* Tree shadow */}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/20 rounded-full blur-sm" />
                          {/* Tree trunk */}
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-6 bg-amber-800 rounded-sm" />
                          {/* Tree foliage - 3 circles for depth */}
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 bg-green-600 rounded-full opacity-70" />
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-green-500 rounded-full" />
                          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-6 h-6 bg-green-400 rounded-full" />
                        </div>
                      </motion.div>
                    ))}

                    {/* Campus boundary with perspective */}
                    <div className="absolute inset-8 border-4 border-gray-400/30 rounded-lg" 
                      style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
                        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)'
                      }} 
                    />

                    {/* Curved Roads with realistic styling */}
                    {/* Main entrance road */}
                    <div className="absolute bottom-[15%] left-[50%] -translate-x-1/2 w-24 h-[20%]" 
                      style={{
                        background: 'linear-gradient(to top, #71717a 0%, #52525b 100%)',
                        clipPath: 'polygon(40% 0%, 60% 0%, 70% 100%, 30% 100%)',
                        boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)'
                      }}
                    >
                      <div className="h-full border-l-2 border-dashed border-yellow-400/50 ml-[50%]" />
                    </div>

                    {/* Horizontal main road */}
                    <svg className="absolute top-[48%] left-[10%] w-[80%] h-16" viewBox="0 0 800 60" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#71717a" />
                          <stop offset="50%" stopColor="#52525b" />
                          <stop offset="100%" stopColor="#3f3f46" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 15 Q 200 10, 400 15 T 800 15 L 800 45 Q 600 50, 400 45 T 0 45 Z" 
                        fill="url(#roadGradient)" 
                        opacity="0.9"
                      />
                      {/* Road markings */}
                      <line x1="50" y1="30" x2="150" y2="30" stroke="#fbbf24" strokeWidth="2" strokeDasharray="20,20" opacity="0.6" />
                      <line x1="200" y1="30" x2="300" y2="30" stroke="#fbbf24" strokeWidth="2" strokeDasharray="20,20" opacity="0.6" />
                      <line x1="350" y1="30" x2="450" y2="30" stroke="#fbbf24" strokeWidth="2" strokeDasharray="20,20" opacity="0.6" />
                      <line x1="500" y1="30" x2="600" y2="30" stroke="#fbbf24" strokeWidth="2" strokeDasharray="20,20" opacity="0.6" />
                      <line x1="650" y1="30" x2="750" y2="30" stroke="#fbbf24" strokeWidth="2" strokeDasharray="20,20" opacity="0.6" />
                    </svg>

                    {/* Vertical connecting road */}
                    <svg className="absolute top-[20%] left-[30%] w-16 h-[50%]" viewBox="0 0 60 500" preserveAspectRatio="none">
                      <path d="M 15 0 Q 10 100, 15 200 T 15 400 T 15 500 L 45 500 Q 50 400, 45 300 T 45 100 T 45 0 Z" 
                        fill="url(#roadGradient)" 
                        opacity="0.9"
                      />
                      <line x1="30" y1="50" x2="30" y2="150" stroke="#fbbf24" strokeWidth="2" strokeDasharray="20,20" opacity="0.6" />
                      <line x1="30" y1="200" x2="30" y2="300" stroke="#fbbf24" strokeWidth="2" strokeDasharray="20,20" opacity="0.6" />
                      <line x1="30" y1="350" x2="30" y2="450" stroke="#fbbf24" strokeWidth="2" strokeDasharray="20,20" opacity="0.6" />
                    </svg>

                    {/* Parking lots with realistic appearance */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute"
                      style={{ left: '45%', top: '78%' }}
                    >
                      <div className="relative w-32 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded border-2 border-gray-500 shadow-lg"
                        style={{
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        {/* Parking spaces */}
                        <div className="absolute inset-1 grid grid-cols-4 gap-0.5">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className={`border border-white/40 ${i >= 4 ? 'mt-0.5' : ''}`} />
                          ))}
                        </div>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">
                          정문 주차장
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.55 }}
                      className="absolute"
                      style={{ left: '68%', top: '72%' }}
                    >
                      <div className="relative w-28 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded border-2 border-gray-500 shadow-lg"
                        style={{
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        <div className="absolute inset-1 grid grid-cols-4 gap-0.5">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className={`border border-white/40 ${i >= 4 ? 'mt-0.5' : ''}`} />
                          ))}
                        </div>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">
                          후문 주차장
                        </div>
                      </div>
                    </motion.div>

                    {/* Central Plaza/Square - more realistic */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="relative w-40 h-40">
                        {/* Plaza base */}
                        <div className="absolute inset-0 bg-gradient-to-br from-stone-200 via-stone-300 to-stone-400 rounded-full shadow-2xl"
                          style={{
                            boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.15)'
                          }}
                        >
                          {/* Tile pattern */}
                          <div className="absolute inset-0 rounded-full opacity-30"
                            style={{
                              backgroundImage: `
                                repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 11px),
                                repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 11px)
                              `
                            }}
                          />
                        </div>
                        
                        {/* Fountain */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg"
                          style={{
                            boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.4), 0 4px 12px rgba(59,130,246,0.4)'
                          }}
                        >
                          {/* Water ripples */}
                          <div className="absolute inset-2 border-2 border-white/30 rounded-full" />
                          <div className="absolute inset-4 border-2 border-white/20 rounded-full" />
                          <div className="absolute inset-6 border-2 border-white/10 rounded-full" />
                          
                          {/* Water spray effect */}
                          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                            <motion.div
                              key={angle}
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.6, 0.2, 0.6],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: angle / 360,
                              }}
                              className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full"
                              style={{
                                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-15px)`
                              }}
                            />
                          ))}
                        </div>
                        
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 bg-white/80 px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                          중앙 광장
                        </div>
                      </div>
                    </motion.div>

                    {/* Entrance gates */}
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.45 }}
                      className="absolute bottom-[34%] left-[50%] -translate-x-1/2"
                    >
                      <div className="relative flex items-center gap-2">
                        <div className="w-3 h-12 bg-gradient-to-b from-gray-400 to-gray-600 rounded shadow-lg" />
                        <div className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg border-2 border-emerald-700"
                          style={{
                            boxShadow: '0 4px 6px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          정문 입구
                        </div>
                        <div className="w-3 h-12 bg-gradient-to-b from-gray-400 to-gray-600 rounded shadow-lg" />
                      </div>
                    </motion.div>

                    {/* Buildings - 3D 입체 건물 */}
                    {filteredBuildings.map((building, index) => {
                      const baseHeight = Math.min(building.floors * 8, 50);
                      return (
                        <motion.div
                          key={building.id}
                          initial={{ scale: 0, opacity: 0, y: -50 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.3 + index * 0.03,
                            type: "spring",
                            stiffness: 400,
                            damping: 20
                          }}
                          className="absolute cursor-pointer group perspective-1000"
                          style={{
                            left: `${building.position.x}%`,
                            top: `${building.position.y}%`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: building.floors
                          }}
                          onClick={() => setSelectedBuilding(building)}
                        >
                          {/* 건물 그림자 */}
                          <div 
                            className="absolute rounded-lg blur-md opacity-40"
                            style={{
                              width: `${building.size.width}px`,
                              height: `${building.size.height}px`,
                              backgroundColor: '#000',
                              transform: `translate(${baseHeight * 0.3}px, ${baseHeight * 0.3}px)`,
                              zIndex: -1
                            }}
                          />

                          {/* 3D 건물 본체 */}
                          <motion.div
                            whileHover={{ 
                              scale: 1.08,
                              y: -5,
                              transition: { type: "spring", stiffness: 400 }
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="relative"
                            style={{
                              width: `${building.size.width}px`,
                              height: `${building.size.height}px`,
                            }}
                          >
                            {/* 건물 측면 (깊이감) */}
                            <div 
                              className="absolute rounded-lg opacity-70"
                              style={{
                                width: `${building.size.width}px`,
                                height: `${building.size.height}px`,
                                backgroundColor: categoryColors[building.category],
                                transform: `translate(${baseHeight * 0.15}px, ${baseHeight * 0.15}px)`,
                                filter: 'brightness(0.6)',
                              }}
                            />

                            {/* 건물 정면 */}
                            <div 
                              className={`absolute rounded-lg shadow-2xl border-2 transition-all duration-200 overflow-hidden ${
                                selectedBuilding?.id === building.id
                                  ? "ring-4 ring-white border-white"
                                  : "border-white/30"
                              }`}
                              style={{
                                width: `${building.size.width}px`,
                                height: `${building.size.height}px`,
                                backgroundColor: categoryColors[building.category],
                                background: `linear-gradient(135deg, ${categoryColors[building.category]} 0%, ${categoryColors[building.category]}dd 100%)`,
                              }}
                            >
                              {/* 건물 창문들 */}
                              <div className="absolute inset-0 p-2 grid gap-1" style={{
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gridTemplateRows: `repeat(${Math.min(building.floors, 8)}, 1fr)`
                              }}>
                                {Array.from({ length: Math.min(building.floors * 3, 24) }).map((_, i) => (
                                  <div 
                                    key={i} 
                                    className="bg-white/30 rounded-sm border border-white/40"
                                    style={{
                                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                                    }}
                                  />
                                ))}
                              </div>

                              {/* 건물 아이콘 */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                <Building2 className="text-white drop-shadow-lg" style={{
                                  width: `${Math.min(building.size.width * 0.3, 32)}px`,
                                  height: `${Math.min(building.size.height * 0.3, 32)}px`,
                                }} />
                              </div>

                              {/* 건물 코드 라벨 */}
                              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-white/95 px-2 py-0.5 rounded-full text-xs font-bold shadow-md"
                                style={{ color: categoryColors[building.category] }}>
                                {building.code}
                              </div>

                              {/* 층수 표시 */}
                              <div className="absolute top-1 right-1 bg-black/60 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                                {building.floors}F
                              </div>
                            </div>

                            {/* 건물명 툴팁 */}
                            <div className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg shadow-xl text-xs font-bold transition-all bg-white border-2 ${
                              selectedBuilding?.id === building.id
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                            }`}
                            style={{
                              borderColor: categoryColors[building.category],
                              color: categoryColors[building.category],
                              zIndex: 1000
                            }}>
                              {building.name}
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-b-2 border-r-2 bg-white"
                                style={{ borderColor: categoryColors[building.category] }}
                              />
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })}

                    {/* Compass */}
                    <motion.div
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-xl border-2 border-gray-200"
                    >
                      <Navigation className="w-5 h-5 text-[#6BCF7F]" style={{ transform: 'rotate(45deg)' }} />
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700">N</div>
                    </motion.div>

                    {/* Legend */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200"
                    >
                      <div className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <div className="w-1 h-4 bg-[#6BCF7F] rounded-full" />
                        범례
                      </div>
                      <div className="space-y-2">
                        {Object.entries(categoryColors).map(([category, color]) => (
                          <div key={category} className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded shadow-sm border border-white"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs text-gray-700 font-medium">{category}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Building Info Sidebar */}
                <AnimatePresence>
                  {selectedBuilding && (
                    <motion.div
                      initial={{ x: 300, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 300, opacity: 0 }}
                      transition={{ type: "spring", damping: 25 }}
                      className="w-80 border-l border-gray-200 bg-white p-6 overflow-auto"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">건물 정보</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedBuilding(null)}
                          className="h-8 w-8 -mt-2 -mr-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div
                          className="w-full h-32 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: categoryColors[selectedBuilding.category] }}
                        >
                          <Building2 className="w-16 h-16 text-white" />
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-1">건물명</div>
                          <div className="text-xl font-bold text-gray-900">{selectedBuilding.name}</div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-1">건물 코드</div>
                          <div className="text-lg font-semibold text-gray-800">{selectedBuilding.code}</div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-1">층수</div>
                          <div className="text-lg font-semibold text-gray-800">{selectedBuilding.floors}층</div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-1">카테고리</div>
                          <div
                            className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: categoryColors[selectedBuilding.category] }}
                          >
                            {selectedBuilding.category}
                          </div>
                        </div>

                        {selectedBuilding.description && (
                          <div>
                            <div className="text-sm text-gray-600 mb-1">설명</div>
                            <div className="text-gray-800">{selectedBuilding.description}</div>
                          </div>
                        )}

                        <Button
                          className="w-full bg-[#6BCF7F] hover:bg-[#5ABD6D] text-white"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          길찾기
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}