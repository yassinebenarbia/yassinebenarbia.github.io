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
  ],
  certifications: [],
  educations: [
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
};

export default config;
