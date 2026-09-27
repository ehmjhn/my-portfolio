// ===========================================================
//  THIS IS THE ONLY FILE YOU NEED TO EDIT TO UPDATE THE SITE
// ===========================================================
//  Everything on the website is pulled from this one file:
//  the pages, the command palette, and even the little terminal
//  in the corner answers questions using only the data below.
//
//  Data lives in one place -> nothing gets out of sync.
//
//  The facts here come from your CV, so if something changes
//  (a new project, a new cert) update it here and the whole
//  site follows automatically.
// ===========================================================

export const profile = {
  // "Emman" is the nickname. It is used for the friendly greeting
  // and the terminal, while the name below is the one on your CV.
  name: 'Emmanuele S. Alcañices',
  shortName: 'Emman',
  initials: 'EA',

  role: 'BS Information Technology Student',
  specialization: 'Web & Mobile Application Development',

  objective:
    'Motivated BS Information Technology student seeking an Internship/OJT where I can apply my academic knowledge, develop practical skills, and contribute to a professional team environment.',

  // The CV only lists the municipality, so that is all we put here.
  address: 'Pandi, Bulacan, Philippines',
  email: 'jhonemmanuele.alcanices@gmail.com',
  phone: '+63 999 533 4130',

  // These two come from the .env file (see .env.example). If the .env
  // is missing, the fallback link below is used instead, so the site
  // still has a working link without any setup.
  // The ?. is a safety net, so this file also works outside Vite
  // (for example when a script imports it directly).
  github: import.meta.env?.VITE_GITHUB_URL || 'https://github.com/ehmjhn',
  linkedin: import.meta.env?.VITE_LINKEDIN_URL || 'https://www.linkedin.com/',
}

// Short answers the terminal can give. Keep them short, they get
// typed out letter by letter.
export const quickFacts = {
  status: 'Open to internships and OJT',
  location: 'Pandi, Bulacan, Philippines',
  graduation: 'May 2027',
  major: 'BS Information Technology (Web & Mobile App Development)',
  school: 'Bulacan State University',
  availability: 'Available for internship and OJT placements',
  responseTime: 'Usually replies within a day',
}

// Words that rotate in the hero typing animation
export const typingWords = [
  'Unity & C#',
  'React Interfaces',
  'Android Apps',
  'PHP & MySQL',
  '3D Game Systems',
  'Data Dashboards',
]

// The numbers under the hero. These come from the CV: six projects,
// the 80% figure is the MVB data accessibility gain, and there are
// four certifications and achievements.
export const stats = [
  { value: 6, suffix: '', label: 'Projects Shipped' },
  { value: 80, suffix: '%', label: 'Best Measured Gain' },
  { value: 4, suffix: '', label: 'Certifications & Awards' },
  { value: 2027, suffix: '', label: 'Expected Graduation' },
]

export const about = {
  summary:
    'I am a BS Information Technology student at Bulacan State University, specializing in Web and Mobile Application Development. My capstone is UNOS, a 3D disaster-preparedness simulation built in Unity. Alongside that I build web systems, Android apps, and database-backed platforms.',
  highlights: [
    'Dean’s Lister (2024–2025) for academic excellence',
    'Programmer on UNOS, a 3D disaster-preparedness sim in Unity 6 and C#',
    'Cisco JavaScript Essentials 1 and ISO/IEC 20000:2018 certified',
    'Salesforce Virtual Internship as a Student Developer',
    'Member of BULSU Microsoft Student Community and SWITS',
  ],
  // The three things I want a recruiter to remember. Used on /about.
  pillars: [
    {
      icon: '01',
      title: 'Design the data first',
      text: 'Before writing a single line of code I draw the ERD and work out the tables. Most bugs I have hit came from skipping this step.',
    },
    {
      icon: '02',
      title: 'Ship the smallest working version',
      text: 'A working rough version beats a beautiful broken one. I get the flow working, then I go back and make it look good.',
    },
    {
      icon: '03',
      title: 'Make the interface obvious',
      text: 'If someone needs instructions to use it, the interface is not finished yet. I test with people who have never seen the project.',
    },
  ],
  currentlyLearning:
    'Right now my time goes to the UNOS capstone in Unity, alongside the course subjects listed above.',
  approach:
    'Understand the problem first, draw the data model, build the smallest working version, then improve the interface. Every project on this site started as a real problem that needed a real solution.',
}

