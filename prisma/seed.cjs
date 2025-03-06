"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// prisma/seed.ts test data
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // First, delete existing data to avoid duplicates
                return [4 /*yield*/, prisma.aISuggestion.deleteMany({})];
                case 1:
                    // First, delete existing data to avoid duplicates
                    _a.sent();
                    return [4 /*yield*/, prisma.socialLink.deleteMany({})];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.project.deleteMany({})];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.certification.deleteMany({})];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma.skill.deleteMany({})];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, prisma.education.deleteMany({})];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, prisma.experience.deleteMany({})];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany({})];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, Promise.all([
                            // User with email (traditional signup)
                            prisma.user.create({
                                data: {
                                    name: "John Doe",
                                    email: "john@example.com",
                                    title: "Full Stack Developer",
                                    location: "San Francisco, CA",
                                    bio: "Passionate developer with 5+ years of experience building web applications with modern technologies.",
                                    profileImageUrl: "/placeholder.svg?height=128&width=128",
                                    aiGeneratedTagline: "Innovative full-stack developer transforming ideas into scalable digital solutions",
                                    // Create skills
                                    skills: {
                                        create: [
                                            { name: "JavaScript", category: "Frontend", proficiencyLevel: 5 },
                                            { name: "TypeScript", category: "Frontend", proficiencyLevel: 4 },
                                            { name: "React", category: "Frontend", proficiencyLevel: 5 },
                                            { name: "Next.js", category: "Frontend", proficiencyLevel: 4 },
                                            { name: "Node.js", category: "Backend", proficiencyLevel: 4 },
                                            { name: "Express", category: "Backend", proficiencyLevel: 4 },
                                            { name: "PostgreSQL", category: "Database", proficiencyLevel: 3 },
                                            { name: "MongoDB", category: "Database", proficiencyLevel: 4 },
                                            { name: "AWS", category: "DevOps", proficiencyLevel: 3 },
                                            { name: "Docker", category: "DevOps", proficiencyLevel: 3 },
                                        ],
                                    },
                                    // Create experiences
                                    experiences: {
                                        create: [
                                            {
                                                position: "Senior Full Stack Developer",
                                                company: "TechCorp Inc.",
                                                startDate: new Date("2020-01-01"),
                                                description: "Led development of the company's flagship SaaS platform, improving performance by 40% and reducing infrastructure costs.",
                                                isCurrentPosition: true,
                                            },
                                            {
                                                position: "Full Stack Developer",
                                                company: "InnoSoft Solutions",
                                                startDate: new Date("2017-03-01"),
                                                endDate: new Date("2019-12-31"),
                                                description: "Developed and maintained multiple client web applications using React, Node.js, and AWS.",
                                                isCurrentPosition: false,
                                            },
                                        ],
                                    },
                                    // Create education
                                    education: {
                                        create: [
                                            {
                                                institution: "Stanford University",
                                                institutionLogoUrl: "/placeholder.svg?height=48&width=48",
                                                degree: "Master of Science",
                                                fieldOfStudy: "Computer Science",
                                                startYear: 2015,
                                                endYear: 2017,
                                                description: "Specialized in Artificial Intelligence and Machine Learning",
                                            },
                                            {
                                                institution: "University of California, Berkeley",
                                                institutionLogoUrl: "/placeholder.svg?height=48&width=48",
                                                degree: "Bachelor of Science",
                                                fieldOfStudy: "Computer Engineering",
                                                startYear: 2011,
                                                endYear: 2015,
                                                description: "Graduated with honors, GPA 3.8/4.0",
                                            },
                                        ],
                                    },
                                    // Create certifications
                                    certifications: {
                                        create: [
                                            {
                                                name: "AWS Certified Solutions Architect",
                                                issuer: "Amazon Web Services",
                                                issueDate: new Date("2022-01-15"),
                                                expirationDate: new Date("2025-01-15"),
                                                credentialUrl: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
                                            },
                                            {
                                                name: "Google Cloud Professional Developer",
                                                issuer: "Google",
                                                issueDate: new Date("2021-03-10"),
                                                expirationDate: new Date("2024-03-10"),
                                                credentialUrl: "https://cloud.google.com/certification/cloud-developer",
                                            },
                                        ],
                                    },
                                    // Create projects
                                    projects: {
                                        create: [
                                            {
                                                title: "E-commerce Platform",
                                                description: "A complete e-commerce solution with payment processing and inventory management.",
                                                technologies: ["React", "Node.js", "MongoDB", "Stripe"],
                                                category: "Full Stack",
                                                imageUrl: "/placeholder.svg?height=200&width=300",
                                                projectUrl: "https://example-ecommerce.com",
                                                githubUrl: "https://github.com/johndoe/ecommerce",
                                            },
                                            {
                                                title: "Real-time Analytics Dashboard",
                                                description: "Interactive dashboard for visualizing real-time data streams.",
                                                technologies: ["React", "D3.js", "WebSockets", "Node.js"],
                                                category: "Frontend",
                                                imageUrl: "/placeholder.svg?height=200&width=300",
                                                projectUrl: "https://example-dashboard.com",
                                                githubUrl: "https://github.com/johndoe/dashboard",
                                            },
                                            {
                                                title: "API Gateway Service",
                                                description: "Microservice gateway with rate limiting and caching capabilities.",
                                                technologies: ["Node.js", "Express", "Redis", "Docker"],
                                                category: "Backend",
                                                imageUrl: "/placeholder.svg?height=200&width=300",
                                                projectUrl: "https://example-api-gateway.com",
                                                githubUrl: "https://github.com/johndoe/api-gateway",
                                            },
                                        ],
                                    },
                                    // Create social links
                                    socialLinks: {
                                        create: [
                                            {
                                                platform: "GitHub",
                                                url: "https://github.com/johndoe",
                                                username: "johndoe",
                                            },
                                            {
                                                platform: "LinkedIn",
                                                url: "https://linkedin.com/in/johndoe",
                                                username: "johndoe",
                                            },
                                            {
                                                platform: "Twitter",
                                                url: "https://twitter.com/johndoe",
                                                username: "johndoe",
                                            },
                                            {
                                                platform: "Website",
                                                url: "https://johndoe.dev",
                                                username: null,
                                            },
                                        ],
                                    },
                                    // Create AI suggestions
                                    aiSuggestions: {
                                        create: [
                                            {
                                                targetType: "experience",
                                                targetId: null,
                                                suggestion: 'Replace "Led development" with a stronger action verb like "Spearheaded" or "Architected" to showcase leadership.',
                                                status: "pending",
                                            },
                                            {
                                                targetType: "skill",
                                                targetId: null,
                                                suggestion: 'Consider adding "Next.js" to your skills based on your experience. It\'s a popular framework that would complement your React expertise.',
                                                status: "pending",
                                            },
                                            {
                                                targetType: "project",
                                                targetId: null,
                                                suggestion: "Based on your skills, consider adding a GraphQL project to showcase your expertise in this technology.",
                                                status: "pending",
                                            },
                                        ],
                                    },
                                },
                            }),
                            // User without email (social auth or other methods)
                            prisma.user.create({
                                data: {
                                    name: "Social Auth User",
                                    title: "Full Stack Developer",
                                    location: "San Francisco, CA",
                                    bio: "Passionate developer with 5+ years of experience building web applications with modern technologies.",
                                    profileImageUrl: "/placeholder.svg?height=128&width=128",
                                    aiGeneratedTagline: "Innovative full-stack developer transforming ideas into scalable digital solutions",
                                    // Create skills
                                    skills: {
                                        create: [
                                            { name: "JavaScript", category: "Frontend", proficiencyLevel: 5 },
                                            { name: "TypeScript", category: "Frontend", proficiencyLevel: 4 },
                                            { name: "React", category: "Frontend", proficiencyLevel: 5 },
                                            { name: "Next.js", category: "Frontend", proficiencyLevel: 4 },
                                            { name: "Node.js", category: "Backend", proficiencyLevel: 4 },
                                            { name: "Express", category: "Backend", proficiencyLevel: 4 },
                                            { name: "PostgreSQL", category: "Database", proficiencyLevel: 3 },
                                            { name: "MongoDB", category: "Database", proficiencyLevel: 4 },
                                            { name: "AWS", category: "DevOps", proficiencyLevel: 3 },
                                            { name: "Docker", category: "DevOps", proficiencyLevel: 3 },
                                        ],
                                    },
                                    // Create experiences
                                    experiences: {
                                        create: [
                                            {
                                                position: "Senior Full Stack Developer",
                                                company: "TechCorp Inc.",
                                                startDate: new Date("2020-01-01"),
                                                description: "Led development of the company's flagship SaaS platform, improving performance by 40% and reducing infrastructure costs.",
                                                isCurrentPosition: true,
                                            },
                                            {
                                                position: "Full Stack Developer",
                                                company: "InnoSoft Solutions",
                                                startDate: new Date("2017-03-01"),
                                                endDate: new Date("2019-12-31"),
                                                description: "Developed and maintained multiple client web applications using React, Node.js, and AWS.",
                                                isCurrentPosition: false,
                                            },
                                        ],
                                    },
                                    // Create education
                                    education: {
                                        create: [
                                            {
                                                institution: "Stanford University",
                                                institutionLogoUrl: "/placeholder.svg?height=48&width=48",
                                                degree: "Master of Science",
                                                fieldOfStudy: "Computer Science",
                                                startYear: 2015,
                                                endYear: 2017,
                                                description: "Specialized in Artificial Intelligence and Machine Learning",
                                            },
                                            {
                                                institution: "University of California, Berkeley",
                                                institutionLogoUrl: "/placeholder.svg?height=48&width=48",
                                                degree: "Bachelor of Science",
                                                fieldOfStudy: "Computer Engineering",
                                                startYear: 2011,
                                                endYear: 2015,
                                                description: "Graduated with honors, GPA 3.8/4.0",
                                            },
                                        ],
                                    },
                                    // Create certifications
                                    certifications: {
                                        create: [
                                            {
                                                name: "AWS Certified Solutions Architect",
                                                issuer: "Amazon Web Services",
                                                issueDate: new Date("2022-01-15"),
                                                expirationDate: new Date("2025-01-15"),
                                                credentialUrl: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
                                            },
                                            {
                                                name: "Google Cloud Professional Developer",
                                                issuer: "Google",
                                                issueDate: new Date("2021-03-10"),
                                                expirationDate: new Date("2024-03-10"),
                                                credentialUrl: "https://cloud.google.com/certification/cloud-developer",
                                            },
                                        ],
                                    },
                                    // Create projects
                                    projects: {
                                        create: [
                                            {
                                                title: "E-commerce Platform",
                                                description: "A complete e-commerce solution with payment processing and inventory management.",
                                                technologies: ["React", "Node.js", "MongoDB", "Stripe"],
                                                category: "Full Stack",
                                                imageUrl: "/placeholder.svg?height=200&width=300",
                                                projectUrl: "https://example-ecommerce.com",
                                                githubUrl: "https://github.com/johndoe/ecommerce",
                                            },
                                            {
                                                title: "Real-time Analytics Dashboard",
                                                description: "Interactive dashboard for visualizing real-time data streams.",
                                                technologies: ["React", "D3.js", "WebSockets", "Node.js"],
                                                category: "Frontend",
                                                imageUrl: "/placeholder.svg?height=200&width=300",
                                                projectUrl: "https://example-dashboard.com",
                                                githubUrl: "https://github.com/johndoe/dashboard",
                                            },
                                            {
                                                title: "API Gateway Service",
                                                description: "Microservice gateway with rate limiting and caching capabilities.",
                                                technologies: ["Node.js", "Express", "Redis", "Docker"],
                                                category: "Backend",
                                                imageUrl: "/placeholder.svg?height=200&width=300",
                                                projectUrl: "https://example-api-gateway.com",
                                                githubUrl: "https://github.com/johndoe/api-gateway",
                                            },
                                        ],
                                    },
                                    // Create social links
                                    socialLinks: {
                                        create: [
                                            {
                                                platform: "GitHub",
                                                url: "https://github.com/johndoe",
                                                username: "johndoe",
                                            },
                                            {
                                                platform: "LinkedIn",
                                                url: "https://linkedin.com/in/johndoe",
                                                username: "johndoe",
                                            },
                                            {
                                                platform: "Twitter",
                                                url: "https://twitter.com/johndoe",
                                                username: "johndoe",
                                            },
                                            {
                                                platform: "Website",
                                                url: "https://johndoe.dev",
                                                username: null,
                                            },
                                        ],
                                    },
                                    // Create AI suggestions
                                    aiSuggestions: {
                                        create: [
                                            {
                                                targetType: "experience",
                                                targetId: null,
                                                suggestion: 'Replace "Led development" with a stronger action verb like "Spearheaded" or "Architected" to showcase leadership.',
                                                status: "pending",
                                            },
                                            {
                                                targetType: "skill",
                                                targetId: null,
                                                suggestion: 'Consider adding "Next.js" to your skills based on your experience. It\'s a popular framework that would complement your React expertise.',
                                                status: "pending",
                                            },
                                            {
                                                targetType: "project",
                                                targetId: null,
                                                suggestion: "Based on your skills, consider adding a GraphQL project to showcase your expertise in this technology.",
                                                status: "pending",
                                            },
                                        ],
                                    },
                                },
                            }),
                        ])];
                case 9:
                    users = _a.sent();
                    console.log("Created ".concat(users.length, " users"));
                    // Add other model seeding here
                    // For example, if you have posts, comments, etc.
                    console.log("Database seeded successfully");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
