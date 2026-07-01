import { useState, useEffect, useRef } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080c10;
    --surface: #0d1117;
    --surface2: #161b22;
    --border: #21262d;
    --accent: #39d353;
    --accent2: #58a6ff;
    --accent3: #f78166;
    --text: #e6edf3;
    --muted: #7d8590;
    --mono: 'JetBrains Mono', monospace;
    --display: 'Syne', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--mono); }

  .app {
    min-height: 100vh;
    background: var(--bg);
    background-image: 
      radial-gradient(ellipse at 20% 0%, rgba(57,211,83,0.06) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 100%, rgba(88,166,255,0.06) 0%, transparent 50%);
    padding: 2rem 1rem 4rem;
  }

  /* HEADER */
  .header {
    text-align: center;
    margin-bottom: 3rem;
  }
  .header-eyebrow {
    font-family: var(--mono);
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 0.75rem;
    opacity: 0.8;
  }
  .header-eyebrow::before { content: '// '; opacity: 0.5; }
  .header h1 {
    font-family: var(--display);
    font-size: clamp(2rem, 6vw, 3.5rem);
    font-weight: 800;
    line-height: 1;
    color: var(--text);
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
  }
  .header h1 span { color: var(--accent); }
  .header-sub {
    font-size: 0.8rem;
    color: var(--muted);
    letter-spacing: 0.05em;
  }

  /* SEARCH */
  .search-wrap {
    max-width: 560px;
    margin: 0 auto 2.5rem;
    position: relative;
  }
  .search-box {
    display: flex;
    align-items: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0 1rem;
    transition: border-color 0.2s;
    overflow: hidden;
  }
  .search-box:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(57,211,83,0.1);
  }
  .search-prefix {
    color: var(--accent);
    font-size: 0.85rem;
    white-space: nowrap;
    margin-right: 0.5rem;
    opacity: 0.7;
    user-select: none;
  }
  .search-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text);
    font-family: var(--mono);
    font-size: 0.95rem;
    padding: 0.9rem 0;
    caret-color: var(--accent);
  }
  .search-input::placeholder { color: var(--muted); opacity: 0.6; }
  .search-btn {
    background: var(--accent);
    color: var(--bg);
    border: none;
    border-radius: 5px;
    padding: 0.45rem 1rem;
    font-family: var(--mono);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    white-space: nowrap;
    margin-left: 0.5rem;
  }
  .search-btn:hover { opacity: 0.85; }
  .search-btn:active { transform: scale(0.96); }
  .search-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* STATES */
  .state-box {
    max-width: 560px;
    margin: 0 auto;
    text-align: center;
    padding: 3rem 2rem;
  }
  .loading-ring {
    width: 40px; height: 40px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin: 0 auto 1rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { color: var(--muted); font-size: 0.8rem; letter-spacing: 0.1em; }
  .loading-text::after {
    content: '';
    animation: dots 1.2s steps(4, end) infinite;
  }
  @keyframes dots {
    0%   { content: ''; }
    25%  { content: '.'; }
    50%  { content: '..'; }
    75%  { content: '...'; }
    100% { content: ''; }
  }

  .error-box {
    background: rgba(247,129,102,0.07);
    border: 1px solid rgba(247,129,102,0.25);
    border-radius: 8px;
    padding: 1.5rem;
  }
  .error-code { color: var(--accent3); font-size: 0.7rem; letter-spacing: 0.15em; margin-bottom: 0.5rem; }
  .error-msg { color: var(--text); font-size: 0.9rem; }
  .error-hint { color: var(--muted); font-size: 0.75rem; margin-top: 0.5rem; }

  .empty-state { color: var(--muted); font-size: 0.82rem; line-height: 2; }
  .empty-state .big { font-size: 2rem; display: block; margin-bottom: 0.5rem; opacity: 0.3; }

  /* PROFILE CARD */
  .profile-grid {
    max-width: 900px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 1.5rem;
    animation: fadeUp 0.4s ease both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 700px) {
    .profile-grid { grid-template-columns: 1fr; }
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }

  /* LEFT CARD */
  .profile-card {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .avatar-wrap {
    position: relative;
    width: 90px; height: 90px;
  }
  .avatar {
    width: 90px; height: 90px;
    border-radius: 50%;
    border: 2px solid var(--border);
    display: block;
  }
  .avatar-ring {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid transparent;
    background: linear-gradient(135deg, var(--accent), var(--accent2)) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    animation: rotate 4s linear infinite;
  }
  @keyframes rotate { to { transform: rotate(360deg); } }

  .profile-name {
    font-family: var(--display);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1.2;
  }
  .profile-login {
    color: var(--accent2);
    font-size: 0.8rem;
    margin-top: 0.2rem;
  }
  .profile-login::before { content: '@'; opacity: 0.6; }

  .profile-bio {
    font-size: 0.78rem;
    color: var(--muted);
    line-height: 1.7;
    border-left: 2px solid var(--border);
    padding-left: 0.75rem;
  }

  .stats-row {
    display: flex;
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }
  .stat {
    flex: 1;
    padding: 0.7rem 0.5rem;
    text-align: center;
    border-right: 1px solid var(--border);
  }
  .stat:last-child { border-right: none; }
  .stat-val {
    font-family: var(--display);
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--text);
    display: block;
  }
  .stat-lbl {
    font-size: 0.6rem;
    color: var(--muted);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-top: 2px;
    display: block;
  }

  .profile-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .meta-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--muted);
  }
  .meta-icon { font-size: 0.85rem; width: 16px; text-align: center; flex-shrink: 0; }
  .meta-val { color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .meta-val a { color: var(--accent2); text-decoration: none; }
  .meta-val a:hover { text-decoration: underline; }

  .gh-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 7px;
    padding: 0.6rem;
    font-size: 0.75rem;
    color: var(--muted);
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s;
    font-family: var(--mono);
  }
  .gh-link:hover { border-color: var(--accent2); color: var(--accent2); }

  /* RIGHT SIDE */
  .right-col { display: flex; flex-direction: column; gap: 1.5rem; }

  /* ACTIVITY BAR */
  .contrib-card { padding: 1.25rem 1.5rem; }
  .section-label {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.75rem;
  }
  .section-label span { color: var(--accent); }
  .contrib-bars {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 40px;
  }
  .contrib-bar {
    flex: 1;
    background: var(--accent);
    border-radius: 2px 2px 0 0;
    opacity: 0.15;
    animation: barGrow 0.6s ease both;
    min-height: 3px;
  }
  .contrib-bar.active { opacity: 0.7; }
  .contrib-bar.accent2 { background: var(--accent2); opacity: 0.5; }
  @keyframes barGrow { from { transform: scaleY(0); transform-origin: bottom; } }

  /* REPOS */
  .repos-card { padding: 1.25rem 1.5rem; flex: 1; }
  .repos-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 420px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
    padding-right: 0.25rem;
  }
  .repos-list::-webkit-scrollbar { width: 4px; }
  .repos-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .repo-item {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.85rem 1rem;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.25rem 0.5rem;
    align-items: start;
    transition: border-color 0.15s;
    text-decoration: none;
    color: inherit;
  }
  .repo-item:hover { border-color: var(--accent2); }
  .repo-name {
    color: var(--accent2);
    font-size: 0.82rem;
    font-weight: 500;
  }
  .repo-desc {
    color: var(--muted);
    font-size: 0.72rem;
    line-height: 1.5;
    grid-column: 1 / -1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .repo-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    grid-column: 1 / -1;
    margin-top: 0.35rem;
  }
  .repo-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.68rem;
    color: var(--muted);
  }
  .lang-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .repo-star-count {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 0.15rem 0.5rem;
    font-size: 0.68rem;
    color: var(--muted);
    white-space: nowrap;
  }

  .no-repos {
    color: var(--muted);
    font-size: 0.78rem;
    text-align: center;
    padding: 2rem;
  }