// name, level (0-100), and the small note under the bar.
// The groups and the skills inside them follow your CV.
export const skills = [
  {
    group: 'Languages',
    color: 'cyan',
    blurb: 'The programming languages I write in.',
    items: [
      { name: 'JavaScript', level: 85, note: 'ES6+, async/await, DOM work' },
      { name: 'PHP', level: 80, note: 'CRUD backends, form handling' },
      { name: 'Java', level: 78, note: 'Swing desktop, Android, OOP' },
      { name: 'Python', level: 70, note: 'Scripting, automation, coursework' },
      { name: 'TypeScript', level: 65, note: 'Typed React, safer refactors' },
      { name: 'C# / C++', level: 70, note: 'Unity gameplay, logic exercises' },
    ],
  },
  {
    group: 'Frameworks & Libraries',
    color: 'violet',
    blurb: 'The libraries that save me from rewriting basics.',
    items: [
      { name: 'ReactJS', level: 82, note: 'Components, hooks, routing, state' },
      { name: 'Node.js', level: 75, note: 'Server routes, auth, APIs' },
      { name: 'jQuery', level: 78, note: 'DOM-heavy class projects' },
      { name: 'Tailwind', level: 70, note: 'Utility-first styling' },
      { name: 'Bootstrap', level: 80, note: 'Responsive grids and modals' },
    ],
  },
  {
    group: 'Databases & Infrastructure',
    color: 'pink',
    blurb: 'Where the data lives, and how I keep it tidy.',
    items: [
      { name: 'MySQL', level: 85, note: 'Joins, subqueries, indexing' },
      { name: 'MS SQL Server', level: 80, note: 'Stored procedures, admin' },
      { name: 'Google Firebase', level: 78, note: 'Auth, Realtime DB, storage' },
      { name: 'Database Design (ERD, DFD)', level: 85, note: 'Normalising up to 3NF' },
      { name: 'SQL', level: 85, note: 'Queries, joins, reporting' },
    ],
  },
  {
    group: 'Game & Tools',
    color: 'green',
    blurb: 'Unity for the capstone, and the tools around it.',
    items: [
      { name: 'Unity 6', level: 75, note: 'URP, scenes, prefabs, lighting' },
      { name: 'Shader Graph', level: 65, note: 'Custom water and sky shaders' },
      { name: 'Ink Dialogue Scripting', level: 70, note: 'Branching story in UNOS' },
      { name: 'Blender', level: 55, note: 'Low-poly modelling, topology' },
      { name: 'Git / GitHub', level: 80, note: 'Branches, commits, pull requests' },
    ],
  },
  {
    group: 'Design & Productivity',
    color: 'green',
    blurb: 'The tools that keep the work tidy and shippable.',
    items: [
      { name: 'Figma', level: 75, note: 'Wireframes and mockups' },
      { name: 'VS Code', level: 90, note: 'Daily driver' },
      { name: 'Trello', level: 80, note: 'Task boards for group projects' },
      { name: 'Google Workspace', level: 85, note: 'Docs, Sheets, Slides' },
      { name: 'Responsive Web Design', level: 88, note: 'Mobile first, works everywhere' },
    ],
  },
]

