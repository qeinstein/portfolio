import { BlogSection } from "@/components/blog-section";
import { ResearchTopics } from "@/components/research-topics";
import { academicProfile } from "@/lib/academic-profile";
import { portfolio } from "@/lib/portfolio-data";
import { usePageMetadata } from "@/lib/seo";

function SocialLinks() {
  return (
    <nav className="social-links" aria-label="Social profiles">
      <a href={`mailto:${portfolio.meta.email}`} aria-label="Email Toheeb">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <rect x="2.5" y="4.5" width="19" height="15" rx="1.5" />
          <path d="m3.5 6 8.5 7 8.5-7" />
        </svg>
      </a>
      <a href={portfolio.meta.github} target="_blank" rel="noreferrer" aria-label="GitHub">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.75-1.31-3.75-1.31-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.72 1.15 1.72 1.15 1 1.72 2.62 1.22 3.26.93.1-.72.39-1.22.71-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.06 1.15a10.65 10.65 0 0 1 5.58 0c2.13-1.45 3.07-1.15 3.07-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3.01 0 4.29-2.61 5.23-5.1 5.5.4.35.76 1.02.76 2.06v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
        </svg>
      </a>
      <a
        href={portfolio.meta.scholar}
        target="_blank"
        rel="noreferrer"
        aria-label="Google Scholar"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3 1.5 9.1 12 15l8.1-4.55V16h1.8V9.1L12 3Zm-6.5 9.75v3.4c0 2.15 2.9 3.9 6.5 3.9s6.5-1.75 6.5-3.9v-3.4L12 16.4l-6.5-3.65Z" />
        </svg>
      </a>
      <a href={portfolio.meta.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
        </svg>
      </a>
      <a href={portfolio.meta.x} target="_blank" rel="noreferrer" aria-label="X">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.9 2h3.3l-7.2 8.24L23.5 22h-6.64l-5.2-7.04L5.5 22H2.2l7.7-8.81L1.5 2h6.8l4.7 6.42L18.9 2Zm-1.16 18h1.83L7.33 3.9H5.36L17.74 20Z" />
        </svg>
      </a>
    </nav>
  );
}

export function HomePage() {
  usePageMetadata({
    title: `${portfolio.meta.name} | Quantum Computing & AI Research`,
    description:
      "Toheeb Ogunade is a computer science undergraduate at the University of Lagos researching quantum computing and machine learning.",
    pathname: "/"
  });

  return (
    <main id="main-content" className="page-content">
      <section className="intro-section" aria-labelledby="page-title">
        <div className="profile-heading">
          <figure className="portrait">
            <img
              src="/toheeb-ogunade.png"
              alt={portfolio.meta.name}
              width={960}
              height={1280}
              loading="eager"
              decoding="async"
            />
          </figure>
          <div className="identity">
            <h1 id="page-title">{portfolio.meta.name}</h1>
            <p className="role-line">
              Founder and CEO @ <a href="https://noxquantum.com" target="_blank" rel="noreferrer">NoxQuantum</a>
            </p>
            <p className="tagline">{portfolio.meta.titles}.</p>
            <SocialLinks />
          </div>
        </div>

        <section id="biography" className="bio-copy" aria-label="Biography">
          <p>
            Motivated by my personal experiences as an African, I conduct
            research at the intersection of artificial intelligence (AI),
            quantum machine learning (QML), and quantum algorithms. My mission
            is to take fundamental principles from quantum computing and apply
            them to artificial intelligence, to develop quantum algorithms that
            will change the world, and to do research in quantum machine
            learning. My end goal is to make Africa part of the quantum era,
            since we missed out on the AI era.
          </p>
          <p>
            I’m a B.S. Computer Sciences student at the <a href="https://unilag.edu.ng/" target="_blank" rel="noreferrer">University of Lagos</a>{" "}
            and an early career researcher. My recent work tested amplitude,
            angle, and basis encodings as feature maps for classical machine
            learning. Across ten datasets, I compared them with matched
            classical methods and examined predictive performance alongside
            effective rank, condition number, and kernel alignment. This let me
            connect performance to the geometry imposed by each representation,
            and explain why a fixed encoding can fail to help.
          </p>
          <p>
            I’m deeply excited about revolutionising the quantum age in Africa.
            When I’m not coding or reading, I love football and solving
            mathematical problems—a hobby that earned me a spot at the state
            math olympiad. I also enjoy driving, nature meditation, and poetry.
          </p>
          <p>
            I’m aiming high: someday, I want to win a Nobel Prize, a Turing
            Award, or both—for work that helps Africa take its place in the
            quantum era.
          </p>
        </section>
      </section>


      <section id="education" className="content-section education-section" aria-labelledby="education-title">
        <h2 id="education-title">Education</h2>
        <article className="education-entry">
          <img className="university-logo" src={academicProfile.education.logo} alt="University of Lagos crest" width={42} height={42} loading="lazy" />
          <div className="education-detail">
            <h3><a href={academicProfile.education.url} target="_blank" rel="noreferrer">{academicProfile.education.institution}</a></h3>
            <p>{academicProfile.education.degree}</p>
          </div>
          <div className="education-meta">
            <p>{academicProfile.education.location}</p>
            <p className="entry-date">{academicProfile.education.period}</p>
          </div>
        </article>
      </section>

      <section id="research" className="content-section" aria-labelledby="research-title">
        <h2 id="research-title">Research</h2>
        <ResearchTopics />
      </section>

      <section id="publications" className="content-section publications-section" aria-labelledby="publications-title">
        <div className="section-heading">
          <h2 id="publications-title">Publications</h2>
          <a href={portfolio.meta.scholar} target="_blank" rel="noreferrer">Google Scholar ↗</a>
        </div>
        <div className="publication-list">
          {portfolio.publications.map((publication) => {
            const paper = publication.journal.startsWith("arXiv");
            const preview = "preview" in publication ? publication.preview : undefined;
            const pdf = "pdfLink" in publication ? publication.pdfLink : undefined;
            return (
              <article className={`publication ${paper ? "paper" : "essay"}`} key={publication.link}>
                {preview && <a className={`paper-preview ${paper ? "" : "medium-preview"}`} href={pdf || publication.link} target="_blank" rel="noreferrer" aria-label={`Read ${paper ? "PDF" : "essay"}: ${publication.title}`}>
                  <img
                    src={preview}
                    alt={paper ? `First page of ${publication.title}` : `Medium preview for ${publication.title}`}
                    width={paper ? 557 : 308}
                    height={paper ? 720 : 87}
                    loading="lazy"
                  />
                </a>}
                {!paper && !preview && <div className="essay-marker" aria-hidden="true"><span>Ideas &amp;<br />experiments</span><span>↗</span></div>}
                <div className="publication-detail">
                  <p className="publication-kind">{paper ? "Preprint" : "Medium · Essay"} <span> / </span> {publication.date}</p>
                  <h3><a href={publication.link} target="_blank" rel="noreferrer">{publication.title}</a></h3>
                  <p className="publication-authors">{publication.authors}</p>
                  <p className="publication-summary">{publication.summary}</p>
                  <div className="publication-links">
                    <a href={publication.link} target="_blank" rel="noreferrer">{paper ? "arXiv ↗" : "Read essay ↗"}</a>
                    {pdf && <a href={pdf} target="_blank" rel="noreferrer">PDF ↗</a>}
                    {"codeLink" in publication && publication.codeLink && <a href={publication.codeLink} target="_blank" rel="noreferrer">Code ↗</a>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <BlogSection />
    </main>
  );
}

export default HomePage;