`;

const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  Ruby: "#701516", Go: "#00ADD8", Rust: "#dea584", Java: "#b07219",
  "C++": "#f34b7d", C: "#555555", "C#": "#178600", PHP: "#4F5D95",
  Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB",
  HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051", Vue: "#41b883",
  default: "#7d8590"
};

function getLangColor(lang) {
  return LANG_COLORS[lang] || LANG_COLORS.default;
}

function fmtNum(n) {
  if (!n) return "0";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

function MetaRow({ icon, children }) {
  if (!children) return null;
  return (
    <div className="meta-row">
      <span className="meta-icon">{icon}</span>
      <span className="meta-val">{children}</span>
    </div>
  );
}

function ActivityBar({ repoCount }) {
  const bars = Array.from({ length: 24 }, (_, i) => {
    const h = Math.random();
    const active = h > 0.5;
    const accent2 = h > 0.8;
    const pct = Math.max(10, Math.round(h * 100));
    return { pct, active, accent2, delay: i * 25 };
  });

  return (
    <div className="card contrib-card">
      <div className="section-label">// <span>contribution</span> activity</div>
      <div className="contrib-bars">
        {bars.map((b, i) => (
          <div
            key={i}
            className={`contrib-bar${b.active ? " active" : ""}${b.accent2 ? " accent2" : ""}`}
            style={{
              height: `${b.pct}%`,
              animationDelay: `${b.delay}ms`
            }}
          />
        ))}
      </div>
    </div>
  );
}

function RepoCard({ repos }) {
  return (
    <div className="card repos-card">
      <div className="section-label">// <span>repositories</span> ({repos.length})</div>
      {repos.length === 0 ? (
        <div className="no-repos">No public repositories</div>
      ) : (
        <div className="repos-list">
          {repos.map(repo => (
            <a
              key={repo.id}
              className="repo-item"
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="repo-name">{repo.name}</span>
              {repo.stargazers_count > 0 && (
                <span className="repo-star-count">⭐ {fmtNum(repo.stargazers_count)}</span>
              )}
              {repo.description && (
                <span className="repo-desc">{repo.description}</span>
              )}
              <div className="repo-meta">
                {repo.language && (
                  <span className="repo-badge">
                    <span className="lang-dot" style={{ background: getLangColor(repo.language) }} />
                    {repo.language}
                  </span>
                )}
                {repo.forks_count > 0 && (
                  <span className="repo-badge">⑂ {fmtNum(repo.forks_count)}</span>
                )}
                <span className="repo-badge">
                  🔄 {new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileCard({ user }) {
  return (
    <div className="card profile-card">
      <div className="avatar-wrap">
        <img className="avatar" src={user.avatar_url} alt={user.login} />
        <div className="avatar-ring" />
      </div>

      <div>
        <div className="profile-name">{user.name || user.login}</div>
        <div className="profile-login">{user.login}</div>
      </div>

      {user.bio && <div className="profile-bio">{user.bio}</div>}

      <div className="stats-row">
        <div className="stat">
          <span className="stat-val">{fmtNum(user.followers)}</span>
          <span className="stat-lbl">Followers</span>
        </div>
        <div className="stat">
          <span className="stat-val">{fmtNum(user.following)}</span>
          <span className="stat-lbl">Following</span>
        </div>
        <div className="stat">
          <span className="stat-val">{fmtNum(user.public_repos)}</span>
          <span className="stat-lbl">Repos</span>
        </div>
      </div>

      <div className="profile-meta">
        {user.company && <MetaRow icon="🏢">{user.company.replace(/^@/, "")}</MetaRow>}
        {user.location && <MetaRow icon="📍">{user.location}</MetaRow>}
        {user.blog && (
          <MetaRow icon="🔗">
            <a href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noopener noreferrer">
              {user.blog.replace(/^https?:\/\//, "")}
            </a>
          </MetaRow>
        )}
        {user.twitter_username && <MetaRow icon="𝕏">@{user.twitter_username}</MetaRow>}
        <MetaRow icon="📅">
          Joined {new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </MetaRow>
      </div>

      <a
        className="gh-link"
        href={user.html_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg height="14" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        View on GitHub
      </a>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const search = async (username) => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setUser(null);
    setRepos([]);
    try {
      const [uRes, rRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`)
      ]);
      if (!uRes.ok) {
        if (uRes.status === 404) throw new Error(`User "${username}" not found`);
        if (uRes.status === 403) throw new Error("API rate limit exceeded. Please try again later.");
        throw new Error(`GitHub API error: ${uRes.status}`);
      }
      const userData = await uRes.json();
      const reposData = rRes.ok ? await rRes.json() : [];
      setUser(userData);
      setRepos(Array.isArray(reposData) ? reposData : []);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    search(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") search(query);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <header className="header">
          <div className="header-eyebrow">github profile finder</div>
          <h1>Search <span>Profiles</span></h1>
          <div className="header-sub">Explore GitHub users & their public repositories</div>
        </header>

        <div className="search-wrap">
          <div className="search-box">
            <span className="search-prefix">github.com/</span>
            <input
              ref={inputRef}
              className="search-input"
              type="text"
              placeholder="username"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
            <button
              className="search-btn"
              onClick={handleSubmit}
              disabled={loading || !query.trim()}
            >
              SEARCH
            </button>
          </div>
        </div>

        {loading && (
          <div className="state-box">
            <div className="loading-ring" />
            <div className="loading-text">fetching profile</div>
          </div>
        )}

        {error && !loading && (
          <div className="state-box">
            <div className="error-box">
              <div className="error-code">// ERROR 404</div>
              <div className="error-msg">{error}</div>
              <div className="error-hint">Double-check the username and try again.</div>
            </div>
          </div>
        )}

        {!loading && !error && !user && (
          <div className="state-box">
            <div className="empty-state">
              <span className="big">⌨️</span>
              Enter a GitHub username above<br />
              to explore their profile and repositories
            </div>
          </div>
        )}

        {!loading && !error && user && (
          <div className="profile-grid">
            <ProfileCard user={user} />
            <div className="right-col">
              <ActivityBar repoCount={user.public_repos} />
              <RepoCard repos={repos} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}