export interface ContactInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  linkedinUrl: string;
  resumeUrl: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ExperienceProject {
  name: string;
  period: string;
  bullets: string[];
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location?: string;
  projects: ExperienceProject[];
}

export interface EducationEntry {
  degree: string;
  school: string;
  period: string;
  score: string;
}

export interface FeaturedProject {
  name: string;
  period: string;
  company: string;
  description: string;
  highlights: string[];
  tags: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  description: string;
  skills: string[];
  badgeImage: string;
  credentialUrl: string;
}

export const contact: ContactInfo = {
  name: "Boopalan M",
  title: "SAP ABAP & BTP Consultant",
  location: "Sankagiri, Salem, Tamil Nadu, India",
  email: "boopalan020@gmail.com",
  phone: "+91 88259 71005",
  linkedin: "linkedin.com/in/boopalan020",
  linkedinUrl: "https://www.linkedin.com/in/boopalan020",
  resumeUrl: "/Boopalan_M_Resume.pdf",
};

export const summary =
  "I am an SAP ABAP and SAP BTP Consultant with almost five years of hands-on experience, delivering S/4HANA implementations, building automation solutions on BTP, and developing integrations using SAP CAP. My expertise spans ABAP, CDS, OData, SAP CAP, UI5, Adobe Forms, and a basic working understanding of the ABAP RESTful Application Programming Model (RAP) for service-oriented and clean-core aligned development. I have also worked closely with SD and MM processes in both enterprise and migration projects, giving me strong techno-functional exposure.";

export const skills: SkillCategory[] = [
  {
    category: "ABAP Development & Enhancements",
    items: [
      "Reports (Classical, Interactive, ALV)",
      "Module Pool Programming",
      "Object-Oriented ABAP",
      "Enhancements",
      "BAPIs",
      "BADIs",
      "Debugging",
    ],
  },
  {
    category: "ABAP CDS & OData Services",
    items: ["CDS View Modeling", "Service Exposure", "Deep-Entity OData Services"],
  },
  {
    category: "SAP S/4HANA Application Development",
    items: ["Custom Developments & Extensions", "SD & MM Business Scenarios"],
  },
  {
    category: "SAP BTP Application Development",
    items: ["Business Application Studio", "Cloud Foundry"],
  },
  {
    category: "CAP-based Backend & Middleware",
    items: ["SAP CAP (CAPM – Node.js)", "BPA / S4HANA / HANA Cloud Integration"],
  },
  {
    category: "SAP Build Process Automation & Workflow",
    items: ["Build Process Automation", "Forms", "Desktop Agent Integration"],
  },
  {
    category: "SAPUI5 & Frontend Development",
    items: ["UI5 Freestyle", "Flexible Programming Model", "Annotations", "Role-based UI"],
  },
  {
    category: "Adobe Forms & Output Management",
    items: ["Purchase Order", "Sales Order", "Goods Receipt", "Complex Layouts"],
  },
  {
    category: "Integration & Cloud Services",
    items: [
      "OData Integrations",
      "BTP Connectivity & Destinations",
      "Document Information Extraction",
      "Object Store",
      "SAP HANA Cloud",
    ],
  },
  {
    category: "Techno-Functional Expertise (SD & MM)",
    items: ["Order-to-Cash", "Procure-to-Pay", "Forms, Reports & Workflows"],
  },
  {
    category: "Other Frontend Exposure",
    items: ["React", "Angular", "JavaScript", "Node.js", "Express", "Flutter"],
  },
];

