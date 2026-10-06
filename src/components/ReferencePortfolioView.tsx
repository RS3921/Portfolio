"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { PortfolioData } from "@/lib/portfolio";
import NetworkCanvas from "@/components/NetworkCanvas";

const sections = [
  ["identity", "01 IDENTITY", "01 ID"],
  ["threat-model", "02 THREAT MODEL", "02 MODEL"],
  ["arsenal", "03 ARSENAL", "03 ARSENAL"],
  ["operations", "04 OPERATIONS", "04 OPS"],
  ["missions", "05 MISSIONS", "05 MISSIONS"],
  ["contact", "06 CONTACT", "06 CONTACT"],
] as const;

const skillAxes = ["OFFENSIVE", "DEFENSIVE", "DEV", "CLOUD", "RESEARCH"];
const projectSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const skillPoints = (groups: PortfolioData["skills"]) => skillAxes.map((_, i) => {
  const group = groups[i % Math.max(1, groups.length)];
  const score = .38 + Math.min((group?.items.length ?? 3) / 20, .44);
  const angle = -Math.PI / 2 + i * Math.PI * 2 / skillAxes.length;
  return [200 + Math.cos(angle) * 150 * score, 200 + Math.sin(angle) * 150 * score];
});

export default function ReferencePortfolioView({ data }: { data: PortfolioData }) {
  const root = useRef<HTMLDivElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [active, setActive] = useState("identity");
  const [progress, setProgress] = useState(0);
  const [cursor, setCursor] = useState({ x: -50, y: -50, active: false });
  const polygon = useMemo(() => skillPoints(data.skills).map(([x, y]) => `${x},${y}`).join(" "), [data.skills]);
  const resume = data.profile.resume || "/resume.pdf";

  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && data.settings.heroRoles.length > 1) {
      const timer = window.setInterval(() => setRoleIndex(i => (i + 1) % data.settings.heroRoles.length), 2800);
      return () => window.clearInterval(timer);
    }
  }, [data.settings.heroRoles.length]);

  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("in"); revealObserver.unobserve(entry.target); }
    }), { threshold: .12 });
    host.querySelectorAll(".reveal").forEach(item => revealObserver.observe(item));
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
        if (entry.target.id === "operations") entry.target.querySelector(".timeline")?.classList.add("timeline-active");
      }
    }), { threshold: .28, rootMargin: "-10% 0px -48% 0px" });
    sections.forEach(([id]) => { const element = host.querySelector(`#${id}`); if (element) sectionObserver.observe(element); });
    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0);
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => { revealObserver.disconnect(); sectionObserver.disconnect(); window.removeEventListener("scroll", updateScroll); };
  }, [data]);

  function panelMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 100;
    const y = ((event.clientY - box.top) / box.height) * 100;
    event.currentTarget.style.setProperty("--mx", `${x}%`);
    event.currentTarget.style.setProperty("--my", `${y}%`);
    event.currentTarget.style.transform = `perspective(700px) rotateX(${(50-y)*.04}deg) rotateY(${(x-50)*.04}deg)`;
  }
  function panelReset(event: PointerEvent<HTMLElement>) { event.currentTarget.style.transform = ""; }

  const cgpa = data.education[0]?.score?.match(/[0-9]+(?:\.[0-9]+)?/)?.[0] ?? "—";
  const graduation = data.education[0]?.dates?.match(/20\d{2}/g)?.at(-1) ?? "—";
  const rank = data.competitions[0]?.result ?? "—";
  const axes = skillPoints(data.skills);

  return <div className="portfolio-reference" ref={root} onPointerMove={event => {
    if (event.pointerType === "mouse") setCursor(previous => ({ ...previous, x: event.clientX, y: event.clientY }));
  }} onPointerOver={event => {
    if (event.pointerType === "mouse" && (event.target as HTMLElement).closest("a,button,input,textarea,.panel,.chip")) setCursor(previous => ({ ...previous, active: true }));
  }} onPointerOut={event => {
    if (event.pointerType === "mouse" && (event.target as HTMLElement).closest("a,button,input,textarea,.panel,.chip") && !(event.relatedTarget as HTMLElement | null)?.closest("a,button,input,textarea,.panel,.chip")) setCursor(previous => ({ ...previous, active: false }));
  }}>
    <NetworkCanvas />
    <div className="bg-fade" aria-hidden="true" />
    <div className="progress-bar" style={{ width: `${progress}%` }} aria-hidden="true" />
    <div className={`cursor-ring${cursor.active ? " active" : ""}`} style={{ left: cursor.x, top: cursor.y }} aria-hidden="true" />
    <div className="cursor-dot" style={{ left: cursor.x, top: cursor.y }} aria-hidden="true" />
    <nav className="side-nav" aria-label="Portfolio sections"><div className="nav-track"><div className="nav-fill" style={{ height: `${progress}%` }} /></div>{sections.map(([id, title]) => <a key={id} href={`#${id}`} data-sec={id} className={active === id ? "active" : ""}><span className="dot" />{title}</a>)}</nav>
    <nav className="mobile-nav" aria-label="Portfolio sections">{sections.map(([id, , short]) => <a key={id} href={`#${id}`} data-sec={id} className={active === id ? "active" : ""}>{short}</a>)}</nav>

    <header className="hero" id="identity"><div className="hero-grid"><div>
      <div className="hero-tag"><span className="pulse-dot" />SECURITY OPERATIONS CENTER // CANDIDATE NODE ACTIVE</div>
      <h1 className="hero-name">{data.profile.name.split(" ")[0]}<br/><span className="glitch" data-text={data.profile.name.split(" ").slice(1).join(" ")}>{data.profile.name.split(" ").slice(1).join(" ")}</span></h1>
      <div className="hero-role">&gt; <span>{data.settings.heroRoles[roleIndex] || data.profile.title}</span><span className="cursor" /></div>
      <p className="hero-desc">{data.profile.shortBio} {data.about.introduction} {data.education[0]?.degree}, {data.education[0]?.institution}.</p>
      <div className="hero-actions"><a className="btn primary" href={data.profile.github} target="_blank" rel="noreferrer">VIEW GITHUB →</a><a className="btn" href={data.profile.linkedin} target="_blank" rel="noreferrer">VIEW LINKEDIN →</a><a className="btn" href={resume} target="_blank" rel="noreferrer">DOWNLOAD RESUME ↓</a><a className="btn danger" href="#contact">CONTACT LINKS →</a></div>
      <div className="stat-row"><div className="stat"><div className="num">{cgpa}</div><div className="lbl">CGPA · CURRENT</div></div><div className="stat"><div className="num">{rank}</div><div className="lbl">CTF RANK / FIELD</div></div><div className="stat"><div className="num">{graduation}</div><div className="lbl">EXPECTED GRADUATION</div></div></div>
    </div><div className="hero-radar-wrap" aria-label="Animated security radar visualization"><div className="radar"><div className="radar-rings"/><div className="radar-sweep"/><div className="radar-core"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M12 2 L20 5 V11 C20 16 16.5 19.5 12 21 C7.5 19.5 4 16 4 11 V5 Z"/><path d="M9 12 L11 14 L15 9"/></svg></div>{["DLP","SCS","CTF","SOC"].map((label, i) => <div key={label} className="blip" style={{ "--bx": ["16%","78%","68%","22%"][i], "--by": ["28%","20%","80%","74%"][i], "--bd": `${i*.6}s` } as CSSProperties} data-label={label}/>)}</div></div></div></header>

    <main>
      <section className="section" id="threat-model"><div className="eyebrow">02 // THREAT MODEL</div><h2 className="title">How I approach a system</h2><div className="about-grid"><div className="about-copy reveal"><p>{data.about.introduction}</p><p>{data.profile.longBio}</p><p><strong>{data.about.goals}</strong></p></div><div className="panel surface-card reveal" onPointerMove={panelMove} onPointerLeave={panelReset}><div className="spot"/><div className="target-line">ATTACK SURFACE ANALYSIS // PROFILE</div><div className="target-name">{data.profile.name}</div><div className="row-title hardened">CORE STRENGTHS</div><ul>{data.achievements.slice(0, 3).map(item => <li key={item.title}>{item.title} — {item.detail}</li>)}</ul><div className="row-title open">CURRENT FOCUS</div><ul>{data.about.interests.slice(0, 3).map(item => <li key={item}>{item}</li>)}</ul><div className="objective-box"><span className="lbl">NEXT OBJECTIVE</span>{data.about.goals}</div></div></div></section>

      <section className="section" id="arsenal"><div className="eyebrow">03 // DIGITAL ARSENAL</div><h2 className="title">Tools I reach for</h2><div className="arsenal-top"><div className="skill-chart reveal" id="skillChart"><svg viewBox="0 0 400 400" role="img" aria-label="Interactive map of skill areas"><circle className="chart-ring" cx="200" cy="200" r="150"/><circle className="chart-ring" cx="200" cy="200" r="100"/><circle className="chart-ring" cx="200" cy="200" r="50"/>{axes.map(([x,y],i)=><line key={i} className="chart-axis" x1="200" y1="200" x2={200+(x-200)*1.25} y2={200+(y-200)*1.25}/>)}<polygon className="chart-poly" points={polygon}/>{skillAxes.map((label,i)=><text key={label} className="chart-label" x={200+Math.cos(-Math.PI/2+i*Math.PI*2/5)*177} y={200+Math.sin(-Math.PI/2+i*Math.PI*2/5)*177} textAnchor="middle">{label}</text>)}</svg></div><div className="arsenal-grid">{data.skills.map((group,i)=><div className="panel arsenal-card reveal" key={group.category} onPointerMove={panelMove} onPointerLeave={panelReset}><div className="spot"/><h3>{group.category.toUpperCase()}</h3><div className="chip-row">{group.items.map(skill=><span className="chip" key={skill}>{skill}</span>)}</div></div>)}</div></div><div className="cert-strip reveal"><div className="row-title">VERIFIED CREDENTIALS</div><div className="cert-list">{data.certifications.map(cert=><span className="cert-pill" key={cert.name}>{cert.name} · {cert.issuer}{cert.status ? ` · ${cert.status}` : ""}</span>)}</div></div></section>

      <section className="section" id="operations"><div className="eyebrow">04 // LIVE OPERATIONS</div><h2 className="title">Where I’ve been deployed</h2><div className="ops-grid"><div className="reveal"><div className="timeline" id="timelineWrap"><div className="timeline-fill"/><div className="timeline-items">{data.experience.map((item,i)=><article className={`tl-item${i===0 ? " current" : ""}`} key={`${item.company}-${item.role}`}><div className="tl-date">{item.dates}</div><div className="tl-role">{item.role}</div><div className="tl-org">{item.company}</div><ul className="timeline-points">{item.description.map(line=><li key={line}>{line}</li>)}</ul></article>)}</div></div>{data.education.slice(0,1).map(item=><div className="education-panel panel" key={item.degree}><div className="spot"/><span>EDUCATION / {item.dates}</span><b>{item.degree}</b><small>{item.institution} · {item.score}</small></div>)}</div><div className="panel log-panel reveal" onPointerMove={panelMove} onPointerLeave={panelReset}><div className="spot"/><div className="log-heading">ENGAGEMENT LOG // CTFs &amp; HACKATHONS</div>{data.competitions.map((item,i)=><div className="log-row" key={`${item.event}-${i}`}><span>{item.event}</span><span className="log-rank">{item.result}</span></div>)}{data.leadership.map(item=><div className="log-row" key={`${item.organization}-${item.role}`}><span>{item.role} · {item.organization}</span><span className="log-rank neutral">{item.dates}</span></div>)}</div></div></section>

      <section className="section" id="missions"><div className="eyebrow">05 // MISSION ARCHIVE</div><h2 className="title">Things I’ve actually built</h2><div className="mission-list">{data.projects.map((project,i)=><article className="panel mission reveal" key={project.title} onPointerMove={panelMove} onPointerLeave={panelReset}><div className="spot"/><div className="mid">CASE FILE<span className="num">{String(i+1).padStart(2,"0")}</span></div><div><h3>{project.title}</h3><p>{project.subtitle}. {project.description}</p><div className="tags">{project.technologies.map(tech=><span key={tech}>{tech}</span>)}</div><a className="repo-link" href={`/projects/${projectSlug(project.title)}`}>→ OPEN PROJECT BRIEF</a>{project.github && <a className="repo-link" href={project.github} target="_blank" rel="noreferrer">→ SOURCE REPOSITORY</a>}{project.live && <a className="repo-link" href={project.live} target="_blank" rel="noreferrer">→ LIVE PROJECT</a>}</div></article>)}</div></section>

      <section className="section" id="contact"><div className="eyebrow">06 // DIRECT CHANNELS</div><h2 className="title">Find me online</h2><div className="contact-direct reveal"><h3>CONTACT &amp; PROFILES</h3><div className="contact-line"><span className="k">EMAIL</span><a className="v" href={`mailto:${data.profile.email}`}>{data.profile.email}</a></div><div className="contact-line"><span className="k">LINKEDIN</span><a className="v" href={data.profile.linkedin} target="_blank" rel="noreferrer">{data.profile.linkedin.replace(/^https?:\/\//, "")}</a></div><div className="contact-line"><span className="k">GITHUB</span><a className="v" href={data.profile.github} target="_blank" rel="noreferrer">{data.profile.github.replace(/^https?:\/\//, "")}</a></div><div className="contact-line"><span className="k">PHONE</span><a className="v" href={`tel:${data.profile.phone.replace(/[^+\d]/g, "")}`}>{data.profile.phone}</a></div><div className="contact-line"><span className="k">LOCATION</span><span className="v">{data.profile.location}</span></div><div className="status-badge">STATUS: OPEN TO — Cybersecurity engineering, SOC / Blue Team, and security research collaborations.</div></div></section>
    </main>
    <footer><span>{data.profile.name.toUpperCase().replace(/\s/g,"_")} // CANDIDATE_NODE // BUILD 2026</span><span>blue = structure. red = signal.</span></footer>
  </div>;
}