// The full case studies. Each one becomes its own page at
// /projects/<id>, so the /challenge and /solution parts below
// only show up on that project's page.
export const projects = [
  {
    id: 'unos',
    title: 'UNOS',
    subtitle: '3D Disaster-Preparedness Simulation',
    icon: '3D',
    year: '2026',
    featured: true,
    role: 'Programmer in a 5-member team (3 programmers, 2 3D modelers)',
    stack: ['Unity', 'C#', 'URP', 'Shader Graph', 'Ink Dialogue Scripting', 'Blender'],
    short:
      'A first-person 3D simulation that walks a player through the full disaster response cycle, built on the real geography of Brgy. Sto. Niño in Calumpit, Bulacan.',
    overview:
      'UNOS is my Capstone Project. It is a first-person 3D disaster-preparedness simulation built in Unity 6. Rather than a generic disaster scene, the environment is modelled on the actual topography of Brgy. Sto. Niño in Calumpit, Bulacan, so the flood and evacuation scenarios match a real community.',
    description: [
      'The simulation covers the entire response cycle in order: prevention, preparedness, response, and recovery. The player moves through a village that is hit by a flood and has to make the same kinds of decisions an actual community would face.',
      'The whole thing is driven by a data-driven quest system rather than fixed cutscenes. That system coordinates NPCs, the weather director, the minimap, quest beacons, the inventory, and a decision manager, across three chapters covering evacuation, flood rescue, and medical triage.',
    ],
    challenge:
      'The hardest problem was making a disaster feel teachable instead of just destructive. Flood simulations usually reward ignoring the problem, and the player had no reason to prepare. We also had to make the real Calumpit terrain readable inside a game without it feeling like a map, and we only had three programmers for a project this size.',
    solution:
      'We tied the quest system to the decision manager, so what the player chooses actually changes the world state: shelters fill up, routes close, and the weather director escalates. Because the terrain came from the real place, we used Shader Graph for the water and sky so the flood reads clearly at a distance. Splitting the work so the two modelers owned all environment art let the three of us stay on systems and gameplay.',
    features: [
      'Four-phase response cycle: prevention, preparedness, response, recovery',
      'First-person 3D village modelled on Brgy. Sto. Niño, Calumpit, Bulacan',
      'Data-driven quest engine coordinating every system',
      'Three chapters: evacuation, flood rescue, and medical triage',
      'NPC behaviour, weather director, minimap, and quest beacons',
      'Inventory and a decision manager that reacts to player choices',
      'Custom water and sky shaders built in Shader Graph',
      'Branching dialogue authored with Ink Dialogue Scripting',
    ],
    techNotes: [
      { label: 'Why Unity', text: 'URP gave us good-looking low-poly water and sky on a laptop-friendly budget, and C# kept the quest system readable for a three-person code team.' },
      { label: 'Ink Dialogue', text: 'Branching dialogue in a plain text file meant the story could change without a programmer touching the code.' },
      { label: 'Real terrain', text: 'Modelling the actual barangay turned an abstract flood into something the team could test against local knowledge.' },
    ],
    gains: [
      { value: 4, label: 'response phases simulated end to end' },
      { value: 3, label: 'programmers sharing a 5-person build' },
    ],
  },
  {
    id: 'chronica',
    title: 'Chronica',
    subtitle: 'Web Novel Publishing Platform',
    icon: 'CH',
    year: '2025',
    featured: true,
    role: 'Full-stack Developer (solo project)',
    stack: ['ReactJS', 'Node.js', 'Firebase', 'Cloudinary', 'Quill'],
    short:
      'A publishing platform for web novels, where authors manage stories and chapters and readers get search, bookmarks, and reviews.',
    overview:
      'Chronica is a content management system for web novels. On one side an author creates and manages stories and chapters, including drag-and-drop reordering. On the other side a reader can search, filter by category or tag, bookmark, and leave reviews with average ratings.',
    description: [
      'The author side handles the full publishing lifecycle: add, edit, and delete for both stories and chapters, plus drag-and-drop so an author can reorder chapters without touching a number field. A Quill rich-text editor sits inside the chapter editor so formatting does not have to be written by hand.',
      'The reader side adds search, categories and tags, bookmarks, and reviews that roll up into an average rating per story. Firebase Authentication handles email and Google sign-in with email verification, and role-protected routing separates guest, reader, and author views so an author-only dashboard is never served to a visitor.',
    ],
    challenge:
      'Two very different users needed completely different interfaces on one site, and the data was relational in shape (a story has many chapters, a user has many bookmarks) but the stack was Firebase. Bookmark and follow data also had to stay consistent for a reader across devices without slow-loading the whole story list.',
    solution:
      'Role-protected routing checks the Firebase auth state before rendering an author or reader route, so permissions are enforced by the router rather than hidden buttons. Cloudinary took image uploads off the app entirely, which removed the file-size bottleneck immediately. Storing stories, chapters, likes, views, bookmarks, and follows in the Realtime Database meant the reader list could update live without a refresh.',
    features: [
      'Author dashboard for creating and editing stories and chapters',
      'Drag-and-drop chapter reordering',
      'Quill rich-text editor inside the chapter editor',
      'Reader search, category and tag filtering',
      'Bookmarks, follows, likes, and view tracking',
      'Reviews with per-story average ratings',
      'Firebase email and Google auth with email verification',
      'Role-protected routing for guest, reader, and author',
      'Cloudinary image hosting',
    ],
    techNotes: [
      { label: 'Why Firebase', text: 'Auth plus the Realtime Database meant no server to maintain for a solo class project that still had to feel live.' },
      { label: 'Why Cloudinary', text: 'Image hosting was the fastest real bottleneck. Moving uploads off the app removed the file-size problem entirely.' },
      { label: 'Hardest part', text: 'Keeping the reader list responsive while writes were happening in the background. Solved by loading the first page and fetching more on scroll.' },
    ],
    gains: [
      { value: 85, label: 'faster publishing & organization' },
      { value: 80, label: 'more reader access & engagement' },
    ],
  },
  {
    id: 'thinkflow',
    title: 'Thinkflow',
    subtitle: 'Android Notes & Productivity App',
    icon: 'TF',
    year: '2025',
    role: 'Android Developer (solo project)',
    stack: ['Java 11', 'Android Studio'],
    short:
      'A 20-plus screen Android app combining notes, to-dos, camera notes, and flashcards in one local-first productivity app.',
    overview:
      'Thinkflow is an Android notes and productivity app written in Java 11. It is built around one in-app data layer so notes, to-dos, camera notes, and flashcards all live in the same place instead of in four disconnected features.',
    description: [
      'The app has more than twenty screens, built around register and login flows with client-side validation before anything is sent anywhere. The in-app data layer covers users, notes, to-dos, camera notes, and flashcards, and navigation between screens is intent-based.',
      'The camera notes feature is the part that makes it more than a to-do list: a note can carry a photo taken in the app, so the thing you saw and the thing you wrote about it stay together.',
    ],
    challenge:
      'Twenty-plus screens in one app means the navigation graph gets complicated fast, and mixing five different kinds of content (users, notes, to-dos, camera notes, flashcards) in one data layer risks every feature fighting over the same tables. Register and login also had to feel safe without a backend to lean on.',
    solution:
      'Keeping one shared data layer meant a note, a to-do, and a flashcard were the same kind of record with a different type, so adding a feature did not mean inventing new storage each time. Intent-based navigation kept each screen responsible for only where it goes next, which made the graph readable as it grew past twenty screens. Client-side validation gave immediate feedback on the register and login forms before any submit.',
    features: [
      '20+ screens covering notes, to-dos, flashcards, and account',
      'Register and login flows with client-side validation',
      'Shared in-app data layer for users, notes, to-dos, camera notes, and flashcards',
      'Camera notes that attach a photo to a note',
      'Intent-based multi-screen navigation',
      'Written in Java 11 with Android Studio',
    ],
    techNotes: [
      { label: 'Why one data layer', text: 'Five content types with one storage model meant a new feature cost a screen, not a migration.' },
      { label: 'Java 11', text: 'Chosen to match the course, which meant everything I learned transferred straight into the Android APIs.' },
      { label: 'Hardest part', text: 'Keeping the navigation graph sane past twenty screens. One destination per screen, no nested surprises.' },
    ],
    gains: [
      { value: 20, label: 'plus screens in one app' },
      { value: 5, label: 'content types on one data layer' },
    ],
  },
  {
    id: 'survey',
    title: 'Survey & Analytics Platform',
    subtitle: 'Multiple question types with a live reporting dashboard',
    icon: 'SV',
    year: '2025',
    role: 'Full-stack Developer (course project)',
    stack: ['jQuery', 'PHP', 'MySQL', 'XAMPP'],
    short:
      'A survey system with flexible question formats, automatic submission processing, and a dashboard that analyses results in real time.',
    overview:
      'This is the survey management system I designed for a course project. It handles multiple question formats, processes submissions automatically, and keeps a full survey history. The reporting dashboard then analyses those results in real time instead of waiting for someone to export and build a report by hand.',
    description: [
      'The survey builder supports several question formats rather than one, because real surveys need short answers, long answers, and choices side by side. Submissions are processed automatically once they come in, and every survey keeps its own history so results are never lost.',
      'The dashboard is the part that saved the most time. It analyses survey results in real time, which reduced report generation time by 30% and improved the whole surveying process for everyone who had to summarise the answers afterwards.',
    ],
    challenge:
      'Generating a report by hand from raw submissions was slow and inconsistent, and different people produced different summaries from the same data. Supporting several question formats also meant the results screen had to handle four different answer shapes cleanly.',
    solution:
      'Moving the analysis into the dashboard meant the numbers were computed the same way every time instead of by whoever was doing the reporting. Storing submissions with their question format attached let the results view render each answer type correctly from one query, rather than guessing at the shape of the data.',
    features: [
      'Survey builder with multiple question formats',
      'Automatic submission processing',
      'Full survey history per survey',
      'Real-time results dashboard',
      'Cut report generation time by 30%',
    ],
    techNotes: [
      { label: 'Why jQuery', text: 'The course was built on it, and for a form-heavy admin screen it did the job without a build step.' },
      { label: 'Why XAMPP', text: 'Local Apache and MySQL meant the whole project ran on one machine with no deployment step to debug.' },
      { label: 'Hardest part', text: 'Making one results query handle every question format without a separate report per type.' },
    ],
    gains: [
      { value: 30, label: 'less report generation time' },
      { value: 85, label: 'faster survey processing' },
    ],
  },
  {
    id: 'mvb',
    title: 'MVB Data Visualization',
    subtitle: 'Management system with automated tournament reporting',
    icon: 'MV',
    year: '2025',
    role: 'Full-stack Developer (course project)',
    stack: ['JavaScript', 'PHP', 'MySQL', 'XAMPP'],
    short:
      'A player statistics and dashboard system that automated the statistical summaries and charts used for tournament performance analysis.',
    overview:
      'The MVB Data Visualization Management System centralises player statistics and puts them on a dashboard. The aim was monitoring convenience: instead of asking someone for a number, you look at the dashboard. It also automates the statistical summaries and chart generation used for tournament performance analysis.',
    description: [
      'Centralised player statistics and dashboard visualisation increased data accessibility and monitoring convenience by 80%, because the numbers were available to anyone who needed them instead of sitting with whoever had entered them.',
      'The second half is automation. Statistical summaries and chart generation for tournament performance analysis were automated, which improved reporting efficiency by 70% and turned a manual job into a page load.',
    ],
    challenge:
      'Player statistics were being tracked but not really available, so monitoring depended on whoever happened to have the data. Tournament reporting was worse: every summary and every chart was built by hand, for every tournament, and the result was slow and easy to get wrong.',
    solution:
      'Centralising the statistics behind a dashboard made the data the default view rather than a request. Generating the summaries and charts from the stored records removed the hand-built step entirely, which is where the 70% reporting gain came from.',
    features: [
      'Centralised player statistics',
      'Dashboard visualisation of live records',
      'Automated statistical summaries',
      'Automated chart generation',
      'Tournament performance analysis',
      '80% gain in data accessibility and monitoring',
      '70% gain in reporting efficiency',
    ],
    techNotes: [
      { label: 'Why automate the charts', text: 'Chart generation was pure repetition. Doing it from the stored records removed a whole manual step.' },
      { label: 'Data model', text: 'Players, teams, and tournaments had to be separate tables, or every report became a special case.' },
      { label: 'Hardest part', text: 'Aggregating player stats across matches without double counting when a player appeared twice.' },
    ],
    gains: [
      { value: 80, label: 'more data accessibility & monitoring' },
      { value: 70, label: 'faster reporting efficiency' },
    ],
  },
  {
    id: 'library',
    title: 'Library Management System',
    subtitle: 'Desktop system for cataloging, borrowing, and reservations',
    icon: 'LB',
    year: '2025',
    role: 'Developer (course project)',
    stack: ['Java', 'Java Swing', 'MS SQL Server', 'JDBC', 'MS Access'],
    short:
      'A Java Swing desktop system that digitised book cataloging, bookkeeping, borrowing, and reservations, cutting the manual work in half.',
    overview:
      'A library management system built in Java Swing over an MS SQL Server database, connected with JDBC. It improved the cataloging procedure and automated transaction processing, then provided a digital book system covering bookkeeping, borrowing, and reserving.',
    description: [
      'Cataloging and transaction processing were both improved by putting the records in a database management system instead of a ledger. The digital book system then organised the three processes that used to eat the most time: bookkeeping, borrowing, and reserving, which together reduced the manual work by 50%.',
    ],
    challenge:
      'Cataloging, borrowing, and reserving were all tracked on paper, so the catalogue and the actual shelf could disagree, and nobody could answer a question about borrowing history without physically checking. Handling the initial dataset without a server to deploy to was also a real constraint.',
    solution:
      'Putting the records behind a database management system made bookkeeping a query instead of a reconciliation. MS SQL Server held the main records, with MS Access used for the initial small dataset during testing, which meant the project needed no server and could run on the library machines as they were.',
    features: [
      'Digital book catalog and record management',
      'Automated borrowing and return transactions',
      'Bookkeeping, borrowing, and reservation flows',
      'MS SQL Server with JDBC, Access for initial testing',
      'Reduced manual work by 50%',
    ],
    techNotes: [
      { label: 'Why desktop', text: 'The library already had its own PCs, so a Swing app avoided needing a server or an internet connection.' },
      { label: 'Database', text: 'MS SQL Server for the main records, with Access used for the initial small dataset during testing.' },
      { label: 'Hardest part', text: 'Keeping the book status correct when two users try to borrow the last copy at the same time.' },
    ],
    gains: [
      { value: 50, label: 'less manual bookkeeping work' },
      { value: 85, label: 'better record organization' },
    ],
  },
]