export const experience: ExperienceEntry[] = [
  {
    company: "IT-Resonance Inc Pvt. Ltd",
    role: "SAP ABAP Consultant",
    period: "Mar 2024 – Present",
    location: "Chennai, India",
    projects: [
      {
        name: "Southern Pump Tank Company – SPATCO Energy Solutions",
        period: "Sept 2025 – Present",
        bullets: [
          "Prepared and enabled the technical environment for Message Broker integration, including deployment on SAP BTP Cloud Foundry.",
          "Set up and confirmed technical connectivity between SAP S/4HANA and SAP Field Service Management (FSM) across Sandbox, Development, and Quality systems.",
          "Configured SOA Manager services for secure integration between SAP S/4HANA and FSM via Message Broker.",
          "Supported the SAP Basis team during SUM activities, including SPAU and SPDD changes.",
          "Conducted custom code remediation using ATC to ensure S/4HANA readiness, replacing custom REST API classes with standard SAP classes for clean-core compliance.",
          "Documented remediation activities and functional delta changes from the ECC to S/4HANA migration.",
          "Supported SIT, UAT, and regression testing; validated SAP Query variants and third-party portal and SQL Server/SharePoint integrations.",
        ],
      },
      {
        name: "CF Industries – Clean Energy S/4 Implementation",
        period: "Oct 2024 – Jun 2025",
        bullets: [
          "Analyzed customer requirements for Clean Energy Materials implementation in an SAP S/4HANA on-premise environment.",
          "Developed custom reports to automate Clean Energy sales order creation from contracts on scheduled intervals.",
          "Built reporting solutions to automate internal plant processes, including delivery creation and reversal workflows.",
          "Resolved Adobe Forms issues to ensure seamless document processing.",
          "Enhanced SD business processes for Clean Energy materials across the order-to-cash cycle.",
          "Developed legal entity program functionality aligned with regulatory requirements.",
        ],
      },
      {
        name: "BTP Invoice Automation – Proof of Concept",
        period: "Mar 2024 – Sept 2025",
        bullets: [
          "Identified customer pain points and architected an automated invoice processing solution across SAP BTP.",
          "Combined Build Process Automation, Desktop Agent, BTP Connectivity, CAP, Flexible Programming Model, Build Workzone, Document Information Extraction, Object Store, OData, ABAP CDS, and Business Application Studio.",
          "Built an administrative application for monitoring automation execution and performance metrics.",
          "Implemented a CAP-based backend as middleware integrating BPA, S/4HANA, and SAP HANA Cloud.",
          "Created a role-based frontend using the Flexible Programming Model with advanced annotations and semantics.",
          "Deployed the solution to SAP BTP and integrated it into SAP Build Workzone for customer adoption.",
        ],
      },
    ],
  },
  {
    company: "Kaar Technologies Pvt. Ltd",
    role: "Associate ABAP Consultant",
    period: "Dec 2020 – Feb 2024",
    location: "Chennai, India",
    projects: [
      {
        name: "Municipal Group of Corporation – Timesheet Application",
        period: "Oct 2023 – Feb 2024",
        bullets: [
          "Analyzed business requirements for a customized Timesheet Application for construction and production workforce management.",
          "Presented the strategic benefits of an SAP BTP-based solution to address the customer's challenges.",
          "Designed application interfaces in Figma aligned with customer specifications.",
          "Configured Business Application Studio and built the app using UI5 Freestyle methodology.",
          "Integrated SAP Build Process Automation for timesheet approval workflows and custom form templates.",
          "Connected SAP SuccessFactors to manage hierarchical visibility of worker and manager profiles.",
          "Deployed the application to SAP BTP Cloud Foundry from Business Application Studio.",
        ],
      },
      {
        name: "Mitsubishi Electric Automation – Implementation",
        period: "May 2022 – Aug 2023",
        bullets: [
          "Worked across Prepare, Explore, and Realize phases under Activate methodology — secondary MM consultant through Explore, primary technical consultant in Realize.",
          "Configured PR, PO, Scheduling Agreement, Contracts, Output Determination, EDI-IDoc, and Flexible Workflow.",
          "Customized Sales Order forms and developed Adobe Forms for Purchase Order, Sales Order, and Goods Receipt with complex layouts.",
          "Developed Function Modules for SD/MM integration and a custom Module Pool program added as a menu option in the Sales Order transaction.",
          "Built custom development to save DMS documents to an FTP location and enhanced the QM notification transaction.",
        ],
      },
      {
        name: "METUS – Hypercare Support",
        period: "Mar 2022 – Apr 2022",
        bullets: [
          "Handled EWM container issues raised by the business and updated master data via LSMW.",
          "Resolved hypercare tickets for MM and SD forms, enhancements, and reports.",
          "Delivered change requests including sales report creation and customer invoice form development.",
        ],
      },
      {
        name: "SANTEN – Documentation",
        period: "Jan 2022 – Feb 2022",
        bullets: [
          "Documented differences between SAP ECC and the latest S/4HANA system.",
          "Analyzed and documented 15+ standard global scope items for Material Management and Sales & Distribution, presented to SANTEN.",
        ],
      },
      {
        name: "Training and Application Development",
        period: "Dec 2020 – Aug 2021",
        bullets: [
          "Trained across ABAP, Adobe Forms, Web Services, Function Modules, Enhancements, PI/PO, UI5, and Workflow, plus SD, MM, HCM, FI, PP, PM, EHSM, and QM functional modules.",
          "Trained in Angular, Node.js, Express, and Flutter.",
          "Developed an ERP portal covering 7 applications spanning core requirements from each SAP functional module.",
        ],
      },
    ],
  },
];

export const education: EducationEntry[] = [
  {
    degree: "Bachelor of Computer Science & Engineering",
    school: "Kongu Engineering College, Perundurai, Erode, India",
    period: "2017 – 2021",
    score: "9.03 CGPA",
  },
  {
    degree: "Higher Secondary School (Computer Science)",
    school: "Malar Matric Higher Secondary School, Paramathi, Velur",
    period: "2015 – 2017",
    score: "94.5%",
  },
  {
    degree: "SSLC",
    school: "Government Boys Higher Secondary School, Sankagiri, Salem",
    period: "2015",
    score: "93.2%",
  },
];

