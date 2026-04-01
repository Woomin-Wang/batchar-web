import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Mail, Lock, User, ArrowRight, Sparkles, Check, RefreshCw } from "lucide-react";
import logoImage from "figma:asset/e713beec509811896d7b73b03c4deee125aeff6f.png";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";

type SignUpStep = "email" | "emailVerification" | "password" | "name" | "complete";

export function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignUpStep>("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isNameAvailable, setIsNameAvailable] = useState<boolean | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "이메일을 입력해주세요";
    if (!emailRegex.test(email)) return "올바른 형식이 아닙니다";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "비밀번호를 입력해주세요";
    if (password.length < 8) return "8자 이상 입력하세요";
    return "";
  };

  const validateName = (name: string) => {
    if (!name) return "이름을 입력해주세요";
    if (name.length < 2) return "2자 이상 입력하세요";
    return "";
  };

  const handleSendVerificationCode = () => {
    const error = validateEmail(email);
    if (error) {
      setErrors({ ...errors, email: error });
      return;
    }
    
    setIsSendingCode(true);
    setTimeout(() => {
      setIsSendingCode(false);
      setStep("emailVerification");
    }, 1000);
  };

  const handleCheckName = async () => {
    const error = validateName(name);
    if (error) {
      setErrors({ ...errors, name: error });
      return;
    }

    setIsCheckingName(true);
    setTimeout(() => {
      const isAvailable = Math.random() > 0.3;
      setIsNameAvailable(isAvailable);
      setIsCheckingName(false);
      if (!isAvailable) {
        setErrors({ ...errors, name: "이미 사용 중인 닉네임입니다" });
      }
    }, 800);
  };

  const handleNext = () => {
    let error = "";

    switch (step) {
      case "email":
        handleSendVerificationCode();
        break;
      case "emailVerification":
        if (verificationCode.length !== 6) {
          setErrors({ ...errors, verificationCode: "6자리를 입력해주세요" });
          return;
        }
        setStep("password");
        break;
      case "password":
        error = validatePassword(password);
        if (!error) setStep("name");
        break;
      case "name":
        if (!isNameAvailable) {
          handleCheckName();
          return;
        }
        error = validateName(name);
        if (!error) setStep("complete");
        break;
    }

    setErrors({ ...errors, [step]: error });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

  const getStepNumber = () => {
    const steps = ["email", "emailVerification", "password", "name"];
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
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
                scale: 0,
              }}
              animate={{
                y: -100,
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
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
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <img
              src={logoImage}
              alt="BatChar"
              className="w-24 h-24 rounded-3xl shadow-2xl relative"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#6BCF7F] rounded-full flex items-center justify-center shadow-lg"
            >
              <Check className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {name}님
            </h1>
            <p className="text-2xl font-bold bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] bg-clip-text text-transparent mb-4">
              환영합니다!
            </p>
            <p className="text-gray-600 mb-10">
              BatChar에서 거래를 시작하세요
            </p>
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
              className="bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] hover:from-[#5ABD6D] hover:to-[#4AAC5C] text-white h-14 px-10 text-lg font-semibold rounded-xl shadow-xl group"
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

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.img
            src={logoImage}
            alt="BatChar"
            className="w-16 h-16 mx-auto rounded-xl mb-4 shadow-lg"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] bg-clip-text text-transparent mb-2">
            BatChar
          </h2>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4].map((num) => (
              <motion.div
                key={num}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: num * 0.1 }}
                className="flex items-center"
              >
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    getStepNumber() >= num
                      ? "bg-[#6BCF7F] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                  animate={{
                    scale: getStepNumber() === num ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {getStepNumber() > num ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    num
                  )}
                </motion.div>
                {num < 4 && (
                  <motion.div
                    className={`w-8 h-1 mx-1 rounded-full ${
                      getStepNumber() > num ? "bg-[#6BCF7F]" : "bg-gray-200"
                    }`}
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
              <motion.div
                key="email-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">이메일</h3>
                <motion.div
                  animate={{
                    scale: focusedField === "email" ? 1.02 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative mb-6">
                    <motion.div
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
                      placeholder="example@hanbat.ac.kr"
                      className="w-full h-14 pl-12 pr-12 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#6BCF7F] focus:bg-white transition-all duration-300"
                      autoFocus
                    />
                    {email && (
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
                  </AnimatePresence>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleNext}
                    className="w-full h-12 bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] hover:from-[#5ABD6D] hover:to-[#4AAC5C] text-white text-base font-semibold rounded-xl group"
                  >
                    다음
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/login")}
                    className="text-[#6BCF7F] font-semibold hover:underline"
                  >
                    로그인
                  </motion.button>
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
                <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">인증코드 입력</h3>
                <div className="flex justify-center mb-8">
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
                      <InputOTPSlot 
                        index={0} 
                        className="w-12 h-14 text-xl font-bold border-2 border-gray-300 rounded-xl bg-white shadow-sm focus:border-[#6BCF7F] transition-all" 
                      />
                      <InputOTPSlot 
                        index={1} 
                        className="w-12 h-14 text-xl font-bold border-2 border-gray-300 rounded-xl bg-white shadow-sm focus:border-[#6BCF7F] transition-all" 
                      />
                      <InputOTPSlot 
                        index={2} 
                        className="w-12 h-14 text-xl font-bold border-2 border-gray-300 rounded-xl bg-white shadow-sm focus:border-[#6BCF7F] transition-all" 
                      />
                      <InputOTPSlot 
                        index={3} 
                        className="w-12 h-14 text-xl font-bold border-2 border-gray-300 rounded-xl bg-white shadow-sm focus:border-[#6BCF7F] transition-all" 
                      />
                      <InputOTPSlot 
                        index={4} 
                        className="w-12 h-14 text-xl font-bold border-2 border-gray-300 rounded-xl bg-white shadow-sm focus:border-[#6BCF7F] transition-all" 
                      />
                      <InputOTPSlot 
                        index={5} 
                        className="w-12 h-14 text-xl font-bold border-2 border-gray-300 rounded-xl bg-white shadow-sm focus:border-[#6BCF7F] transition-all" 
                      />
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
                    disabled={verificationCode.length !== 6}
                    className="w-full h-12 bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] hover:from-[#5ABD6D] hover:to-[#4AAC5C] text-white text-base font-semibold rounded-xl group disabled:opacity-50"
                  >
                    확인
                  </Button>
                </motion.div>
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
                  animate={{
                    scale: focusedField === "password" ? 1.02 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative mb-6">
                    <motion.div
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
                      placeholder="8자 이상"
                      className="w-full h-14 pl-12 pr-12 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#6BCF7F] focus:bg-white transition-all duration-300"
                      autoFocus
                    />
                    {password && (
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
                    className="w-full h-12 bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] hover:from-[#5ABD6D] hover:to-[#4AAC5C] text-white text-base font-semibold rounded-xl group"
                  >
                    다음
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {step === "name" && (
              <motion.div
                key="name-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">이름</h3>
                <motion.div
                  animate={{
                    scale: focusedField === "name" ? 1.02 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                      <motion.div
                        animate={{
                          color: focusedField === "name" ? "#6BCF7F" : "#9CA3AF",
                        }}
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
                        {isCheckingName ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          "중복 체크"
                        )}
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
                    className="w-full h-12 bg-gradient-to-r from-[#6BCF7F] to-[#5ABD6D] hover:from-[#5ABD6D] hover:to-[#4AAC5C] text-white text-base font-semibold rounded-xl group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    완료
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