// ===========================================================
//  The terminal's "brain".
// ===========================================================
//  There is no real AI or API call here, and that is the point.
//  This is a small search engine: your question is turned into
//  words, every knowledge entry is scored against those words, and
//  the highest score wins. Then the answer is typed out.
//
//  Because the answers import from resume.js, if you change your
//  details there, the terminal updates itself automatically.
//
//  To teach it a new thing, add one more object to `knowledge`.
// ===========================================================

import {
  profile,
  quickFacts,
  skills,
  projects,
  education,
  certifications,
  services,
  organizations,
} from './resume'

// Helper: flatten all skills into one list, so we can answer
// "what are my skills" without listing 20 names by hand.
const allSkills = skills.flatMap((group) =>
  group.items.map((item) => `${item.name} (${group.group}, ${item.level}%)`)
)

const allProjects = projects.map((p) => p.title)
const allCerts = certifications.map((c) => `${c.title} from ${c.issuer}`)

// ---------------------------------------------------------------
//  The knowledge base.
//
//  keywords  -> words that mean this entry is a good match
//  answer    -> the text the terminal types back
//  link      -> optional route, so the answer can include a link
// ---------------------------------------------------------------
export const knowledge = [
  {
    id: 'who',
    keywords: ['who', 'yourname', 'name', 'about', 'yourself', 'introduce', 'hi', 'hello', 'whoareyou', 'nickname', 'called', 'emman'],
    answer: `I am ${profile.name}, though most people call me ${profile.shortName}. ${profile.role} at ${education.school}, specializing in ${profile.specialization}.`,
    link: { to: '/about', label: 'Read my full story' },
  },
  {
    id: 'available',
    keywords: ['available', 'availability', 'hire', 'hiring', 'work', 'job', 'freelance', 'sideline', 'open', 'internship', 'ojt', 'intern', 'looking'],
    answer: `${quickFacts.status}. ${quickFacts.availability}. ${quickFacts.responseTime}.`,
    link: { to: '/contact', label: 'Start a conversation' },
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'reach', 'phone', 'call', 'message', 'hire', 'talk'],
    answer: `Email: ${profile.email}. Phone: ${profile.phone}. I am in ${quickFacts.location}.`,
    link: { to: '/contact', label: 'Open the contact page' },
  },
  {
    id: 'where',
    keywords: ['where', 'location', 'based', 'address', 'city', 'philippines', 'live'],
    answer: `I am in ${profile.address}. ${quickFacts.school}.`,
  },
  {
    id: 'skills',
    keywords: ['skill', 'skills', 'stack', 'technology', 'tech', 'know', 'goodat', 'expert', 'use', 'tools'],
    answer: `My main tools are ${allSkills.slice(0, 8).join(', ')}. Strongest areas are responsive design, CRUD operations, and database design.`,
    link: { to: '/about', label: 'See the full skill bars' },
  },
  {
    id: 'react',
    keywords: ['react', 'reactjs', 'frontend', 'front', 'jsx', 'component'],
    answer: `React is where I am strongest on the frontend. I build with components, hooks, and routing. Chronica is my main React project and this very website is built with React and React Router.`,
    link: { to: '/projects/chronica', label: 'View the Chronica case study' },
  },
  {
    id: 'database',
    keywords: ['database', 'sql', 'mysql', 'firebase', 'er', 'erd', 'schema', 'backend', 'backend', 'data'],
    answer: `I work with MySQL, MS SQL Server, and Firebase. I design schemas with ERDs and normalize up to 3NF, and I am comfortable writing the CRUD layer on top of them.`,
    link: { to: '/projects/mvb', label: 'See a database-first project' },
  },
  {
    id: 'php',
    keywords: ['php', 'laravel', 'jquery', 'xampp'],
    answer: `PHP is my main server-side language. I used it for the Survey and Analytics Platform and the MVB Data Visualization system, both with MySQL behind them.`,
    link: { to: '/projects/survey', label: 'View the Survey Platform' },
  },
  {
    id: 'unity',
    keywords: ['unity', 'game', 'games', 'gamedev', '3d', 'shader', 'blender', 'c#', 'csharp', 'capstone', 'simulation', 'unos', 'disaster'],
    answer: `My capstone is UNOS, a first-person 3D disaster-preparedness simulation in Unity 6 and C#. It covers the whole response cycle, uses the real topography of Brgy. Sto. Nino in Calumpit, Bulacan, and runs on a data-driven quest system across three chapters. I also work in Shader Graph, Ink Dialogue Scripting, and Blender.`,
    link: { to: '/projects/unos', label: 'View the UNOS case study' },
  },
  {
    id: 'android',
    keywords: ['android', 'java', 'mobile', 'phone', 'app', 'thinkflow', 'notes', 'flashcard', 'studio'],
    answer: `Thinkflow is my Android app: 20-plus screens in Java 11 covering notes, to-dos, camera notes, and flashcards on one shared data layer, with register and login flows validated client side.`,
    link: { to: '/projects/thinkflow', label: 'View the Thinkflow case study' },
  },
  {
    id: 'projects',
    keywords: ['project', 'projects', 'build', 'built', 'made', 'portfolio', 'work', 'app', 'application', 'system'],
    answer: `I have built ${allProjects.length} complete systems: ${allProjects.join(', ')}. UNOS is my Unity capstone, Thinkflow is Android, and the rest are web or desktop systems over MySQL and SQL Server.`,
    link: { to: '/projects', label: 'Browse all projects' },
  },
  {
    id: 'organizations',
    keywords: ['organization', 'organisation', 'org', 'club', 'community', 'member', 'society', 'swits', 'microsoft', 'bulsu', 'msc', 'volunteer', 'event', 'joined'],
    answer: `I am a member of ${organizations
      .map((o) => `${o.abbr} (${o.period})`)
      .join(' and ')}. Through SWITS I joined the ICT Congress, CodeQuest, and Coder's Errata, where I was a finalist. Through BULSU MSC I did a 3-day Microsoft 365 training.`,
    link: { to: '/journey', label: 'See my involvement' },
  },
  {
    id: 'chronica',
    keywords: ['chronica', 'cms', 'content', 'publishing', 'blog', 'novel', 'story', 'stories', 'chapter', 'quill'],
    answer: `Chronica is a web novel publishing platform. Authors manage stories and chapters with drag-and-drop reordering in a Quill editor, and readers get search, categories, bookmarks, and reviews with average ratings. Firebase handles auth and real-time data, Cloudinary handles images.`,
    link: { to: '/projects/chronica', label: 'Full case study' },
  },
  {
    id: 'survey',
    keywords: ['survey', 'analytics', 'dashboard', 'chart', 'charts', 'report', 'question'],
    answer: `The Survey and Analytics Platform supports multiple question formats, saves every response to MySQL, and generates live analytics dashboards. It cut report generation time by 30%.`,
    link: { to: '/projects/survey', label: 'Full case study' },
  },
  {
    id: 'mvb',
    keywords: ['mvb', 'volleyball', 'player', 'stats', 'statistics', 'sport', 'tournament', 'visualization', 'chart'],
    answer: `The MVB Data Visualization Management System centralises player statistics on a dashboard and automates the statistical summaries and charts used for tournament performance analysis. It improved data accessibility and monitoring by 80% and reporting efficiency by 70%.`,
    link: { to: '/projects/mvb', label: 'Full case study' },
  },
  {
    id: 'library',
    keywords: ['library', 'swing', 'desktop', 'book', 'books', 'borrow', 'reservation'],
    answer: `The Library Management System is a Java Swing desktop app on MS SQL Server over JDBC. Cataloging, bookkeeping, borrowing, and reserving are all database records, which cut the manual work by 50%.`,
    link: { to: '/projects/library', label: 'Full case study' },
  },
  {
    id: 'education',
    keywords: ['school', 'university', 'study', 'studying', 'student', 'college', 'degree', 'major', 'bulacan', 'course', 'subject', 'coursework'],
    answer: `I study ${education.degree} at ${education.school}, ${education.campus}, with a specialization in ${education.specialization}. ${education.expected}. Coursework includes ${education.coursework.join(', ')}.`,
    link: { to: '/journey', label: 'See the full journey' },
  },
  {
    id: 'certifications',
    keywords: ['cert', 'certification', 'certificate', 'certified', 'award', 'honor', 'iso', 'salesforce', 'cisco'],
    answer: `I have ${allCerts.length} certifications and achievements: ${allCerts.join('; ')}. I am also a Dean's Lister for 2024-2025.`,
    link: { to: '/journey', label: 'See certifications' },
  },
  {
    id: 'services',
    keywords: ['service', 'services', 'offer', 'help', 'candowork', 'do', 'capable', 'goodfor'],
    answer: `I can help with ${services.map((s) => s.title.toLowerCase()).join(', ')}.`,
    link: { to: '/contact', label: 'Send me the details' },
  },
  {
    id: 'graduation',
    keywords: ['graduate', 'graduating', 'graduation', 'finish', 'when'],
    answer: `I am expected to graduate in ${quickFacts.graduation}. Most of my time right now goes into the UNOS capstone.`,
  },
  {
    id: 'thissite',
    keywords: ['build', 'thissite', 'website', 'made', 'tech', 'code', 'react', 'route', 'routing', 'feature'],
    answer: `This site is React 18 + Vite with React Router. The command palette, the multi-theme system, and the custom cursor are all hand-written, no UI libraries. Press Ctrl+K to try the palette.`,
  },
]

