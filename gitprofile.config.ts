import { UserConfig } from "./src/interfaces/user-config";

const config: UserConfig = {
  github: {
    username: "yassinebenarbia",
  },
  base: "/",
  projects: {
    github: {
      display: true,
      header: "Github Projects",
      mode: "automatic",
      automatic: {
        sortBy: "updated",
        limit: 4,
        exclude: {
          forks: false,
          projects: [],
        },
      },
      manual: {
        projects: [
          "yassinebenarbia/mmp",
          "yassinebenarbia/tomodoro",
          "yassinebenarbia/Project",
        ],
      },
    },
    external: {
      header: "My Projects",
      projects: [
        {
          title: "Mplayer",
          description: "Music Player in Rust",
          link: "https://github.com/yassinebenarbia/mplayer-client",
          // imageUrl: ''
        },
        {
          title: "mmp",
          description: "Command line utilities to manage passwords",
          link: "https://github.com/yassinebenarbia/mmp",
          // imageUrl: ''
        },
        {
          title: "MyNvim",
          description: "User oriented Neovim destribution",
          link: "https://github.com/yassinebenarbia/MyNvim",
          // imageUrl: ''
        },
        {
          title: "Graduation Project",
          description:
            "Graduation Project, an exposed MQTT API that leverage the power of AI for posture analysis of atheltic movements",
          link: "https://github.com/yassinebenarbia/Project",
          // imageUrl: ''
        },
      ],
    },
  },
  seo: {
    title: "Portfolio of Yassine Ben Arbia",
    description: "",
    imageURL: "",
  },
  social: {
    linkedin: "Yassine BenArbia",
    mastodon: "yassineba@mastodon.social",
    stackoverflow: "", // example: '1/jeff-atwood'
    website: "https://yassinebenarbia.github.io",
    matrix: "@theuserthatyoudontknow:matrix.org",
    email: "yassine.bna@proton.me",
  },
  resume: {
    fileUrl: "", // Empty fileUrl will hide the `Download Resume` button.
  },
  skills: [
    "Linux",
    "Rust",
    "C",
    "C++",
    "Nix",
    "IoT",
    "Embedded",
    "Networking",
    "Java",
    "JavaScript",
    "TypeScript",
    "Bash",
    "Lua",
    "Docker",
  ],
  experiences: [
    {
      company: "IOBIRD",
      position: "Intern",
      from: "July 2023",
      to: "September 2023",
      companyLink: "https://iobird.web.app/",
    },
    {
      company: "ISITCom",
      position: "Intern",
      from: "February 2024",
      to: "June 2024",
      companyLink: "https://isitcom.rnu.tn/",
    },
    {
      company: "Rotko Networks",
      position: "Software Developer",
      from: "November 2024",
      to: "November 2025",
      companyLink: "https://rotko.net/",
    },
  ],
  certifications: [],
  educations: [
    {
      institution:
        "Higher Instutue of Applied Mathematics and Informatics (ISSAT) in collaboration with Higher Institute of Scientific Applications and Technology (ISMAI) in Kairouan",
      degree:
        "Masters Degree in Data Science",
      year: "in progress",
    },
    {
      institution:
        "Higher Institute of Informatics and Communication Technologies (ISITCom)",
      degree:
        "Bachelor Degree in Computre Engeneering, Specialized in Embedded Systems and IoT",
      year: "2024",
    },
    {
      institution: "High School Othman Chatti - Sousse - Msaken (LOC)",
      degree: "CS Degree",
      year: "2021",
    },
  ],
  publications: [],
  googleAnalytics: {
    id: "", // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  },
  hotjar: {
    id: "",
    snippetVersion: 6,
  },
  themeConfig: {
    defaultTheme: "dim",

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: false,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: true,

    // Display the ring in Profile picture
    displayAvatarRing: true,

    // Available themes. To remove any theme, exclude from here.
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
      "procyon",
    ],

    // Custom theme, applied to `procyon` theme
    customTheme: {
      primary: "#fc055b",
      secondary: "#219aaf",
      accent: "#e8d03a",
      neutral: "#2A2730",
      "base-100": "#E3E3ED",
      "--rounded-box": "3rem",
      "--rounded-btn": "3rem",
    },
  },

  footer: `Made With <b>Love</b>`,

  blogs: {
    "hello-world": {
      title: "Hello World",
      path: "hello-world",
      tags: ["Misc"],
      desc: "My very first blog",
      date: new Date("2025-07-09"),
    },
  },

  enablePWA: true,
  books: [
    // title field is optional
    { "ISBN": "9780374533557", "status": "read", "title": "Thinking, Fast and Slow", "rating": 5.0 },
    { "ISBN": "9780061353239", "status": "read", "title": "Predictably Irrational", "rating": 4.0 },
    { "ISBN": "9780812993882", "status": "read", "title": "How We Learn The Surprising Truth About ...", "rating": 3.5 },
    { "ISBN": "9780811204811", "status": "read", "title": "No Longer Human", "rating": 4.0 },
    { "ISBN": "0198185219", "status": "read", "title": "1984", "rating": 4.5 },
    { "ISBN": "9781519099846", "status": "read", "title": "Thinking as a Science", "rating": 4.5 },
    { "ISBN": "9780140441185", "status": "read", "title": "Thus Spoke Zarathustra", "rating": 4.0 },
    { "ISBN": "9780151072552", "status": "read", "title": "Animal Farm", "rating": 4.3 },
    { "ISBN": "9781451683400", "status": "read", "title": "Free Will", "rating": 4.5 },
    { "ISBN": "9781451673319", "status": "read", "title": "Fahrenheit 451", "rating": 4.5 },
    { "ISBN": "9781784043209", "status": "read", "title": "Brave New World", "rating": 4.5 },
    { "ISBN": "9781676885634", "status": "read", "title": "White nights", "rating": 4.3 },
    { "ISBN": "9781501197277", "status": "read", "title": "The Courage to Be Disliked", "rating": 3.0 },
    { "ISBN": "9781250118363", "status": "read", "title": "Algorithms to live by", "rating": 5.0 },
    { "ISBN": "9781982518172", "status": "read", "title": "The Skeptics' Guide to the Universe", "rating": 4.0 },
    { "ISBN": "9781593278281", "status": "read", "title": "The Rust Programming Language" },
    { "ISBN": "9783319987392", "status": "read", "title": "Study guide to ISTQB" },
    { "ISBN": "9781685891244", "status": "read", "title": "Technofeudalism", "rating": 4.7 },
    { "ISBN": "9788197022272", "status": "read", "title": "How to Take Smart Notes" },
    { "ISBN": "9781612680019", "status": "read", "title": "Rich Dad Poor Dad", "rating": 3.0 },
    { "ISBN": "9781982150921", "status": "read", "title": "Tender is the flesh", "rating": 2.5 },
    { "ISBN": "9781787333826", "status": "read", "title": "Lapvona", "rating": 3.0 },

    { "ISBN": "9780525512196", "status": "reading", "title": "21 Lessons for the 21st Cetury" },
    { "ISBN": "9780521636452", "status": "reading", "title": "The Gay science" },
    { "ISBN": "9781614274865", "status": "reading", "title": "The problems of philosophy" },
    { "ISBN": "0486292568", "status": "reading", "title": "Wuthering Heights" },
    { "ISBN": "9781250118035", "status": "reading", "title": "The Lonely City Adventures in the Art of Being Alone" },
    { "ISBN": "9781250237231", "status": "reading", "title": "Permanent Record" },
    { "ISBN": "9781480402447", "status": "reading", "title": "The Art of Loving" },

    { "ISBN": "9780141195377", "status": "to-read", "title": "On the Genealogy of Morals" },
    { "ISBN": "9780199229758", "status": "to-read", "title": "Beauty: A Very Short Introduction" },
    { "ISBN": "9780521779135", "status": "to-read", "title": "Beyond Good and Evil" },
    { "ISBN": "9780571368709", "status": "to-read", "title": "Small Things Like These" },
    { "ISBN": "9780141439518", "status": "to-read", "title": "Pride and prejiduce" },
    { "ISBN": "9780679720201", "status": "to-read", "title": "The Stranger" },
    { "ISBN": "9781501110368", "status": "to-read", "title": "It ends with us" },
    { "ISBN": "9780804795098", "status": "to-read", "title": "The Burnout Society" },
    { "ISBN": "9780140447927", "status": "to-read", "title": "The Idiot" },
    { "ISBN": "9780881032475", "status": "to-read", "title": "The Stranger" },
    { "ISBN": "9780486415871", "status": "to-read", "title": "Crime and Punishment" },
    { "ISBN": "9780062316097", "status": "to-read", "title": "Sapiens" },
  ]
};

export default config;
