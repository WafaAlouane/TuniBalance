// src/components/AuthModal.jsx
import React, { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"
import axios from "axios"
import { useDispatch } from "react-redux"
import { loginSuccess } from "../../../redux/slices/authSlice"
import { verify2FA } from "../../../services/authService"
import { register } from "../../../services/authService"

export default function AuthModal({ isOpen, onClose, authType, setAuthType }) {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // Common
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  // Signup
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  // Login / 2FA
  const [recaptchaToken, setRecaptchaToken] = useState("")
  const [showTwoFactorInput, setShowTwoFactorInput] = useState(false)
  const [qrCodeImage, setQrCodeImage] = useState(null)
  const [twoFactorToken, setTwoFactorToken] = useState("")

  // Forgot Password
  const [resetEmail, setResetEmail] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)

  // Reset Password
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [resetError, setResetError] = useState("")
  const [resetMessage, setResetMessage] = useState("")

  // detect token in URL
  const params = new URLSearchParams(location.search)
  const resetToken = params.get("token")

  useEffect(() => {
    if (resetToken) {
      setAuthType("resetPassword")
      setEmail("")
      setPassword("")
    }
  }, [resetToken])

  const handleRecaptchaChange = (val) => setRecaptchaToken(val)

  const handleLogin = async () => {
    if (!recaptchaToken) {
      setError("Veuillez compléter le reCAPTCHA !")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await axios.post("http://localhost:3001/auth/login", {
        email, password, recaptchaToken,
      })
      dispatch(loginSuccess({ user: res.data.user, token: res.data.accessToken }))
      localStorage.setItem("accessToken", res.data.accessToken)

      const qr = await axios.post(
        "http://localhost:3001/auth/2fa-setup",
        {},
        { headers: { Authorization: `Bearer ${res.data.accessToken}` } }
      )
      setQrCodeImage(qr.data.qrCodeImage)
      setShowTwoFactorInput(true)
    } catch {
      setError("Identifiants incorrects !")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async () => {
    let phoneNumber = phone.startsWith("+216") ? phone : "+216" + phone
    if (!/^\+216[0-9]{8}$/.test(phoneNumber)) {
      setError("Numéro invalide (+216 + 8 chiffres).")
      return
    }
    setLoading(true)
    setError("")
    try {
      const { user } = await register({ name, email, password, phoneNumber })
      localStorage.setItem("tempUser", JSON.stringify(user))
      setAuthType("login")
    } catch (err) {
      setError(err.message.includes("409") ? "Email déjà utilisé" : err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify2FA = async () => {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("accessToken")
      const res = await verify2FA(token, twoFactorToken)
      dispatch(loginSuccess({ user: res.data.user, token }))
      const role = res.data.user.role.toLowerCase()
      const pathMap = {
        admin: "/AdminDashboard",
        business_owner: "/BusinessOwner",
        accountant: "/comptable",
        financier: "/financier",
      }
      navigate(pathMap[role] || "/")
      onClose()
    } catch {
      setError("Échec de la vérification 2FA !")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    setLoading(true)
    setError("")
    try {
      await axios.post("http://localhost:3001/auth/forget-password", { email: resetEmail })
      setResetSuccess(true)
      setMessage("Lien envoyé ! Vérifiez votre boîte mail.")
    } catch {
      setError("Erreur d'envoi du lien.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setResetError("Les mots de passe ne correspondent pas.")
      return
    }
    setLoading(true)
    setResetError("")
    try {
      await axios.put("http://localhost:3001/auth/reset-password", {
        resetToken,
        newPassword,
      })
      setResetMessage("Mot de passe mis à jour. Vous pouvez vous connecter.")
    } catch (err) {
      const msg = err.response?.data?.message
      if (msg && typeof msg === "object") {
        // take first error in constraints
        const c = msg.constraints
        const first = c && Object.values(c)[0]
        setResetError(first || "Échec de la réinitialisation.")
      } else {
        setResetError(msg || "Échec de la réinitialisation.")
      }
    } finally {
      setLoading(false)
    }
  }
  

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}/>
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <button className="absolute top-4 right-4" onClick={onClose}>
            <X/>
          </button>

          <h2 className="text-center text-2xl font-bold mb-4">
            {{
              login: "Login",
              signup: "Sign Up",
              forgotPassword: "Reset Password",
              resetPassword: "Choose New Password",
            }[authType]}
          </h2>

          {error && <div className="text-red-500 mb-4">{error}</div>}
          {message && authType==="forgotPassword" && (
            <div className="text-green-600 mb-4">{message}</div>
          )}

          {authType === "login" && showTwoFactorInput ? (
            <>
              {qrCodeImage && <img src={qrCodeImage} alt="QR" className="mx-auto mb-4"/>}
              <input
                type="text"
                placeholder="2FA Code"
                value={twoFactorToken}
                onChange={e=>setTwoFactorToken(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />
              <button
                onClick={handleVerify2FA}
                disabled={loading}
                className="w-full py-2 bg-teal-600 text-white rounded"
              >
                {loading?"Verifying...":"Verify 2FA"}
              </button>
            </>
          ) : authType === "resetPassword" ? (
            <>
              {resetError && <div className="text-red-500 mb-2">{resetError}</div>}
              {resetMessage && <div className="text-green-600 mb-2">{resetMessage}</div>}
              <div className="mb-3">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e=>setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-3">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e=>setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                onClick={handleResetSubmit}
                disabled={loading}
                className="w-full py-2 bg-teal-600 text-white rounded"
              >
                {loading?"Updating...":"Update Password"}
              </button>
            </>
          ) : authType === "forgotPassword" ? (
            <>
              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={e=>setResetEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                onClick={handlePasswordReset}
                disabled={loading}
                className="w-full py-2 bg-teal-600 text-white rounded"
              >
                {loading?"Envoi...":"Send Reset Link"}
              </button>
              <p className="mt-4 text-center text-sm">
                <button
                  onClick={()=>{ setError(""); setMessage(""); setAuthType("login") }}
                  className="text-teal-600 underline"
                >
                  Back to Login
                </button>
              </p>
            </>
          ) : (
            <form onSubmit={async e=>{
              e.preventDefault()
              authType==="login"?await handleLogin():await handleSignup()
            }}>
              {authType==="signup" && (
                <>
                  <div className="mb-3">
                    <label>Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e=>setName(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-3">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e=>setPhone(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </>
              )}
              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              {authType==="login" && (
                <div className="text-right text-sm mb-3">
                  <button
                    type="button"
                    className="text-teal-600 underline"
                    onClick={()=>setAuthType("forgotPassword")}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              {authType==="login" && (
                <div className="mb-3">
                  <ReCAPTCHA
                    sitekey="6LcoRwErAAAAAIauP2SPQe1fvh5je4o4RwuvDy0V"
                    onChange={handleRecaptchaChange}
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-teal-600 text-white rounded"
              >
                {loading
                  ? authType==="login"? "Logging in…" : "Signing up…"
                  : authType==="login"? "Login" : "Sign Up"}
              </button>
            </form>
          )}

          {!showTwoFactorInput && !resetToken && authType!=="forgotPassword" && (
            <p className="mt-4 text-center text-sm">
              {authType==="login" ? "No account?" : "Have an account?"}{" "}
              <button
                onClick={()=>{ setError(""); setAuthType(authType==="login" ? "signup":"login") }}
                className="text-teal-600 underline"
              >
                {authType==="login"?"Sign Up":"Login"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
