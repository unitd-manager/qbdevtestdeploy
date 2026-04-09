import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  Brain,
  Building2,
  Calculator,
  Database,
  DollarSign,
  Eye,
  FileText,
  Gauge,
  GitBranch,
  Globe,
  HandMetal,
  Headphones,
  Layers,
  LineChart,
  Lock,
  Monitor,
  Paintbrush,
  PenTool,
  Plug,
  Rocket,
  Scaling,
  Search,
  Shield,
  ShieldCheck,
  TrendingUp,
  Unlink,
  UserCheck,
  UserCog,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

export const navLinks = [
  { label: "Platform", href: "#capabilities" },
  { label: "Capabilities", href: "#how-it-works" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Resources", href: "#analytics" },
  { label: "Contact", href: "#final-cta" },
];

export const problems = [
  { icon: Unlink, label: "Disconnected systems" },
  { icon: HandMetal, label: "Manual handoffs" },
  { icon: AlertTriangle, label: "Exception-heavy workflows" },
  { icon: Eye, label: "Limited visibility" },
  { icon: Scaling, label: "Difficulty scaling automation" },
];

export const capabilities = [
  { icon: Paintbrush, title: "Design", description: "Build automations and AI-powered workflows with low-code tools." },
  { icon: Layers, title: "Orchestrate", description: "Coordinate bots, agents, systems, and workloads from one control layer." },
  { icon: Plug, title: "Integrate", description: "Connect enterprise systems, apps, data, and AI services seamlessly." },
  { icon: Users, title: "Collaborate", description: "Bring humans into the loop when judgment or approvals are required." },
  { icon: BarChart3, title: "Optimize", description: "Measure performance, ROI, and operational impact in real time." },
  { icon: ShieldCheck, title: "Support & Govern", description: "Manage access, support issues, and enterprise reliability at scale." },
];

export const outcomes = [
  { icon: Zap, title: "Faster cycle times", description: "Accelerate end-to-end process completion" },
  { icon: DollarSign, title: "Lower operating cost", description: "Reduce manual effort and rework" },
  { icon: TrendingUp, title: "Better productivity", description: "Free teams for higher-value work" },
  { icon: Shield, title: "More resilient operations", description: "Handle exceptions gracefully at scale" },
  { icon: Eye, title: "Better visibility into ROI", description: "Track measurable outcomes in real time" },
  { icon: Lock, title: "Stronger governance", description: "Centralized access and compliance control" },
];

export const steps = [
  { icon: Search, step: "01", title: "Identify", description: "Discover high-value automation opportunities across your organization." },
  { icon: PenTool, step: "02", title: "Design", description: "Build workflows and agent experiences with low-code tools and AI assistance." },
  { icon: Rocket, step: "03", title: "Deploy", description: "Roll out automations across systems and teams with enterprise-grade reliability." },
  { icon: LineChart, step: "04", title: "Optimize", description: "Monitor, measure, and continuously scale for maximum operational impact." },
];

export const useCases = [
  { icon: Headphones, title: "Customer Service & Support", description: "Automate ticket routing, resolution, and follow-ups with AI agents and human escalation." },
  { icon: Calculator, title: "Finance & Back Office", description: "Streamline invoicing, reconciliation, and compliance workflows across systems." },
  { icon: Monitor, title: "IT Operations", description: "Orchestrate monitoring, incident response, and infrastructure management." },
  { icon: FileText, title: "Document-Heavy Workflows", description: "Extract, validate, and process documents with intelligent automation." },
  { icon: UserCog, title: "Employee Operations", description: "Automate onboarding, HR requests, and internal service delivery." },
  { icon: GitBranch, title: "Cross-System Orchestration", description: "Connect and coordinate processes spanning multiple enterprise platforms." },
];

export const integrations = [
  { icon: Building2, label: "Enterprise Apps", count: "500+" },
  { icon: Database, label: "Databases", count: "50+" },
  { icon: Globe, label: "APIs", count: "200+" },
  { icon: Brain, label: "AI Services / LLMs", count: "20+" },
  { icon: Wrench, label: "Third-Party Tools", count: "300+" },
];

export const analyticsFeatures = [
  { icon: BarChart3, title: "ROI tracking", description: "Quantify the value of every automated workflow." },
  { icon: Activity, title: "Pipeline visibility", description: "See all running automations in real time." },
  { icon: Gauge, title: "Automation performance", description: "Track success rates, latency, and throughput." },
  { icon: Monitor, title: "Workload monitoring", description: "Balance agent capacity and system load." },
  { icon: Headphones, title: "Support management", description: "Manage support tickets and SLA compliance." },
  { icon: Lock, title: "Centralized access control", description: "Role-based governance across the platform." },
];
