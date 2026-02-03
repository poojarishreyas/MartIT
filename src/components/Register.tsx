import { AlertCircle } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { useState, useRef } from "react";
import {api} from "../lib/api";
import { useNavigate } from "react-router-dom";
// Email validator
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (email) => EMAIL_REGEX.test(email);

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    gender: "",
    dob: "",
    tel: "",
    email: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("register");
  const [consent, setConsent] = useState(false);

  // OTP
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // OTP change
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Register submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.name || !user.email || !user.tel) {
      setError("Please fill all required fields.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(user.tel)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!isValidEmail(user.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!consent) {
      setError("You must agree to the Terms and Privacy Policy.");
      return;
    }

    try {
    setLoading(true);
    setError(null);

    const res = await api.post("/auth/register", {
      name: user.name,
      email: user.email,
      phone: user.tel,
      gender: user.gender,
      dob: user.dob,
      consent,
    });

    // backend success
    if (res.data.success) {
      setStep("verifying");
    }
  } catch (err) {
    setError(
      err.response?.data?.message || "Registration failed"
    );
  } finally {
    setLoading(false);
  }
  };

  // OTP validate
const validateOtp = async (e) => {
  e.preventDefault();

  if (otp.some(d => d === "")) {
    setError("Please enter complete OTP.");
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const res = await api.post("/auth/verify-otp", {
      phone: user.tel,
      otp: otp.join(""),
    });

    if (res.data.success) {
      alert("Account verified successfully");
      navigate("/home");
      // redirect / login / dashboard
    }
  } catch (err) {
    setError(
      err.response?.data?.message || "Invalid OTP"
    );
  } finally {
    setLoading(false);
  }
};


  const handleEditNumber = () => {
    setOtp(["", "", "", ""]);     // clear OTP
    setError(null);               // clear errors
    setStep("register");          // go back
  };
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background video */}
      <video
        src="/background1.webm"
        autoPlay
        muted
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover"
      />

      {/* Glass Card */}
      <div className="absolute z-10 w-[90%] md:w-[50%] lg:w-[30%] left-[62%] top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white/70 backdrop-blur-xl shadow-2xl px-8 py-10 border border-white/40">
        {/* Logo */}
        <div className="flex justify-center">
          <img src="/logo.png" alt="Mart-IT Logo" className="w-14 h-14" />
        </div>

        {step === "register" && (
          <>
            <h2 className="text-center text-xl font-semibold mt-4">
              Create your Account
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
              {error && (
                <div
                  role="alert"
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center"
                >
                  <AlertCircle className="mr-2" size={20} />
                  <span>{error}</span>
                </div>
              )}

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={user.name}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-gray-100 px-4 py-3 text-lg focus:ring-2 focus:ring-blue-400"
              />

              <select
                name="gender"
                value={user.gender}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-gray-100 px-4 py-3 text-lg"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <input
                type="date"
                name="dob"
                value={user.dob}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-gray-100 px-4 py-3 text-lg"
              />

              <div className="flex">
                <span className="px-4 py-3 bg-gray-200 rounded-l-xl text-lg">
                  +91
                </span>
                <input
                  type="tel"
                  name="tel"
                  maxLength={10}
                  placeholder="Phone Number"
                  value={user.tel}
                  onChange={handleInputChange}
                  className="w-full rounded-r-xl bg-gray-100 px-4 py-3 text-lg"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={user.email}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-gray-100 px-4 py-3 text-lg"
              />

              <div className="flex items-start gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  I agree to the{" "}
                  <a href="/terms" className="text-blue-600 underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-blue-600 underline">
                    Privacy Policy
                  </a>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || !consent}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          </>
        )}

        {step === "verifying" && (
          <div className="text-center">
            <h2 className="mt-2 text-gray-600 font-bold text-xl">
              Verify your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              OTP sent to{" "}
              <span className="font-semibold">
                +91 ******{user.tel.slice(-4)}
              </span>
            </p>

            <button
              type="button"
              onClick={handleEditNumber}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Edit phone number
            </button>


            {error && (
              <p className="mt-3 text-red-600 text-sm">{error}</p>
            )}

            <div className="mt-6 flex justify-center gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  inputMode="numeric"
                  aria-label={`OTP digit ${index + 1}`}
                  onChange={(e) =>
                    handleOtpChange(index, e.target.value)
                  }
                  onKeyDown={(e) =>
                    handleOtpKeyDown(index, e)
                  }
                  className="w-12 h-12 text-center text-xl font-bold border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            <button
              onClick={validateOtp}
              className="w-full mt-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
