import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Mail, Lock, User, MapPin, Sparkles, Check, RefreshCw, Eye, EyeOff } from "lucide-react";
import logoImage from "../assets/logo.png";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";

type SignUpStep = "email" | "emailVerification" | "password" | "name" | "address" | "complete";

const TIMER_SECONDS = 5 * 60;

export function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignUpStep>("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isNameAvailable, setIsNameAvailable] = useState<boolean | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const validateEmail = (value: string) => {
    if (!value) return "이메일을 입력해주세요";
    const validDomains = ["edu.hanbat.ac.kr", "o365.hanbat.ac.kr"];
    const domain = value.split("@")[1];
    if (!domain || !validDomains.includes(domain)) return "한밭대 이메일만 사용 가능합니다 (@edu.hanbat.ac.kr)";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "비밀번호를 입력해주세요";
    if (value.length < 8) return "8자 이상 입력하세요";
    return "";
  };

  const validateName = (value: string) => {
    if (!value) return "닉네임을 입력해주세요";
    if (value.length < 2) return "2자 이상 입력하세요";
    return "";
  };

  const validateAddress = (value: string) => {
    if (!value) return "주소를 입력해주세요";
    return "";
  };

  const handleCheckEmail = async () => {
    const error = validateEmail(email);
    if (error) {
      setErrors({ ...errors, email: error });
      return;
    }

    setIsCheckingEmail(true);
    try {
      const res = await fetch(`/api/users/email/duplicate?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error();
      setIsEmailAvailable(true);
      setErrors({ ...errors, email: "" });
    } catch {
      setIsEmailAvailable(false);
      setErrors({ ...errors, email: "이미 사용 중인 이메일입니다" });
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSendVerificationCode = async () => {
    if (!isEmailAvailable) {
      await handleCheckEmail();
      return;
    }

    setIsSendingCode(true);
    try {
      const res = await fetch("/api/auth/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStep("emailVerification");
      startTimer();
    } catch {
      setErrors({ ...errors, email: "인증 코드 발송에 실패했습니다" });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResendCode = async () => {
    setIsSendingCode(true);
    try {
      const res = await fetch("/api/auth/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setVerificationCode("");
      setErrors({ ...errors, verificationCode: "" });
      startTimer();
    } catch {
      setErrors({ ...errors, verificationCode: "재전송에 실패했습니다" });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setErrors({ ...errors, verificationCode: "6자리를 입력해주세요" });
      return;
    }

    setIsVerifyingCode(true);
    try {
      const res = await fetch("/api/auth/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      if (!res.ok) throw new Error();
      if (timerRef.current) clearInterval(timerRef.current);
      setStep("password");
    } catch {
      setErrors({ ...errors, verificationCode: "인증 코드가 올바르지 않습니다" });
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleCheckName = async () => {
    const error = validateName(name);
    if (error) {
      setErrors({ ...errors, name: error });
      return;
    }

    setIsCheckingName(true);
    try {
      const res = await fetch(`/api/users/name/duplicate?name=${encodeURIComponent(name)}`);
      if (!res.ok) throw new Error();
      setIsNameAvailable(true);
      setErrors({ ...errors, name: "" });
    } catch {
      setIsNameAvailable(false);
      setErrors({ ...errors, name: "이미 사용 중인 닉네임입니다" });
    } finally {
      setIsCheckingName(false);
    }
  };

  const handleSignup = async () => {
    const error = validateAddress(address);
    if (error) {
      setErrors({ ...errors, address: error });
      return;
    }

    setIsSigningUp(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, address }),
      });
      if (!res.ok) throw new Error();
      setStep("complete");
    } catch {
      setErrors({ ...errors, address: "회원가입에 실패했습니다" });
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleNext = () => {
    switch (step) {
      case "email":
        handleSendVerificationCode();
        break;
      case "emailVerification":
        handleVerifyCode();
        break;
      case "password": {
        const error = validatePassword(password);
        if (!error) setStep("name");
        setErrors({ ...errors, password: error });
        break;
      }
      case "name":
        if (!isNameAvailable) {
          handleCheckName();
          return;
        }
        setStep("address");
        break;
      case "address":
        handleSignup();
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleNext();
  };

  const getStepNumber = () => {
    const steps: SignUpStep[] = ["email", "emailVerification", "password", "name", "address"];
    return steps.indexOf(step) + 1;
  };

  if (step === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6BCF7F]/10 via-white to-[#6BCF7F]/5 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ x: Math.random() * window.innerWidth, y: window.innerHeight + 100, scale: 0 }}
              animate={{ y: -100, scale: [0, 1, 0] }}
              transition={{ duration: Math.random() * 2 + 2, delay: Math.random() * 0.5, ease: "easeOut" }}
            >
              <Sparkles className="w-6 h-6 text-[#6BCF7F]" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center max-w-md w-full relative z-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
            className="relative inline-block mb-8"
          >
            <motion.div
              className="absolute inset-0 bg-[#6BCF7F]/20 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <img src={logoImage} alt="BatChar" className="w-24 h-24 rounded-3xl shadow-2xl relative" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#6BCF7F] rounded-full flex items-center justify-center shadow-lg"
            >
              <Check className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{name}님</h1>
            <p className="text-2xl font-bold bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] bg-clip-text text-transparent mb-4">
              환영합니다!
            </p>
            <p className="text-gray-600 mb-10">BatChar에서 거래를 시작하세요</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] hover:from-[#5ABD6D] hover:to-[#4AAC5C] text-white h-14 px-10 text-lg font-semibold rounded-xl shadow-xl"
            >
              시작하기
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6BCF7F]/10 via-white to-[#6BCF7F]/5 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#6BCF7F]/20 rounded-full"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{ y: [null, Math.random() * window.innerHeight], x: [null, Math.random() * window.innerWidth] }}
            transition={{ duration: Math.random() * 10 + 20, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <motion.img
            src={logoImage}
            alt="BatChar"
            className="w-16 h-16 mx-auto rounded-xl mb-4 shadow-lg"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] bg-clip-text text-transparent mb-2">
            BatChar
          </h2>

          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <motion.div
                key={num}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: num * 0.1 }}
                className="flex items-center"
              >
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    getStepNumber() >= num ? "bg-[#6BCF7F] text-white" : "bg-gray-200 text-gray-400"
                  }`}
                  animate={{ scale: getStepNumber() === num ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {getStepNumber() > num ? <Check className="w-4 h-4" /> : num}
                </motion.div>
                {num < 5 && (
                  <motion.div
                    className={`w-8 h-1 mx-1 rounded-full ${getStepNumber() > num ? "bg-[#6BCF7F]" : "bg-gray-200"}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: num * 0.1 + 0.2 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.div key="email-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="text-xl font-bold text-gray-900 mb-6">이메일</h3>
                <motion.div
                  animate={{ scale: focusedField === "email" ? 1.02 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                      <motion.div
                        animate={{ color: focusedField === "email" ? "#6BCF7F" : "#9CA3AF" }}
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
                          setIsEmailAvailable(null);
                        }}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        onKeyPress={handleKeyPress}
                        placeholder="example@edu.hanbat.ac.kr"
                        className="w-full h-14 pl-12 pr-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#6BCF7F] focus:bg-white transition-all duration-300"
                        autoFocus
                      />
                      {isEmailAvailable === true && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <Check className="w-5 h-5 text-[#6BCF7F]" />
                        </motion.div>
                      )}
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleCheckEmail}
                        disabled={isCheckingEmail || !email}
                        className="h-14 px-4 bg-white border-2 border-[#6BCF7F] text-[#6BCF7F] hover:bg-[#6BCF7F] hover:text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {isCheckingEmail ? <RefreshCw className="w-5 h-5 animate-spin" /> : "중복 확인"}
                      </Button>
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-sm mb-4"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                    {isEmailAvailable === true && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[#6BCF7F] text-sm mb-4"
                      >
                        사용 가능한 이메일입니다
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleNext}
                    disabled={isSendingCode || !isEmailAvailable}
                    className="w-full h-12 bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] hover:from-[#5ABD6D] hover:to-[#4AAC5C] text-white text-base font-semibold rounded-xl disabled:opacity-50"
                  >
                    {isSendingCode ? <RefreshCw className="w-5 h-5 animate-spin" /> : "인증 코드 발송"}
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {step === "emailVerification" && (
              <motion.div
                key="email-verification-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">인증코드 입력</h3>
                <p className="text-sm text-gray-500 text-center mb-6">{email}</p>

                <div className="flex justify-center mb-2">
                  <motion.span
                    key={timeLeft}
                    className={`text-2xl font-bold tabular-nums ${timeLeft <= 60 ? "text-red-500" : "text-[#6BCF7F]"}`}
                  >
                    {formatTime(timeLeft)}
                  </motion.span>
                </div>
                {timeLeft === 0 && (
                  <p className="text-red-500 text-xs text-center mb-4">인증 시간이 만료되었습니다. 재전송해주세요.</p>
                )}

                <div className="flex justify-center mb-8 mt-4">
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={(value) => {
                      setVerificationCode(value);
                      setErrors({ ...errors, verificationCode: "" });
                    }}
                    containerClassName="gap-3"
                  >
                    <InputOTPGroup className="gap-3">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="w-12 h-14 text-xl font-bold border-2 border-gray-300 rounded-xl bg-white shadow-sm focus:border-[#6BCF7F] transition-all"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <AnimatePresence>
                  {errors.verificationCode && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-500 text-sm mb-4 text-center"
                    >
                      {errors.verificationCode}
                    </motion.p>
                  )}
                </AnimatePresence>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleNext}
                    disabled={verificationCode.length !== 6 || isVerifyingCode || timeLeft === 0}
                    className="w-full h-12 bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] hover:from-[#5ABD6D] hover:to-[#4AAC5C] text-white text-base font-semibold rounded-xl disabled:opacity-50"
                  >
                    {isVerifyingCode ? <RefreshCw className="w-5 h-5 animate-spin" /> : "확인"}
                  </Button>
                </motion.div>
                <div className="text-center mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResendCode}
                    disabled={isSendingCode}
                    className="text-gray-500 text-sm hover:text-[#6BCF7F] transition-colors disabled:opacity-50"
                  >
                    {isSendingCode ? "발송 중..." : "인증 코드 재전송"}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === "password" && (
              <motion.div
                key="password-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">비밀번호</h3>
                <motion.div
                  animate={{ scale: focusedField === "password" ? 1.02 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative mb-6">
                    <motion.div
                      animate={{ color: focusedField === "password" ? "#6BCF7F" : "#9CA3AF" }}
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                    >
                      <Lock className="w-5 h-5" />
                    </motion.div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors({ ...errors, password: "" });
                      }}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      onKeyPress={handleKeyPress}
                      placeholder="8자 이상"
                      className="w-full h-14 pl-12 pr-12 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#6BCF7F] focus:bg-white transition-all duration-300"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6BCF7F] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-sm mb-4"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleNext}
                    className="w-full h-12 bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] hover:from-[#5ABD6D] hover:to-[#4AAC5C] text-white text-base font-semibold rounded-xl"
                  >
                    다음
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {step === "name" && (
              <motion.div key="name-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="text-xl font-bold text-gray-900 mb-6">닉네임</h3>
                <motion.div
                  animate={{ scale: focusedField === "name" ? 1.02 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                      <motion.div
                        animate={{ color: focusedField === "name" ? "#6BCF7F" : "#9CA3AF" }}
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                      >
                        <User className="w-5 h-5" />
                      </motion.div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrors({ ...errors, name: "" });
                          setIsNameAvailable(null);
                        }}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="닉네임"
                        className="w-full h-14 pl-12 pr-12 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#6BCF7F] focus:bg-white transition-all duration-300"
                        autoFocus
                      />
                      {isNameAvailable === true && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <Check className="w-5 h-5 text-[#6BCF7F]" />
                        </motion.div>
                      )}
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleCheckName}
                        disabled={isCheckingName || !name || name.length < 2}
                        className="h-14 px-6 bg-white border-2 border-[#6BCF7F] text-[#6BCF7F] hover:bg-[#6BCF7F] hover:text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {isCheckingName ? <RefreshCw className="w-5 h-5 animate-spin" /> : "중복 체크"}
                      </Button>
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-sm mb-4"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                    {isNameAvailable === true && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[#6BCF7F] text-sm mb-4"
                      >
                        사용 가능한 닉네임입니다
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleNext}
                    disabled={!isNameAvailable}
                    className="w-full h-12 bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] hover:from-[#5ABD6D] hover:to-[#4AAC5C] text-white text-base font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {step === "address" && (
              <motion.div
                key="address-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">주소</h3>
                <motion.div
                  animate={{ scale: focusedField === "address" ? 1.02 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative mb-6">
                    <motion.div
                      animate={{ color: focusedField === "address" ? "#6BCF7F" : "#9CA3AF" }}
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                    >
                      <MapPin className="w-5 h-5" />
                    </motion.div>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setErrors({ ...errors, address: "" });
                      }}
                      onFocus={() => setFocusedField("address")}
                      onBlur={() => setFocusedField(null)}
                      onKeyPress={handleKeyPress}
                      placeholder="예) 대전광역시 유성구"
                      className="w-full h-14 pl-12 pr-12 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#6BCF7F] focus:bg-white transition-all duration-300"
                      autoFocus
                    />
                    {address && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <Sparkles className="w-5 h-5 text-[#6BCF7F]" />
                      </motion.div>
                    )}
                  </div>
                  <AnimatePresence>
                    {errors.address && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-sm mb-4"
                      >
                        {errors.address}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleNext}
                    disabled={isSigningUp}
                    className="w-full h-12 bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] hover:from-[#5ABD6D] hover:to-[#4AAC5C] text-white text-base font-semibold rounded-xl disabled:opacity-50"
                  >
                    {isSigningUp ? <RefreshCw className="w-5 h-5 animate-spin" /> : "완료"}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