// Student organizations. Shown on the /journey page and in the
// command palette search.
export const organizations = [
  {
    id: 'bulsu-msc',
    name: 'BULSU Microsoft Student Community',
    abbr: 'BULSU MSC',
    role: 'Member',
    period: 'August 2024 – May 2025',
    icon: 'MS',
    points: [
      'Completed an intensive 3-day Microsoft 365 training program, building advanced proficiency in cloud-based productivity and collaboration tools.',
      'Joined professional development webinars on LinkedIn profile optimization, digital branding, and strategic networking in the IT industry.',
      'Worked with peers to share insights on applying Microsoft technologies to academic and early-career projects.',
    ],
  },
  {
    id: 'swits',
    name: 'Society for the Welfare of Information Technology Students',
    abbr: 'SWITS',
    role: 'Member',
    period: 'August 2025 – May 2026',
    icon: 'SW',
    points: [
      'Took part in major college events including the ICT Congress and the CodeQuest 2025 / Beyond The Code seminar series, tracking new software development trends.',
      'Sharpened technical and problem-solving ability through practical IT training and competitions, including Coder’s Errata: Bug Hunt and Fix.',
      'Attended career-readiness events like IT Fair 2025: Tetra Technecon, which connected academic programming concepts to real industry demands.',
      'Supported community initiatives and peer learning through events such as One for the Books: Pages of SWITS.',
    ],
  },
]

