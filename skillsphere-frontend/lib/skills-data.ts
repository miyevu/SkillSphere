export interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoUrl?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  duration: string;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  students: number;
  rating: number;
  image: string;
  tags: string[];
  lessons: number;
  projects: number;
  instructor: {
    name: string;
    role: string;
    image: string;
  };
  requirements: string[];
  modules: Module[];
  fullDescription: string;
}

export const skillsData: Skill[] = [
  {
    id: 'web-dev-101',
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of HTML, CSS, and JavaScript to build responsive websites.',
    fullDescription: 'A comprehensive introduction to web development. This course covers HTML5 markup, CSS3 styling, and JavaScript fundamentals. You\'ll build responsive websites that work on all devices and learn best practices used by professional developers.',
    category: 'Web Development',
    difficulty: 'beginner',
    duration: '8 weeks',
    students: 1245,
    rating: 4.8,
    image: '🌐',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    lessons: 24,
    projects: 4,
    instructor: {
      name: 'John Mensah',
      role: 'Senior Web Developer',
      image: '👨‍💻'
    },
    requirements: ['Basic computer literacy', 'Text editor (VS Code)', 'Web browser'],
    modules: [
      {
        id: 'module-1',
        title: 'HTML Fundamentals',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-1', title: 'Introduction to HTML', duration: '45 min', description: 'Learn the basics of HTML and semantic markup' },
          { id: 'lesson-2', title: 'Forms and Input', duration: '60 min', description: 'Build interactive HTML forms with validation' },
          { id: 'lesson-3', title: 'Accessibility Basics', duration: '50 min', description: 'Make your HTML accessible to all users' }
        ]
      },
      {
        id: 'module-2',
        title: 'CSS Styling and Layouts',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-4', title: 'CSS Selectors and Specificity', duration: '55 min', description: 'Master CSS selectors and understand specificity' },
          { id: 'lesson-5', title: 'Flexbox and Grid', duration: '75 min', description: 'Learn modern layout techniques with Flexbox and CSS Grid' },
          { id: 'lesson-6', title: 'Responsive Design', duration: '65 min', description: 'Create responsive designs that work on all screen sizes' }
        ]
      },
      {
        id: 'module-3',
        title: 'JavaScript Fundamentals',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-7', title: 'JavaScript Basics', duration: '60 min', description: 'Variables, operators, and control flow' },
          { id: 'lesson-8', title: 'DOM Manipulation', duration: '70 min', description: 'Interact with HTML elements using JavaScript' },
          { id: 'lesson-9', title: 'Events and Interactivity', duration: '65 min', description: 'Handle user interactions with event listeners' }
        ]
      },
      {
        id: 'module-4',
        title: 'Project Integration',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-10', title: 'Building Your First Website', duration: '90 min', description: 'Combine HTML, CSS, and JavaScript into a complete project' }
        ]
      }
    ]
  },
  {
    id: 'react-advanced',
    title: 'Advanced React Development',
    description: 'Master React hooks, state management, and build production-ready applications.',
    fullDescription: 'Take your React skills to the next level. This course covers advanced patterns including custom hooks, context API, performance optimization, and production deployment. You\'ll build real-world applications and learn industry best practices.',
    category: 'Web Development',
    difficulty: 'advanced',
    duration: '10 weeks',
    students: 856,
    rating: 4.9,
    image: '⚛️',
    tags: ['React', 'Redux', 'Node.js', 'REST APIs'],
    lessons: 32,
    projects: 6,
    instructor: {
      name: 'Ama Osei',
      role: 'React Specialist',
      image: '👩‍💻'
    },
    requirements: ['React basics knowledge', 'JavaScript ES6+', 'Node.js installed', 'Git basics'],
    modules: [
      {
        id: 'module-1',
        title: 'React Hooks Deep Dive',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-1', title: 'useState and useEffect', duration: '60 min', description: 'Master state and side effects with hooks' },
          { id: 'lesson-2', title: 'Custom Hooks', duration: '75 min', description: 'Create reusable hook logic' },
          { id: 'lesson-3', title: 'useContext and useReducer', duration: '70 min', description: 'Advanced state management patterns' }
        ]
      },
      {
        id: 'module-2',
        title: 'State Management',
        duration: '2.5 weeks',
        lessons: [
          { id: 'lesson-4', title: 'Redux Fundamentals', duration: '90 min', description: 'Learn Redux actions, reducers, and store' },
          { id: 'lesson-5', title: 'Redux Toolkit', duration: '80 min', description: 'Modern Redux with Redux Toolkit' },
          { id: 'lesson-6', title: 'Async Actions', duration: '75 min', description: 'Handle async operations with Redux' }
        ]
      },
      {
        id: 'module-3',
        title: 'Performance Optimization',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-7', title: 'Memoization and Optimization', duration: '65 min', description: 'Optimize component rendering' },
          { id: 'lesson-8', title: 'Code Splitting', duration: '70 min', description: 'Split code for better performance' }
        ]
      },
      {
        id: 'module-4',
        title: 'Production Deployment',
        duration: '1.5 weeks',
        lessons: [
          { id: 'lesson-9', title: 'Build and Deploy', duration: '85 min', description: 'Deploy React apps to production' }
        ]
      }
    ]
  },
  {
    id: 'mobile-app-basics',
    title: 'Mobile App Development with Flutter',
    description: 'Build cross-platform mobile applications using Flutter and Dart.',
    fullDescription: 'Learn to build beautiful, fast mobile applications with Flutter. This course teaches you Dart programming, Flutter widgets, state management, and how to publish apps to iOS and Android app stores.',
    category: 'Mobile Development',
    difficulty: 'intermediate',
    duration: '12 weeks',
    students: 723,
    rating: 4.7,
    image: '📱',
    tags: ['Flutter', 'Dart', 'Mobile UI', 'Firebase'],
    lessons: 28,
    projects: 5,
    instructor: {
      name: 'Kofi Boateng',
      role: 'Flutter Developer',
      image: '👨‍💻'
    },
    requirements: ['Basic programming knowledge', 'Flutter SDK', 'Android Studio or Xcode', 'Dart basics'],
    modules: [
      {
        id: 'module-1',
        title: 'Dart Fundamentals',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-1', title: 'Dart Syntax', duration: '60 min', description: 'Learn Dart programming basics' },
          { id: 'lesson-2', title: 'Object-Oriented Dart', duration: '70 min', description: 'Classes, inheritance, and polymorphism' }
        ]
      },
      {
        id: 'module-2',
        title: 'Flutter Widgets',
        duration: '3 weeks',
        lessons: [
          { id: 'lesson-3', title: 'Stateful and Stateless Widgets', duration: '75 min', description: 'Understand Flutter widget types' },
          { id: 'lesson-4', title: 'UI Building', duration: '80 min', description: 'Create beautiful user interfaces' }
        ]
      },
      {
        id: 'module-3',
        title: 'State Management',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-5', title: 'Provider Pattern', duration: '70 min', description: 'Manage state with Provider' },
          { id: 'lesson-6', title: 'Advanced State', duration: '75 min', description: 'Complex state management scenarios' }
        ]
      },
      {
        id: 'module-4',
        title: 'Backend Integration',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-7', title: 'Firebase Integration', duration: '85 min', description: 'Connect to Firebase backend' }
        ]
      },
      {
        id: 'module-5',
        title: 'Publishing',
        duration: '1.5 weeks',
        lessons: [
          { id: 'lesson-8', title: 'App Store Publishing', duration: '90 min', description: 'Publish to iOS and Android stores' }
        ]
      }
    ]
  },
  {
    id: 'data-analysis-python',
    title: 'Data Analysis with Python',
    description: 'Learn data manipulation, visualization, and analysis using Python and popular libraries.',
    fullDescription: 'Master data analysis with Python. Learn to work with datasets, create meaningful visualizations, and extract insights using Pandas, NumPy, and Matplotlib. Perfect for data enthusiasts and aspiring data scientists.',
    category: 'Data Science',
    difficulty: 'intermediate',
    duration: '10 weeks',
    students: 2341,
    rating: 4.6,
    image: '📊',
    tags: ['Python', 'Pandas', 'Matplotlib', 'Statistical Analysis'],
    lessons: 26,
    projects: 5,
    instructor: {
      name: 'Dr. Yaw Opoku',
      role: 'Data Science Expert',
      image: '👨‍💼'
    },
    requirements: ['Python basics', 'Jupyter Notebook', 'Pandas library', 'Basic statistics knowledge'],
    modules: [
      {
        id: 'module-1',
        title: 'Data Fundamentals',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-1', title: 'Data Types and Structures', duration: '60 min', description: 'Understand data formats' },
          { id: 'lesson-2', title: 'Loading and Exploring Data', duration: '70 min', description: 'Read and explore datasets' }
        ]
      },
      {
        id: 'module-2',
        title: 'Data Cleaning and Preparation',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-3', title: 'Handling Missing Data', duration: '65 min', description: 'Deal with incomplete datasets' },
          { id: 'lesson-4', title: 'Data Transformation', duration: '75 min', description: 'Clean and transform data' }
        ]
      },
      {
        id: 'module-3',
        title: 'Data Visualization',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-5', title: 'Matplotlib Basics', duration: '70 min', description: 'Create visualizations' },
          { id: 'lesson-6', title: 'Advanced Plots', duration: '75 min', description: 'Create complex visualizations' }
        ]
      },
      {
        id: 'module-4',
        title: 'Statistical Analysis',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-7', title: 'Descriptive Statistics', duration: '65 min', description: 'Analyze data patterns' },
          { id: 'lesson-8', title: 'Hypothesis Testing', duration: '75 min', description: 'Statistical testing methods' }
        ]
      },
      {
        id: 'module-5',
        title: 'Real-world Projects',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-9', title: 'Project: Sales Analysis', duration: '120 min', description: 'Analyze real sales data' }
        ]
      }
    ]
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Essentials',
    description: 'Master SEO, social media marketing, content strategy, and analytics.',
    fullDescription: 'Complete guide to digital marketing. Learn SEO strategies, social media marketing, content creation, email marketing, and analytics. Drive traffic and conversions for any online business.',
    category: 'Marketing',
    difficulty: 'beginner',
    duration: '6 weeks',
    students: 1678,
    rating: 4.5,
    image: '📈',
    tags: ['SEO', 'Social Media', 'Analytics', 'Content Strategy'],
    lessons: 20,
    projects: 3,
    instructor: {
      name: 'Aba Mensah',
      role: 'Digital Marketing Manager',
      image: '👩‍💼'
    },
    requirements: ['Basic internet knowledge', 'Social media accounts', 'Google Analytics account'],
    modules: [
      {
        id: 'module-1',
        title: 'SEO Fundamentals',
        duration: '1.5 weeks',
        lessons: [
          { id: 'lesson-1', title: 'Keyword Research', duration: '50 min', description: 'Find profitable keywords' },
          { id: 'lesson-2', title: 'On-Page SEO', duration: '60 min', description: 'Optimize web pages' }
        ]
      },
      {
        id: 'module-2',
        title: 'Social Media Strategy',
        duration: '1.5 weeks',
        lessons: [
          { id: 'lesson-3', title: 'Platform Selection', duration: '45 min', description: 'Choose right platforms' },
          { id: 'lesson-4', title: 'Content Calendar', duration: '55 min', description: 'Plan social content' }
        ]
      },
      {
        id: 'module-3',
        title: 'Content Marketing',
        duration: '1 week',
        lessons: [
          { id: 'lesson-5', title: 'Content Strategy', duration: '60 min', description: 'Create content strategy' }
        ]
      },
      {
        id: 'module-4',
        title: 'Analytics and Measurement',
        duration: '1 week',
        lessons: [
          { id: 'lesson-6', title: 'Google Analytics Setup', duration: '50 min', description: 'Track website performance' }
        ]
      }
    ]
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Principles',
    description: 'Learn design thinking, user research, wireframing, and prototyping.',
    fullDescription: 'Master the art of creating beautiful and functional user interfaces. This course covers design thinking, user research methodologies, wireframing, prototyping, and usability testing.',
    category: 'Design',
    difficulty: 'beginner',
    duration: '8 weeks',
    students: 945,
    rating: 4.8,
    image: '🎨',
    tags: ['Figma', 'Design Thinking', 'User Research', 'Prototyping'],
    lessons: 22,
    projects: 4,
    instructor: {
      name: 'Akosua Boateng',
      role: 'UX Designer',
      image: '👩‍🎨'
    },
    requirements: ['Figma account', 'Design software', 'Basic design sense', 'Curiosity about user experience'],
    modules: [
      {
        id: 'module-1',
        title: 'Design Fundamentals',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-1', title: 'Design Principles', duration: '60 min', description: 'Learn core design principles' },
          { id: 'lesson-2', title: 'Color and Typography', duration: '65 min', description: 'Master colors and fonts' }
        ]
      },
      {
        id: 'module-2',
        title: 'User Research',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-3', title: 'Research Methods', duration: '70 min', description: 'Conduct user research' },
          { id: 'lesson-4', title: 'User Personas', duration: '60 min', description: 'Create user personas' }
        ]
      },
      {
        id: 'module-3',
        title: 'Prototyping with Figma',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-5', title: 'Figma Basics', duration: '75 min', description: 'Learn Figma tools' },
          { id: 'lesson-6', title: 'Interactive Prototypes', duration: '80 min', description: 'Create interactive prototypes' }
        ]
      },
      {
        id: 'module-4',
        title: 'Usability Testing',
        duration: '1 week',
        lessons: [
          { id: 'lesson-7', title: 'Testing Methods', duration: '60 min', description: 'Test your designs' }
        ]
      }
    ]
  },
  {
    id: 'cloud-computing-aws',
    title: 'Cloud Computing with AWS',
    description: 'Deploy and manage applications on Amazon Web Services cloud platform.',
    fullDescription: 'Learn to architect and deploy scalable applications on AWS. This course covers EC2, S3, RDS, Lambda, and other key services needed to build cloud-native applications.',
    category: 'Cloud Computing',
    difficulty: 'intermediate',
    duration: '9 weeks',
    students: 567,
    rating: 4.7,
    image: '☁️',
    tags: ['AWS', 'EC2', 'S3', 'Lambda', 'DevOps'],
    lessons: 25,
    projects: 5,
    instructor: {
      name: 'Kwaku Ansah',
      role: 'Cloud Architect',
      image: '👨‍💻'
    },
    requirements: ['AWS account', 'Linux basics', 'Networking knowledge', 'Programming experience'],
    modules: [
      {
        id: 'module-1',
        title: 'AWS Fundamentals',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-1', title: 'AWS Console Tour', duration: '60 min', description: 'Navigate AWS platform' },
          { id: 'lesson-2', title: 'IAM and Security', duration: '70 min', description: 'Manage access and security' }
        ]
      },
      {
        id: 'module-2',
        title: 'Compute Services',
        duration: '2.5 weeks',
        lessons: [
          { id: 'lesson-3', title: 'EC2 Instances', duration: '75 min', description: 'Launch and manage EC2' },
          { id: 'lesson-4', title: 'Lambda Functions', duration: '70 min', description: 'Serverless computing' }
        ]
      },
      {
        id: 'module-3',
        title: 'Storage and Databases',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-5', title: 'S3 Storage', duration: '65 min', description: 'Object storage with S3' },
          { id: 'lesson-6', title: 'RDS Databases', duration: '70 min', description: 'Managed databases' }
        ]
      },
      {
        id: 'module-4',
        title: 'Deployment and DevOps',
        duration: '1.5 weeks',
        lessons: [
          { id: 'lesson-7', title: 'Deployment Tools', duration: '60 min', description: 'Deploy with CI/CD' }
        ]
      }
    ]
  },
  {
    id: 'cybersecurity-basics',
    title: 'Cybersecurity Fundamentals',
    description: 'Understand network security, encryption, and best practices for data protection.',
    fullDescription: 'Protect systems and data from cyber threats. Learn about common vulnerabilities, security protocols, encryption techniques, and best practices for securing networks and applications.',
    category: 'Security',
    difficulty: 'beginner',
    duration: '7 weeks',
    students: 678,
    rating: 4.6,
    image: '🔒',
    tags: ['Network Security', 'Encryption', 'Compliance', 'Ethical Hacking'],
    lessons: 21,
    projects: 3,
    instructor: {
      name: 'Samson Kyei',
      role: 'Security Specialist',
      image: '👨‍💼'
    },
    requirements: ['Basic networking knowledge', 'Linux basics', 'Python basics'],
    modules: [
      {
        id: 'module-1',
        title: 'Security Fundamentals',
        duration: '1.5 weeks',
        lessons: [
          { id: 'lesson-1', title: 'Common Threats', duration: '55 min', description: 'Understand common cyber threats' },
          { id: 'lesson-2', title: 'Security Principles', duration: '60 min', description: 'Learn security basics' }
        ]
      },
      {
        id: 'module-2',
        title: 'Network Security',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-3', title: 'Firewalls and IDS', duration: '65 min', description: 'Network security tools' },
          { id: 'lesson-4', title: 'VPN and Encryption', duration: '70 min', description: 'Secure communications' }
        ]
      },
      {
        id: 'module-3',
        title: 'Application Security',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-5', title: 'Web App Security', duration: '70 min', description: 'Secure web applications' },
          { id: 'lesson-6', title: 'Penetration Testing', duration: '75 min', description: 'Test system security' }
        ]
      },
      {
        id: 'module-4',
        title: 'Compliance and Best Practices',
        duration: '1 week',
        lessons: [
          { id: 'lesson-7', title: 'Security Standards', duration: '60 min', description: 'Meet compliance requirements' }
        ]
      }
    ]
  },
  {
    id: 'machine-learning-basics',
    title: 'Machine Learning Basics',
    description: 'Get started with ML algorithms, model training, and practical projects.',
    fullDescription: 'Introduction to machine learning. Learn supervised and unsupervised learning, build prediction models, and apply ML to real-world problems. No advanced math required!',
    category: 'AI & ML',
    difficulty: 'advanced',
    duration: '12 weeks',
    students: 812,
    rating: 4.8,
    image: '🤖',
    tags: ['Python', 'TensorFlow', 'Scikit-learn', 'Deep Learning'],
    lessons: 30,
    projects: 6,
    instructor: {
      name: 'Dr. Adeyemi Taiwo',
      role: 'ML Engineer',
      image: '👨‍💼'
    },
    requirements: ['Python advanced', 'Math (algebra, calculus basics)', 'Pandas and NumPy', 'Jupyter Notebook'],
    modules: [
      {
        id: 'module-1',
        title: 'ML Fundamentals',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-1', title: 'ML Basics', duration: '70 min', description: 'Understand machine learning' },
          { id: 'lesson-2', title: 'Supervised vs Unsupervised', duration: '65 min', description: 'Different learning approaches' }
        ]
      },
      {
        id: 'module-2',
        title: 'Regression and Classification',
        duration: '3 weeks',
        lessons: [
          { id: 'lesson-3', title: 'Linear Regression', duration: '80 min', description: 'Build regression models' },
          { id: 'lesson-4', title: 'Classification Models', duration: '85 min', description: 'Build classifiers' }
        ]
      },
      {
        id: 'module-3',
        title: 'Advanced Topics',
        duration: '3 weeks',
        lessons: [
          { id: 'lesson-5', title: 'Neural Networks', duration: '90 min', description: 'Deep learning basics' },
          { id: 'lesson-6', title: 'TensorFlow and Keras', duration: '85 min', description: 'Build neural networks' }
        ]
      },
      {
        id: 'module-4',
        title: 'Real-world Projects',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-7', title: 'Project: Predictive Model', duration: '150 min', description: 'Build complete ML project' }
        ]
      }
    ]
  },
  {
    id: 'graphic-design-canva',
    title: 'Graphic Design with Canva',
    description: 'Create professional graphics, social media posts, and marketing materials.',
    fullDescription: 'Master Canva to create professional-looking designs without expensive software. Learn design basics, create social media graphics, presentations, and marketing materials.',
    category: 'Design',
    difficulty: 'beginner',
    duration: '4 weeks',
    students: 2156,
    rating: 4.4,
    image: '🖼️',
    tags: ['Canva', 'Visual Design', 'Branding', 'Social Media'],
    lessons: 16,
    projects: 4,
    instructor: {
      name: 'Grace Amoah',
      role: 'Graphic Designer',
      image: '👩‍🎨'
    },
    requirements: ['Canva account (free)', 'Basic design sense', 'Internet connection'],
    modules: [
      {
        id: 'module-1',
        title: 'Canva Basics',
        duration: '1 week',
        lessons: [
          { id: 'lesson-1', title: 'Canva Walkthrough', duration: '45 min', description: 'Learn Canva interface' },
          { id: 'lesson-2', title: 'Templates and Elements', duration: '50 min', description: 'Use templates and elements' }
        ]
      },
      {
        id: 'module-2',
        title: 'Social Media Design',
        duration: '1 week',
        lessons: [
          { id: 'lesson-3', title: 'Social Media Posts', duration: '55 min', description: 'Design for social platforms' },
          { id: 'lesson-4', title: 'Branding Consistency', duration: '50 min', description: 'Maintain brand identity' }
        ]
      },
      {
        id: 'module-3',
        title: 'Advanced Designs',
        duration: '1 week',
        lessons: [
          { id: 'lesson-5', title: 'Infographics', duration: '60 min', description: 'Create infographics' }
        ]
      },
      {
        id: 'module-4',
        title: 'Projects and Portfolio',
        duration: '1 week',
        lessons: [
          { id: 'lesson-6', title: 'Portfolio Pieces', duration: '70 min', description: 'Create portfolio designs' }
        ]
      }
    ]
  },
  {
    id: 'backend-nodejs',
    title: 'Backend Development with Node.js',
    description: 'Build scalable APIs and server-side applications using Node.js and Express.',
    fullDescription: 'Master backend development with Node.js and Express. Build RESTful APIs, handle databases, implement authentication, and deploy to production.',
    category: 'Web Development',
    difficulty: 'intermediate',
    duration: '10 weeks',
    students: 934,
    rating: 4.7,
    image: '🖥️',
    tags: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
    lessons: 28,
    projects: 5,
    instructor: {
      name: 'Nana Asare',
      role: 'Backend Developer',
      image: '👨‍💻'
    },
    requirements: ['JavaScript ES6+', 'Node.js installed', 'MongoDB basics', 'Postman API tool'],
    modules: [
      {
        id: 'module-1',
        title: 'Node.js Fundamentals',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-1', title: 'Node.js Setup', duration: '50 min', description: 'Install and setup Node.js' },
          { id: 'lesson-2', title: 'NPM and Modules', duration: '60 min', description: 'Manage packages with NPM' }
        ]
      },
      {
        id: 'module-2',
        title: 'Express Framework',
        duration: '2.5 weeks',
        lessons: [
          { id: 'lesson-3', title: 'Express Basics', duration: '70 min', description: 'Build Express servers' },
          { id: 'lesson-4', title: 'REST APIs', duration: '75 min', description: 'Create RESTful endpoints' }
        ]
      },
      {
        id: 'module-3',
        title: 'Database Integration',
        duration: '2 weeks',
        lessons: [
          { id: 'lesson-5', title: 'MongoDB Setup', duration: '65 min', description: 'Connect to MongoDB' },
          { id: 'lesson-6', title: 'CRUD Operations', duration: '70 min', description: 'Read and write data' }
        ]
      },
      {
        id: 'module-4',
        title: 'Authentication and Deployment',
        duration: '1.5 weeks',
        lessons: [
          { id: 'lesson-7', title: 'User Authentication', duration: '75 min', description: 'Implement JWT auth' }
        ]
      }
    ]
  },
  {
    id: 'video-editing',
    title: 'Video Editing & Content Creation',
    description: 'Learn video production, editing, and create engaging video content.',
    fullDescription: 'Create professional-quality videos. Learn video editing basics, color grading, audio editing, effects, and how to create engaging content for YouTube and social media.',
    category: 'Content Creation',
    difficulty: 'beginner',
    duration: '6 weeks',
    students: 1423,
    rating: 4.5,
    image: '🎬',
    tags: ['Adobe Premiere', 'DaVinci Resolve', 'Video Marketing', 'YouTube'],
    lessons: 18,
    projects: 4,
    instructor: {
      name: 'Kwesi Boakye',
      role: 'Video Producer',
      image: '👨‍🎥'
    },
    requirements: ['Editing software (Premiere Pro or DaVinci Resolve)', 'Sample footage', 'Basic computer skills'],
    modules: [
      {
        id: 'module-1',
        title: 'Video Editing Basics',
        duration: '1.5 weeks',
        lessons: [
          { id: 'lesson-1', title: 'Editing Interface', duration: '55 min', description: 'Learn editing software' },
          { id: 'lesson-2', title: 'Basic Cuts and Transitions', duration: '60 min', description: 'Edit video clips' }
        ]
      },
      {
        id: 'module-2',
        title: 'Advanced Editing',
        duration: '1.5 weeks',
        lessons: [
          { id: 'lesson-3', title: 'Color Grading', duration: '65 min', description: 'Grade video footage' },
          { id: 'lesson-4', title: 'Effects and Motion', duration: '70 min', description: 'Add effects to videos' }
        ]
      },
      {
        id: 'module-3',
        title: 'Audio Editing',
        duration: '1 week',
        lessons: [
          { id: 'lesson-5', title: 'Sound Mixing', duration: '60 min', description: 'Mix audio tracks' }
        ]
      },
      {
        id: 'module-4',
        title: 'Content Creation for Social Media',
        duration: '1 week',
        lessons: [
          { id: 'lesson-6', title: 'YouTube Optimization', duration: '55 min', description: 'Optimize for YouTube' }
        ]
      }
    ]
  }
];

export const categories = [
  'All Skills',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Marketing',
  'Design',
  'Cloud Computing',
  'Security',
  'AI & ML',
  'Content Creation'
];

export const difficulties = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];
