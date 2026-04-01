import { motion, AnimatePresence } from "motion/react";
import { X, Bell, MessageCircle, Heart, TrendingUp, Package, Clock } from "lucide-react";
import { Button } from "./ui/button";

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: "bid" | "message" | "like" | "sold" | "system";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  image?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "bid",
    title: "새로운 입찰",
    message: "MacBook Pro M1에 25,000원이 입찰되었습니다.",
    time: "5분 전",
    isRead: false,
  },
  {
    id: "2",
    type: "message",
    title: "새로운 메시지",
    message: "김철수님이 메시지를 보냈습니다.",
    time: "10분 전",
    isRead: false,
  },
  {
    id: "3",
    type: "like",
    title: "관심 상품",
    message: "찜한 상품 '아이패드 Pro'의 가격이 내려갔습니다.",
    time: "1시간 전",
    isRead: true,
  },
  {
    id: "4",
    type: "sold",
    title: "경매 종료",
    message: "iPhone 14 경매가 종료되었습니다.",
    time: "2시간 전",
    isRead: true,
  },
  {
    id: "5",
    type: "bid",
    title: "입찰 성공",
    message: "갤럭시 워치에 입찰하셨습니다.",
    time: "3시간 전",
    isRead: true,
  },
  {
    id: "6",
    type: "system",
    title: "시스템 알림",
    message: "BatChar의 새로운 기능을 확인해보세요!",
    time: "1일 전",
    isRead: true,
  },
];

export function NotificationSidebar({ isOpen, onClose }: NotificationSidebarProps) {
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "bid":
        return <TrendingUp className="w-5 h-5 text-[#6BCF7F]" />;
      case "message":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "like":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "sold":
        return <Package className="w-5 h-5 text-purple-500" />;
      case "system":
        return <Bell className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-[60] backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[70] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#6BCF7F]/5 to-white">
              <div className="flex items-center gap-2">
                <Bell className="w-6 h-6 text-[#6BCF7F]" />
                <h2 className="text-xl font-bold text-gray-900">알림</h2>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {mockNotifications.filter((n) => !n.isRead).length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {mockNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                  <Bell className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg font-medium">알림이 없습니다</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {mockNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.isRead ? "bg-[#6BCF7F]/5" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3
                              className={`text-sm font-semibold ${
                                !notification.isRead ? "text-gray-900" : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-[#6BCF7F] rounded-full flex-shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <Button
                variant="ghost"
                className="w-full text-[#6BCF7F] hover:bg-[#6BCF7F]/10 font-semibold"
              >
                모두 읽음으로 표시
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
