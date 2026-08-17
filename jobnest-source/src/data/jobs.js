const companies = [
  { name: "Nimbus Tech", logo: "🌩️" },
  { name: "Orbit Systems", logo: "🛰️" },
  { name: "Verdant Labs", logo: "🌿" },
  { name: "Cobalt Works", logo: "🔷" },
  { name: "Pixel Forge", logo: "🎮" },
  { name: "Skyline Finance", logo: "🏙️" },
  { name: "Northwind Health", logo: "⚕️" },
  { name: "BrightPath EdTech", logo: "📚" },
  { name: "Quantum Retail", logo: "🛒" },
  { name: "Aurora Media", logo: "🎬" },
];

const roles = [
  { title: "Frontend Developer", category: "Engineering", skills: ["React", "JavaScript", "CSS", "HTML"] },
  { title: "Backend Developer", category: "Engineering", skills: ["Node.js", "Express", "MongoDB", "SQL"] },
  { title: "Full Stack Developer", category: "Engineering", skills: ["React", "Node.js", "SQL", "AWS"] },
  { title: "UI/UX Designer", category: "Design", skills: ["Figma", "Adobe XD", "Prototyping", "Wireframing"] },
  { title: "Product Manager", category: "Product", skills: ["Roadmapping", "Agile", "Analytics", "Communication"] },
  { title: "Data Analyst", category: "Data", skills: ["SQL", "Excel", "Python", "Tableau"] },
  { title: "Data Scientist", category: "Data", skills: ["Python", "Machine Learning", "Statistics", "SQL"] },
  { title: "DevOps Engineer", category: "Engineering", skills: ["Docker", "Kubernetes", "AWS", "CI/CD"] },
  { title: "Digital Marketing Specialist", category: "Marketing", skills: ["SEO", "SEM", "Content", "Analytics"] },
  { title: "HR Manager", category: "Human Resources", skills: ["Recruiting", "Onboarding", "Compliance", "Payroll"] },
  { title: "Mobile App Developer", category: "Engineering", skills: ["React Native", "Swift", "Kotlin", "Firebase"] },
  { title: "QA Engineer", category: "Engineering", skills: ["Testing", "Automation", "Selenium", "Cypress"] },
  { title: "Sales Executive", category: "Sales", skills: ["Negotiation", "CRM", "Lead Generation", "Communication"] },
  { title: "Content Writer", category: "Marketing", skills: ["Writing", "SEO", "Editing", "Research"] },
  { title: "Business Analyst", category: "Product", skills: ["Requirements", "SQL", "Documentation", "Agile"] },
];

const cities = [
  "Bengaluru, IN", "Hyderabad, IN", "Pune, IN", "Gurugram, IN", "Chennai, IN",
  "Remote", "Mumbai, IN", "Noida, IN", "Chandigarh, IN", "Kolkata, IN",
];

const types = ["Full-time", "Part-time", "Contract", "Internship"];
const levels = ["Entry Level", "Mid Level", "Senior Level", "Lead"];

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateJobs() {
  const jobs = [];
  let id = 1;
  for (let i = 0; i < 60; i++) {
    const role = roles[i % roles.length];
    const company = companies[Math.floor(seededRandom(i * 3.1) * companies.length)];
    const city = cities[Math.floor(seededRandom(i * 5.7) * cities.length)];
    const type = types[Math.floor(seededRandom(i * 7.3) * types.length)];
    const level = levels[Math.floor(seededRandom(i * 2.9) * levels.length)];
    const minSalary = 4 + Math.floor(seededRandom(i * 1.3) * 20);
    const maxSalary = minSalary + 3 + Math.floor(seededRandom(i * 4.4) * 15);
    const daysAgo = Math.floor(seededRandom(i * 9.1) * 30);
    const postedDate = new Date();
    postedDate.setDate(postedDate.getDate() - daysAgo);

    jobs.push({
      id: id++,
      title: role.title,
      category: role.category,
      company: company.name,
      logo: company.logo,
      location: city,
      type,
      level,
      skills: role.skills,
      salaryMin: minSalary,
      salaryMax: maxSalary,
      postedDate: postedDate.toISOString(),
      description: `We are looking for a passionate ${role.title} to join ${company.name}. You will work closely with cross-functional teams to design, build and deliver high quality solutions. This is a great opportunity to grow your career in ${role.category}.`,
      responsibilities: [
        `Collaborate with the ${role.category} team to deliver key projects`,
        "Participate in planning, stand-ups and retrospectives",
        "Write clean, maintainable and well-documented work",
        "Continuously improve processes and best practices",
        "Mentor junior team members when required",
      ],
      requirements: [
        `${level} experience relevant to ${role.title}`,
        `Strong knowledge of ${role.skills.slice(0, 2).join(" and ")}`,
        "Excellent communication and teamwork skills",
        "Bachelor's degree or equivalent practical experience",
      ],
      benefits: ["Health insurance", "Flexible working hours", "Paid time off", "Learning & development budget", "Remote-friendly culture"],
      openings: 1 + Math.floor(seededRandom(i * 6.6) * 5),
    });
  }
  return jobs;
}

export const JOBS = generateJobs();

export const CATEGORIES = [...new Set(roles.map((r) => r.category))];
export const LOCATIONS = cities;
export const JOB_TYPES = types;
export const JOB_LEVELS = levels;
