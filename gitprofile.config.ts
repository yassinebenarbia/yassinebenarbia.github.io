// gitprofile.config.ts

const CONFIG = {
  github: {
    username: 'yassinebenarbia', // Your GitHub org/user name. (This is the only required config)
  },
  /**
   * If you are deploying to https://<USERNAME>.github.io/, for example your repository is at https://github.com/arifszn/arifszn.github.io, set base to '/'.
   * If you are deploying to https://<USERNAME>.github.io/<REPO_NAME>/,
   * for example your repository is at https://github.com/arifszn/portfolio, then set base to '/portfolio/'.
   */
  base: '/',
  projects: {
    github: {
      display: true, // Display GitHub projects?
      header: 'Github Projects',
      mode: 'automatic', // Mode can be: 'automatic' or 'manual'
      automatic: {
        sortBy: 'updated', // Sort projects by 'stars' or 'updated'
        limit: 4, // How many projects to display.
        exclude: {
          forks: false, // Forked projects will not be displayed if set to true.
          projects: [], // These projects will not be displayed. example: ['arifszn/my-project1', 'arifszn/my-project2']
        },
      },
      manual: {
        // Properties for manually specifying projects
        projects: ['yassinebenarbia/mmp', 'yassinebenarbia/tomodoro', 'yassinebenarbia/Project'], // List of repository names to display. example: ['arifszn/my-project1', 'arifszn/my-project2']
      },
    },
    external: {
      header: 'My Projects',
      // To hide the `External Projects` section, keep it empty.
      projects: [
        {
          title: 'Tomodoro',
          description: 'Pomodor timer on the terminal',
          // imageUrl: ''
          link: 'https://github.com/yassinebenarbia/tomodoro',
        },
        {
          title: 'mmp',
          description: 'Command line utilities to manage passwords',
          // imageUrl: ''
          link: 'https://github.com/yassinebenarbia/mmp',
        },
        {
          title: 'MyNvim',
          description: 'User oriented Neovim destribution',
          // imageUrl: ''
          link: 'https://github.com/yassinebenarbia/MyNvim',
        },
        {
          title: 'Graduation Project',
          description: 'Graduation Project, an exposed MQTT API that leverage the power of AI for posture analysis of atheltic movements',
          // imageUrl: ''
          link: 'https://github.com/yassinebenarbia/Project',
        },
      ],
    },
  },
  seo: {
    title: 'Portfolio of Yassine Ben Arbia',
    description: '',
    imageURL: '',
  },
  social: {
    linkedin: 'Yassine BenArbia',
    mastodon: 'yassineba@mastodon.social',
    stackoverflow: '', // example: '1/jeff-atwood'
    website: 'https://yassinebenarbia.github.io',
    matrix: '@theuserthatyoudontknow:matrix.org',
    email: 'yassine.bna@proton.me',
  },
  resume: {
    fileUrl: '', // Empty fileUrl will hide the `Download Resume` button.
  },
  skills: [
    'Linux',
    'Rust',
    'C',
    'C++',
    'Nix',
    'IoT',
    'Embedded',
    'Networking',
    'Java',
    'JavaScript',
    'TypeScript',
    'Bash',
    'Lua',
    'Docker',
  ],
  experiences: [
    {
      company: 'IOBIRD',
      position: 'Intern',
      from: 'July 2023',
      to: 'September 2023',
      companyLink: 'https://iobird.web.app/',
    },
    {
      company: 'ISITCom',
      position: 'Intern',
      from: 'February 2024',
      to: 'June 2024',
      companyLink: 'https://isitcom.rnu.tn/',
    },
  ],
  certifications: [],
  educations: [
    {
      institution: 'Higher Institute of Informatics and Communication Technologies (ISITCom)',
      degree: 'Bachelor Degree in Computre Engeneering, Specialized in Embedded Systems and IoT',
      year: '2024',
    },
    {
      institution: 'High School Othman Chatti - Sousse - Msaken (LOC)',
      degree: 'CS Degree',
      year: '2021',
    },
  ],
  publications: [],
  // Display articles from your medium or dev account. (Optional)
  googleAnalytics: {
    id: '', // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  },
  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: {
    id: '',
    snippetVersion: 6,
  },
  themeConfig: {
    defaultTheme: 'dark',

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
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
      'procyon',
    ],

    // Custom theme, applied to `procyon` theme
    customTheme: {
      primary: '#fc055b',
      secondary: '#219aaf',
      accent: '#e8d03a',
      neutral: '#2A2730',
      'base-100': '#E3E3ED',
      '--rounded-box': '3rem',
      '--rounded-btn': '3rem',
    },
  },

  // Optional Footer. Supports plain text or HTML.
  footer: `Made With <b>Love</b> and <b>Passion</b>`,

  enablePWA: true,
};

export default CONFIG;