// ---------------------------------------------------------------
//  Text helpers for the search
// ---------------------------------------------------------------

// Split a sentence into lowercase words.
function toWords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

// Light stemming so "skills" also matches "skill" and "projects"
// also matches "project". We just chop common endings.
function stem(word) {
  return word
    .replace(/(ing|ed|es|s)$/i, '')
    .replace(/^(.{0,3})$/, '$1') // keep very short words as they are
}

// ---------------------------------------------------------------
//  matchAnswer(question)
//
//  Scores every entry and returns the best one, or null if
//  nothing scored high enough.
// ---------------------------------------------------------------
export function matchAnswer(question) {
  const questionWords = toWords(question).map(stem)
  if (questionWords.length === 0) return null

  let best = null
  let bestScore = 0

  knowledge.forEach((entry) => {
    let score = 0
    let matchedKeywords = 0

    entry.keywords.forEach((keyword) => {
      const key = stem(keyword.toLowerCase())
      let got = 0

      questionWords.forEach((word) => {
        if (word === key) {
          // Exact word match, worth the most. The length of the
          // keyword is added as a bonus, because a long specific
          // word like "chronica" is a much stronger signal than a
          // short generic one like "about". Without this bonus,
          // "tell me about chronica" ties between this entry and
          // the generic "who are you" entry.
          score += 10 + keyword.length
          got += 1
        } else if (word.length > 3 && key.includes(word)) {
          // Partial match, e.g. "databases" inside "database".
          score += 4
          got += 1
        }
      })

      // Counting how many different keywords hit breaks ties in
      // favour of the entry that matched on more fronts.
      if (got > 0) matchedKeywords += 1
    })

    // A question that matches well should beat a long question
    // that only matches one small word, so we also reward using
    // up a large share of the words that were typed.
    const coverage = score / questionWords.length
    const finalScore = score + coverage + matchedKeywords * 3

    if (finalScore > bestScore) {
      bestScore = finalScore
      best = entry
    }
  })

  // Minimum bar, otherwise we would "answer" everything.
  return bestScore >= 10 ? best : null
}

// The clickable suggestions shown before you type anything.
export const suggestions = [
  'What can you do?',
  'Show me your projects',
  'What is your best skill?',
  'Are you available?',
  'What school do you attend?',
  'Tell me about Chronica',
  'How do I contact you?',
  'What is this website built with?',
]
