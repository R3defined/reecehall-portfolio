
import portfolio from './projects/portfolio.json';


interface Competition {
    title: string;
    year: string;
    achievement: string;
}

export const userConfig = {
    // Personal Information
    name: 'Reece Hall',
    role: 'Software Developer - Full Stack Developer',
    location: 'Detroit, Mi',
    email: 'Reece@Redefinedlabs.io',
    website: 'reecehall.com',
    roleFocus: 'Full Stack Development using React, Node.js, and Bootstrap. Can also work with Angular, React, and Node.js.',
    age: 25,    
    profilePicture: 'https://avatars.githubusercontent.com/u/92007320?v=4',

    // Social Links
    social: {
        github: 'https://github.com/R3defined',
        linkedin: 'https://www.linkedin.com/in/Redefinedreece/', // Add your LinkedIn URL
    },

    // Contact Information
    contact: {
        email: 'Reece@Redefinedlabs.io',
        phone: '+5869609311', // Add your phone number
        calendly: 'https://calendly.com/hallmaurice31/one-on-one', // Add your Calendly URL
    },

    // Spotify Configuration
    spotify: {
        playlistId: '5hmeg2ngrrAFbz1Gu05PXi', // Your Spotify playlist ID
        playlistName: 'Coding-Time',
    },

    // Resume Configuration
    resume: {
        url: 'https://drive.google.com/file/d/1TdjEFZ0AmoOvAsbvDdF98R3inEJmFrLM/view',
        localPath: '/resume.pdf',
    },

    // Education Background
    education: [
        {
            degree: "Bachelor of Science",
            major: "Cybersecurity (Computer Science concentration)",
            institution: "Southern New Hampshire University",
            location: "Manchester, NH",
            year: "April 2023 - Present",
            description: "Statistical modeling and predictive analytics on community skate park design. Data visualization and engineering models for local government presentations.",
            images: [
                {
                    url: "https://news.elearninginside.com/wp-content/uploads/2017/11/snhu-online-degree-cost-768x509.jpg",
                    alt: "SNHU",
                    description: "SNHU Campus"
                }
            ]
        }
    ],

    courses: [
        {
            title: "Quantitative Analysis",
            description: "Applied statistical modeling, data visualization, and risk assessment to real-world engineering designs. Presented analytical findings to public stakeholders for community development.",
            institution: "Southern New Hampshire University",
            location: "Manchester, NH",
            year: "2023-2024",
            images: [
                {
                    url: "https://news.elearninginside.com/wp-content/uploads/2017/11/snhu-online-degree-cost-768x509.jpg",
                    alt: "SNHU",
                    description: "SNHU Campus"
                }
            ]
        },
        {
            title: "Python for Everybody Specialization",
            description: "A beginner's guide to programming using Python.",
            institution: "University of Michigan",
            location: "Remote",
            year: "2024",
            images: [
                {
                    url: "https://en.m.wikipedia.org/wiki/File:University_of_Michigan_logo.svg",
                    alt: "Coursera",
                    // description: "Coursera Logo"
                }
            ]
        }
    ],

    skills: [
        "Linux (Ubuntu, Debian, Redhat)",
        "Windows Server",
        "macOS",
        "Python",
        "C#",
        "ASP.NET Core",
        "Entity Framework",
        "SQL Server",
        "C++",
        "Java",
        "Spring Boot",
        "Hibernate",
        "JavaScript",
        "Bash",
        "PowerShell",
        "TypeScript",
        "Go",
        "Swift",
        "React",
        "Node.js",
        "MongoDB",
        "MySQL",
        "Docker",
        "HTML",
        "CSS",
        "Bootstrap",
        "Tailwind",
        "AWS",
        "Azure",
        "Google Cloud",
        "VPN (WireGuard, OpenVPN)",
        "Firewall Management",
        "Zero Trust Security",
        "SIEM (Wazuh, Splunk)",
        "Endpoint Protection",
        "VMware ESXi",
        "Hyper-V",
        "Proxmox",
        "Docker",
        "OpenAI API",
        "Llama 3",
        "Zapier",
        "AI Model Deployment",
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "PowerVault SAN",
        "Active Directory",
        "Jamf",
        "Intune",
        "Addigy",
        "MDM Configuration",
    ],

    extraCurricularRoles: [
        {
            role: "Vice President",
            institution: "Recession Proof",
            location: "Detroit, Mi",
            year: "2023-2024",
            images: [
                {
                    url: "https://media.licdn.com/dms/image/v2/D562DAQE-Pny0i1PjTg/profile-treasury-image-shrink_1280_1280/profile-treasury-image-shrink_1280_1280/0/1713570224488?e=1750395600&v=beta&t=AKJ47xRq1HzrY9CXxOkU_id5AfyALYA52TjLNJ_vkfI",
                    alt: "Recession Proof",
                    // description: "Recession Proof "
                },
                {
                    url: "https://media.licdn.com/dms/image/v2/D562DAQESHkMleyZzcQ/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1713570281322?e=1750395600&v=beta&t=cKqv_BXU666dqVyLE6ErYyA3XSAvu70j5DR_asQ8p30",
                    alt: "Recession Proof",
                    // description: "Recession Proof "
                },
              
            ]
        },
        {
            role: "Student Developer",
            institution: "Apple Developer Academy",
            location: "Detroit, Mi",
            year: "2024-2025",
            images: [
                {
                    url: "https://media.licdn.com/dms/image/v2/D562DAQEibz-XHJZaYg/profile-treasury-image-shrink_1280_1280/B56ZdnroaoHQAQ-/0/1749791182557?e=1750399200&v=beta&t=zpO0KKwk-nN2vTAUQ3V2h0YWopByhg7e0ktJRaqBOX8",
                    alt: "Apple Developer Academy",
                    // description: "Apple Developer Academy"
                }
            ]
        },

    ],

    extraCurricularActivities: [
        {
            title: "Home Lab Development",
            description: "Developed personal home lab environments for IT infrastructure experimentation.",
            institution: "Personal Project",
            location: "Detroit, MI",
            year: "2023-Present"
        },
        {
            title: "Robotics and Automation",
            description: "Participated in robotics and automation projects.",
            institution: "Personal Project",
            location: "Detroit, MI",
            year: "2023-Present"
        },
        {
            title: "Community Development",
            description: "Engaged in community development initiatives and outreach programs.",
            institution: "Community Programs",
            location: "Detroit, MI",
            year: "2023-Present"
        },
        {
            title: "Web Development",
            description: "Built personal web development and design projects.",
            institution: "Personal Project",
            location: "Detroit, MI",
            year: "2023-Present"
        },
        {
            title: "AI and Cloud Studies",
            description: "Conducted independent studies in AI, machine learning, and cloud architecture.",
            institution: "Self-Study",
            location: "Detroit, MI",
            year: "2023-Present"
        }
    ],
    competitions: [] as Competition[],

    // Professional Experience
    experience: [
        {
            title: "IT Systems Administrator",
            company: "SMZ Advertising",
            location: "Troy, MI",
            period: "Feb 2024 - Present",
            description: "Implemented backup, disaster recovery, and modernization strategies improving system resilience and uptime. Integrated emerging technologies optimizing security and scalability.",
            technologies: ["Backup Systems", "Disaster Recovery", "System Monitoring", "Infrastructure Modernization"]
        },
        {
            title: "Lead System Architect",
            company: "Redefined Solutions",
            location: "Detroit, MI",
            period: "Jan 2023 - Present",
            description: "Architected cloud-native and AI-driven automation systems optimizing workflows and reducing costs. Led AI, DevOps, and cybersecurity deployments improving infrastructure scalability, compliance, and performance.",
            technologies: ["Cloud Architecture", "AI Automation", "DevOps", "Cybersecurity", "Kubernetes", "Python"]
        },
        {
            title: "Technical Support Engineer",
            company: "Apple",
            location: "Troy, MI",
            period: "May 2021 - Present",
            description: "Provided diagnostics, preventive maintenance, and customer support for Apple devices. Contributed technical feedback to enhance internal diagnostic tools and support processes.",
            technologies: ["Hardware Diagnostics", "Software Support", "Customer Service", "Technical Documentation"]
        }
    ],

    // SEO Configuration
    seo: {
        title: 'Reece Hall - Software Developer',
        description: 'Software Developer based in Detroit, Mi specializing in React, Node.js, and modern web technologies',
        keywords: ['Software Developer', 'React', 'Node.js', 'Web Development', 'Detroit, Mi'],
    },

    // Theme Configuration
    theme: {
        primaryColor: '#1ED760', // Spotify green
        secondaryColor: '#1d1d1f',
        accentColor: '#007AFF',
    },

    // Projects Configuration
    projects: [
        portfolio,
        
        // Add more projects here
    ]
} as const; 