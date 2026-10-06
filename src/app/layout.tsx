import type { Metadata } from "next";
import "./globals.css";
import "./admin.css";
import "./portrait.css";
import "./waypoint.css";
import "./reactive.css";
import "./interactions.css";
export const metadata: Metadata = { title: "Raveena Sharma — Cybersecurity Engineer // Candidate Node", description: "Raveena Sharma — cybersecurity engineering student, CTF competitor, and builder of secure software systems. Explore her security research, projects, skills, experience, and contact details.", metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"), openGraph: { title: "Raveena Sharma — Cybersecurity Engineer // Candidate Node", description: "Security-first builder of secure software systems.", type: "website" }, twitter: { card: "summary_large_image", title: "Raveena Sharma — Cybersecurity Engineer // Candidate Node" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800;900&family=Rajdhani:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/></head><body>{children}</body></html>; }