export const featuredProjects: FeaturedProject[] = [
  {
    name: "BTP Invoice Automation – Proof of Concept",
    period: "Mar 2024 – Sept 2025",
    company: "IT-Resonance Inc",
    description:
      "End-to-end automated invoice processing platform architected across SAP BTP, combining process automation, document extraction, and a CAP-based integration layer.",
    highlights: [
      "CAP-based middleware integrating BPA, S/4HANA, and SAP HANA Cloud",
      "Role-based Fiori/FPM frontend with annotations & semantics",
      "Admin app for monitoring automation execution and performance",
      "Deployed to SAP BTP and published via SAP Build Workzone",
    ],
    tags: ["SAP BTP", "CAP (Node.js)", "BPA", "Document Information Extraction", "Fiori/FPM"],
  },
  {
    name: "SPATCO – S/4HANA / FSM Integration & Clean-Core Remediation",
    period: "Sept 2025 – Present",
    company: "IT-Resonance Inc",
    description:
      "Technical integration between SAP S/4HANA and SAP Field Service Management via Message Broker on BTP Cloud Foundry, alongside clean-core custom code remediation for an ECC to S/4HANA migration.",
    highlights: [
      "Message Broker deployment & SOA Manager configuration on Cloud Foundry",
      "Custom code remediation with ATC for S/4HANA readiness",
      "Replaced custom REST handling with standard SAP clean-core classes",
      "SIT/UAT/regression testing and third-party portal integration support",
    ],
    tags: ["SAP BTP", "S/4HANA", "Field Service Management", "ATC", "Clean Core"],
  },
  {
    name: "CF Industries – Clean Energy S/4HANA Implementation",
    period: "Oct 2024 – Jun 2025",
    company: "IT-Resonance Inc",
    description:
      "Custom development for a Clean Energy Materials rollout on SAP S/4HANA on-premise, automating sales-order and delivery processes across the order-to-cash cycle.",
    highlights: [
      "Automated sales order creation from contracts on scheduled intervals",
      "Delivery creation & reversal workflow automation",
      "Adobe Forms fixes for seamless document processing",
      "Legal entity program aligned to regulatory requirements",
    ],
    tags: ["S/4HANA", "ABAP", "Adobe Forms", "SD"],
  },
  {
    name: "Municipal Group of Corporation – Timesheet Application",
    period: "Oct 2023 – Feb 2024",
    company: "Kaar Technologies",
    description:
      "A custom BTP timesheet application for construction and production workforce management, from Figma design through deployment.",
    highlights: [
      "UI designed in Figma, built with UI5 Freestyle on Business Application Studio",
      "Approval workflows via SAP Build Process Automation",
      "SuccessFactors integration for hierarchical worker/manager visibility",
      "Deployed to SAP BTP Cloud Foundry",
    ],
    tags: ["SAP BTP", "UI5", "Build Process Automation", "SuccessFactors", "Figma"],
  },
  {
    name: "Mitsubishi Electric Automation – S/4 Implementation",
    period: "May 2022 – Aug 2023",
    company: "Kaar Technologies",
    description:
      "Full-cycle Activate methodology implementation spanning MM functional configuration and technical development for SD/MM processes.",
    highlights: [
      "PR/PO/Scheduling Agreement/Contract & Output Determination configuration",
      "Adobe Forms for Purchase Order, Sales Order, and Goods Receipt",
      "Custom Module Pool programs and FTP-based DMS document storage",
      "Function Modules integrating SD and MM",
    ],
    tags: ["S/4HANA", "MM", "SD", "Adobe Forms", "ABAP"],
  },
];

export const certifications: Certification[] = [
  {
    name: "SAP Certified - Back-End Developer - ABAP Cloud",
    issuer: "SAP",
    issueDate: "Jul 2026",
    expiryDate: "Jul 2027",
    credentialId: "C_ABAPD_2601",
    description:
      "Verifies familiarity with core ABAP programming principles, the ability to write applications based on the ABAP RESTful Application Programming Model (RAP), and an overall understanding of Clean Core principles for building custom extensions in SAP S/4HANA.",
    skills: [
      "Advanced Business Application Programming (ABAP)",
      "Application Development",
      "Cloud Application Development",
      "Development Environment",
      "Full Stack Development",
      "Object-Oriented Design",
      "Programming Environments",
      "SQL (Programming Language)",
    ],
    badgeImage: "https://images.credly.com/size/680x680/images/5489be1c-ce49-4cf3-8b24-eee50e5259be/blob",
    credentialUrl: "https://www.credly.com/badges/02aa171b-26fa-4de8-80c2-0f7df7b720c8/public_url",
  },
  {
    name: "SAP Certified - Solution Architect - SAP BTP",
    issuer: "SAP",
    issueDate: "Jul 2026",
    expiryDate: "Jul 2027",
    credentialId: "P_BTPA",
    description:
      "Verifies the ability to perform an SAP Solution Architect role with SAP BTP — developing and implementing solutions that meet business requirements, ensuring technical feasibility and economic viability, and translating organizational requirements into technical solution designs.",
    skills: [
      "Analytics",
      "DevOps Architecture",
      "Enterprise Application Integration",
      "SAP Cloud Suite Portfolio",
      "Solution Architecture",
    ],
    badgeImage: "https://images.credly.com/size/680x680/images/8cc68218-4b20-421f-803b-fa3769a9503f/blob",
    credentialUrl: "https://www.credly.com/badges/956fbfb6-908f-4a45-8f11-9f0db55b0a03/public_url",
  },
];
