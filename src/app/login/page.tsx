import LoginForm from "@/components/LoginForm";
export const metadata = { title: "Secure Access | Raveena Sharma" };
export default function LoginPage(){ return <main className="auth-page"><div className="auth-grid"/><a className="brand auth-brand" href="/"><span className="brand-mark">◇</span><span>RS<span className="accent">.</span></span></a><LoginForm/><a href="/" className="auth-back">← RETURN TO PORTFOLIO</a></main> }