// Month-by-month "what I was busy with". This is the source data
// for the activity heatmap on the /journey page.
//
// IMPORTANT: these are the real dates from your CV, nothing invented.
//   MVB ......................... Apr 2025
//   Library, Survey ............. Apr–May 2025
//   Coder's Errata (finalist) ... Apr 2025
//   Cisco JavaScript Essentials 1 .. issued Aug 2025
//   Chronica ..................... Oct–Nov 2025
//   Thinkflow .................... Nov 2025
//   Salesforce Internship ........ 2025 (no month given, so it is
//                                    not placed in the grid)
//   UNOS ......................... Apr 2026 – present
//   ISO/IEC 20000 ................ issued Aug 2026
//
// The grid is honest: a month is only shaded if the CV says something
// happened in it. UNOS runs Apr 2026 to today, so those months are
// shaded as ongoing rather than dressed up with invented milestones.
// When a month has more than one real event, the tooltip lists them
// all instead of dropping one.
export const timeline = [
  { month: '2025-04', label: 'Started MVB, Library and Survey systems', kind: 'project', intensity: 4 },
  { month: '2025-04', label: 'Coder’s Errata finalist (SWITS)', kind: 'cert', intensity: 2 },
  { month: '2025-05', label: 'Finished Survey and Library systems', kind: 'project', intensity: 3 },
  { month: '2025-08', label: 'Cisco JavaScript Essentials 1 issued', kind: 'cert', intensity: 2 },
  { month: '2025-10', label: 'Started Chronica web novel platform', kind: 'project', intensity: 3 },
  { month: '2025-11', label: 'Finished Chronica web novel platform', kind: 'project', intensity: 3 },
  { month: '2025-11', label: 'Started Thinkflow Android app', kind: 'project', intensity: 4 },
  { month: '2026-04', label: 'UNOS Unity capstone started', kind: 'project', intensity: 4 },
  { month: '2026-05', label: 'UNOS capstone in progress', kind: 'project', intensity: 4 },
  { month: '2026-06', label: 'UNOS capstone in progress', kind: 'project', intensity: 4 },
  { month: '2026-07', label: 'UNOS capstone in progress', kind: 'project', intensity: 4 },
  { month: '2026-08', label: 'ISO/IEC 20000:2018 issued', kind: 'cert', intensity: 3 },
  { month: '2026-08', label: 'UNOS capstone in progress', kind: 'project', intensity: 4 },
  { month: '2026-09', label: 'UNOS capstone in progress', kind: 'project', intensity: 3 },
]

