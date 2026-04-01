import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import logoImage from "../assets/logo.png";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "이메일을 입력해주세요";
    if (!emailRegex.test(email)) return "올바른 이메일 형식이 아닙니다";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "비밀번호를 입력해주세요";
    return "";
  };

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      navigate("/");
    } catch {
      setErrors({ ...errors, password: "이메일 또는 비밀번호가 올바르지 않습니다" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6BCF7F]/10 via-white to-[#6BCF7F]/5 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#6BCF7F]/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Section */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <img
              src={logoImage}
              alt="BatChar"
              className="w-20 h-20 mx-auto rounded-2xl shadow-xl"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] bg-clip-text text-transparent mt-4"
          >
            BatChar
          </motion.h1>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <div className="space-y-5">
            {/* Email Field */}
            <motion.div
              animate={{
                scale: focusedField === "email" ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <motion.div
                  initial={false}
                  animate={{
                    color: focusedField === "email" ? "#6BCF7F" : "#9CA3AF",
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                >
                  <Mail className="w-5 h-5" />
                </motion.div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: "" });
                  }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  onKeyPress={handleKeyPress}
                  placeholder="이메일"
                  className="w-full h-14 pl-12 pr-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#6BCF7F] focus:bg-white transition-all duration-300"
                  autoFocus
                />
                {email && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <Sparkles className="w-5 h-5 text-[#6BCF7F]" />
                  </motion.div>
                )}
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="text-red-500 text-sm mt-2 ml-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Field */}
            <motion.div
              animate={{
                scale: focusedField === "password" ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <motion.div
                  initial={false}
                  animate={{
                    color: focusedField === "password" ? "#6BCF7F" : "#9CA3AF",
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                >
                  <Lock className="w-5 h-5" />
                </motion.div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "" });
                  }}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  onKeyPress={handleKeyPress}
                  placeholder="비밀번호"
                  className="w-full h-14 pl-12 pr-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#6BCF7F] focus:bg-white transition-all duration-300"
                />
                {password && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <Sparkles className="w-5 h-5 text-[#6BCF7F]" />
                  </motion.div>
                )}
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="text-red-500 text-sm mt-2 ml-1"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Login Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8"
          >
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] hover:from-[#5ABD6D] hover:to-[#4AAC5C] text-white text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                />
              ) : (
                "로그인"
              )}
            </Button>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
              className="text-[#6BCF7F] font-semibold hover:underline"
            >
              회원가입
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}