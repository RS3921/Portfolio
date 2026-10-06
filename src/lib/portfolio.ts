export type PortfolioData = {
  profile: { name: string; title: string; location: string; email: string; phone: string; linkedin: string; github: string; tryhackme: string; shortBio: string; longBio: string; resume: string; portrait: string };
  about: { introduction: string; goals: string; interests: string[] };
  skills: { category: string; items: string[] }[];
  projects: { title: string; subtitle: string; description: string; category: string; year: string; status: string; technologies: string[]; github?: string; live?: string; featured: boolean }[];
  experience: { role: string; company: string; dates: string; description: string[] }[];
  education: { degree: string; institution: string; dates: string; score?: string; detail?: string }[];
  certifications: { name: string; issuer: string; status?: string }[];
  achievements: { title: string; detail: string; category: string }[];
  competitions: { event: string; result: string; detail: string; year: string }[];
  leadership: { role: string; organization: string; dates: string }[];
  settings: { heroRoles: string[]; heroStatement: string; accent: string; seoTitle: string; seoDescription: string };
};

export const initialPortfolio: PortfolioData = {
  profile: { name: "Raveena Sharma", title: "Computer Science Engineer | Cybersecurity & Software Development", location: "Pune, Maharashtra, India", email: "raveenasharma3921@gmail.com", phone: "+91 8888953921", linkedin: "https://linkedin.com/in/raveena-sharma-csit", github: "https://github.com/RS3921", tryhackme: "", shortBio: "Security-minded builder. Curious by design.", longBio: "Final-year B.Tech Computer Science (Cyber Security) student with a 9.0 CGPA, combining hands-on software development with applied cybersecurity across networks, web applications, cryptography and cloud. Built projects spanning distributed storage security, data loss prevention, ML-driven risk analytics and full-stack development. Led a six-project security research portfolio and ranked in the top 10% globally on TryHackMe.", resume: "/resume.pdf", portrait: "" },
  about: { introduction: "I work at the intersection of cybersecurity research and software engineering: understanding how systems fail, then designing them to be more resilient.", goals: "Building secure, explainable systems for high-sensitivity environments.", interests: ["Cybersecurity", "Software development", "AI / ML", "Cloud", "Security research"] },
  skills: [
    { category: "Security", items: ["VAPT", "Ethical Hacking", "Network Security", "Cryptography", "Digital Forensics", "DLP", "SIEM", "Risk Assessment", "GRC"] },
    { category: "Development", items: ["Python", "C", "C++", "JavaScript", "HTML / CSS", "REST APIs", "MongoDB", "Git / GitHub"] },
    { category: "Tools", items: ["Splunk", "Nessus", "Nmap", "Wireshark", "Burp Suite", "OWASP ZAP", "Metasploit", "Autopsy", "Kali Linux"] },
    { category: "Cloud & Standards", items: ["Google Cloud", "GDPR", "PCI-DSS", "HIPAA", "DPDP Act", "OWASP Top 10", "Zero Trust", "Secure SDLC"] }
  ],
  projects: [
    { title: "Sovereign AI Workbench", subtitle: "On-premise agentic AI · SIH 2026 / MRPL", description: "Designing an air-gapped, self-hosted AI workbench for confidential industrial data with zero external network calls. Open-weight models, local tools, planning and OCR/vision within a zero-trust architecture.", category: "AI SECURITY", year: "2026", status: "In progress", technologies: ["Open-weight LLMs", "OCR", "Zero Trust", "Air-gapped"] , featured: true },
    { title: "SAT-SA", subtitle: "Supervisory Analytics Tool · Major project", description: "An offline explainable analytics platform for case-management and process data across Critical Sector Entities. A hybrid rules and ML pipeline generates entity-level risk scores and prioritizes samples for expert review.", category: "RISK ANALYTICS", year: "2026", status: "In progress", technologies: ["Machine Learning", "Explainable AI", "Risk Scoring", "Offline-first"], github: "https://github.com/mav3r1ck26/SAT-SA", featured: true },
    { title: "UPI Fraud Risk Warning", subtitle: "Pre-transaction risk analysis", description: "A team project exploring explainable warnings before payment by analyzing payment messages, URLs, QR codes and transaction features. Research covers ML, GNN, NLP/BERT, evolving fraud patterns and class imbalance.", category: "APPLIED AI", year: "2026", status: "Designing", technologies: ["ML", "GNN", "NLP / BERT", "Explainability"], featured: true },
    { title: "Data Loss Prevention System", subtitle: "Enterprise endpoint security prototype", description: "An enterprise DLP prototype with a Windows endpoint agent, admin dashboard, per-device tokens and Active Directory-ready policy mapping. Monitors activity and flags unauthorized data movement.", category: "ENDPOINT SECURITY", year: "2025", status: "Prototype", technologies: ["Python", "Windows Agent", "Machine Learning", "RBAC"], github: "https://github.com/RS3921/DLP-Project", featured: true },
    { title: "Symbiotic Chunk Storage", subtitle: "Secure distributed storage", description: "Distributed storage combining AES-256-GCM encryption and Reed-Solomon erasure coding, with Merkle proofs, cross-chain anchoring, autonomous healing and crypto-shredding.", category: "CLOUD SECURITY", year: "2025", status: "Built", technologies: ["AES-256-GCM", "Reed-Solomon", "Merkle Proofs", "Crypto-shredding"], github: "https://github.com/RS3921/Symbiotic-Chunk-Storage", featured: true },
    { title: "Unified Operations Center", subtitle: "Employee management system", description: "Team-built MongoDB platform with role-based user management, calendar and event tracking modules, and performance analytics.", category: "FULL STACK", year: "2024", status: "Built", technologies: ["MongoDB", "Role-based access", "Analytics"], github: "https://github.com/RS3921/Employee-Managment-System", featured: false }
  ],
  experience: [
    { role: "Research & Development Lead", company: "OffSecDiary", dates: "Jan 2026 — Jul 2026", description: ["Led a six-project security research portfolio and directed a team of researchers.", "Personally drove one project end-to-end; reviewed technical findings and write-ups.", "Coordinated vulnerability analysis, research documentation and knowledge-sharing content."] },
    { role: "Web Developer", company: "BloggersCon Vision", dates: "Jun 2025 — Jul 2025", description: ["Developed and maintained public-facing pages and features using HTML, CSS and JavaScript."] },
    { role: "AI Intern", company: "Corizo", dates: "Oct 2024 — Dec 2024", description: ["Completed a structured AI/ML internship applying foundational concepts to anomaly and threat detection projects."] },
    { role: "Cloud Computing Intern", company: "Yhills", dates: "Jun 2024 — Jul 2024", description: ["Learned cloud fundamentals, deployment models and core cloud services."] }
  ],
  education: [
    { degree: "B.Tech, CS & IT (Cyber Security)", institution: "Symbiosis Skills and Professional University", dates: "2023 — 2027", score: "9.0 / 10 CGPA", detail: "Kiwale, Pune" },
    { degree: "Higher Secondary (HSC)", institution: "S.B. Patil College of Science and Commerce", dates: "2021 — 2023", detail: "Ravet, Pune" },
    { degree: "Secondary Education (CBSE)", institution: "Podar International School", dates: "2008 — 2021", detail: "Chinchwad, Pune" }
  ],
  certifications: [
    { name: "Cybersecurity Career Starter Certification", issuer: "CCSC" }, { name: "Introduction to Cloud Security", issuer: "Simplilearn" }, { name: "Google Cloud Study Jams 2025", issuer: "19 official skill badges · Gen AI Arcade" }, { name: "Cisco Ethical Hacker", issuer: "Cisco", status: "In progress" }, { name: "The Complete Ethical Hacking Course", issuer: "Udemy · Beginner to Advanced" }, { name: "Python Mega Course", issuer: "Udemy · Learn Python in 60 Days" }, { name: "Data Structures and Algorithms", issuer: "AllCSNotes" }, { name: "Jr Penetration Tester Path", issuer: "TryHackMe · PreSecurity and Cyber Security 101 completed" }
  ],
  achievements: [
    { title: "Top 10% globally", detail: "TryHackMe global rank", category: "RANK" }, { title: "9.0 / 10 CGPA", detail: "B.Tech CS & IT (Cyber Security)", category: "ACADEMIC" }, { title: "Six research projects", detail: "R&D Lead portfolio at OffSecDiary", category: "RESEARCH" }, { title: "AWS Student Builder Club", detail: "Cloud Security & Innovation Lead · SSPU Core Team", category: "LEADERSHIP" }, { title: "Smart India Hackathon", detail: "Internal Coordinator · 2025 and 2026", category: "COMMUNITY" }, { title: "0x0 PIR4T3S", detail: "Senior Management Head", category: "LEADERSHIP" }
  ],
  competitions: [
    { event: "X'PLOITATHON CTF 2026", result: "11 / 175", detail: "Round 1 · Qualified for Round 2", year: "2026" }, { event: "X'PLOITATHON CTF 2026", result: "22 / 50", detail: "Round 2", year: "2026" }, { event: "Bypass CTF", result: "Rank 20", detail: "Competition placement", year: "2026" }, { event: "MumbaiHacks", result: "Round 2", detail: "Qualified for Round 2", year: "2026" }
  ],
  leadership: [
    { role: "Cloud Security & Innovation Lead", organization: "AWS Student Builder Club · SSPU Core Team", dates: "2026 — 2027" }, { role: "Senior Management Head", organization: "0x0 PIR4T3S Club", dates: "Oct 2025 — Apr 2026" }, { role: "Internship Coordinator", organization: "First, third and final year", dates: "Multiple years" }, { role: "Smart India Hackathon Internal Coordinator", organization: "SSPU", dates: "2025, 2026" }, { role: "Class Representative · Volunteer · Session Anchor", organization: "SSPU · HICA team", dates: "Multiple years" }
  ],
  settings: { heroRoles: ["Cybersecurity Researcher", "Threat Hunter", "Security Engineer", "AI Security Enthusiast", "Full-Stack Developer"], heroStatement: "Breaking systems to understand them. Building systems to secure them.", accent: "#59f3dc", seoTitle: "Raveena Sharma | Cybersecurity Researcher", seoDescription: "Cybersecurity researcher and software developer specializing in security, AI, cloud, threat detection and secure systems." }
};
