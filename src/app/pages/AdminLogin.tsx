import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

const ADMIN_PASSWORD = "admin123";

export function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!password) { setError("Please enter your password"); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem("igci_admin", "true");
        navigate("/admin/dashboard");
      } else {
        setError("Invalid credentials. Access denied.");
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#003087] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="text-white font-bold text-xl">INTERPOL — IGCI</div>
          <div className="text-gray-400 text-sm">Admin Portal</div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
            <div className="w-10 h-10 bg-[#003087]/10 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#003087]" />
            </div>
            <div>
              <h2 className="text-[#0A1628]" style={{ fontWeight: 700, fontSize: "1.1rem" }}>Secure Access</h2>
              <p className="text-gray-500 text-xs">Authorised personnel only</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[#0A1628] text-sm font-semibold mb-1.5">
                Admin Password <span className="text-[#C41230]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087] transition-all"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <div className="flex items-center gap-1.5 mt-2 text-[#C41230] text-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </div>
              )}
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 bg-[#003087] text-white rounded-lg font-semibold text-sm hover:bg-[#002070] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Access Dashboard
                </>
              )}
            </button>
          </div>

          <div className="mt-5 text-center text-xs text-gray-400">
            Access restricted to authorised personnel only.
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          All access attempts are logged and monitored. Unauthorised access is a federal offense.
        </p>
      </div>
    </div>
  );
}