export const education = {
  school: 'Bulacan State University',
  campus: 'Malolos, Bulacan',
  degree: 'Bachelor of Science in Information Technology',
  track: 'Specialized in Web and Mobile Application Development',
  expected: 'Expected May 2027',
  coursework: [
    'Programming Fundamentals',
    'Database Systems',
    'Web Systems and Frameworks',
    'Mobile Application Development',
    'Game Development',
    'Systems Analysis, Design, Integration, and Architecture',
  ],
  // The CV lists one "Relevant Coursework" block and does not break the
  // subjects down by term or state a year level, so neither does the site.
  achievement: 'Dean’s Lister — 2024–2025 (Academic Excellence)',
}

// Certifications and achievements, exactly as listed on the CV.
// Note: the ICT Congress and CodeQuest are events, so they live in
// the organizations section above instead of here.
export const certifications = [
  {
    title: 'ISO/IEC 20000 IT Service Management Associate',
    issuer: 'SkillFront',
    meta: 'Issued August 2026',
    icon: '20K',
    note: 'IT service management practices and framework.',
  },
  {
    title: 'Salesforce Supported Virtual Internship Program',
    issuer: 'Salesforce',
    meta: '2025 · Philippines',
    icon: 'S',
    note: 'Hands-on CRM and cloud fundamentals program.',
  },
  {
    title: 'JavaScript Essentials 1',
    issuer: 'Cisco',
    meta: 'Issued August 2025',
    icon: 'JS',
    note: 'Core JavaScript syntax, functions, and the DOM.',
  },
  {
    title: 'Coder’s Errata: Bug Hunt and Fix — Finalist',
    issuer: 'Society for the Welfare of Information Technology Students (SWITS)',
    meta: 'Finalist · April 2025',
    icon: 'CE',
    note: 'Finalist in a live debugging competition at Networking Lab 2.',
  },
]

export const services = [
  {
    icon: '</>',
    title: 'Web Development',
    text: 'Responsive websites and web apps built with React, JavaScript, and PHP.',
  },
  {
    icon: 'DB',
    title: 'Database Design',
    text: 'ERD, DFD, and normalized schemas for MySQL, SQL Server, and Firebase.',
  },
  {
    icon: '{}',
    title: 'Dashboards & Charts',
    text: 'Analytics screens and data visualization that make numbers readable.',
  },
  {
    icon: '##',
    title: 'Auth & Systems',
    text: 'User authentication, CRUD systems, and clean admin workflows.',
  },
  {
    icon: '3D',
    title: 'Game & Interactive 3D',
    text: 'Unity and C# work: quest systems, shaders, and branching dialogue.',
  },
]
