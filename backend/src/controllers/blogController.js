import 'dotenv/config'
import blog from "../models/blog.js";
import blogComment from "../models/blogComment.js";
import { sanitizeHTML } from "../utils/utils.js";
import mongoose from 'mongoose'
import { logger } from '../utils/logger.js';
import { format } from 'date-fns';

export const blogTags = [
  // --- SUBJECTS ---
  { id: "math", label: "Math", type: "subject" },
  { id: "algebra", label: "Algebra", type: "subject" },
  { id: "geometry", label: "Geometry", type: "subject" },
  { id: "calculus", label: "Calculus", type: "subject" },
  { id: "science", label: "Science", type: "subject" },
  { id: "biology", label: "Biology", type: "subject" },
  { id: "chemistry", label: "Chemistry", type: "subject" },
  { id: "physics", label: "Physics", type: "subject" },
  { id: "history", label: "History", type: "subject" },
  { id: "geography", label: "Geography", type: "subject" },
  { id: "civics", label: "Civics", type: "subject" },
  { id: "literature", label: "Literature", type: "subject" },
  { id: "grammar", label: "Grammar", type: "subject" },
  { id: "writing", label: "Writing", type: "subject" },
  { id: "coding", label: "Coding", type: "subject" },
  { id: "robotics", label: "Robotics", type: "subject" },
  { id: "art", label: "Art", type: "subject" },
  { id: "music", label: "Music", type: "subject" },

  // --- INTENT ---
  { id: "how-to", label: "How-To", type: "intent" },
  { id: "tutorial", label: "Tutorial", type: "intent" },
  { id: "guide", label: "Guide", type: "intent" },
  { id: "diy", label: "DIY", type: "intent" },
  { id: "project", label: "Project", type: "intent" },
  { id: "experiment", label: "Experiment", type: "intent" },
  { id: "craft", label: "Craft", type: "intent" },
  { id: "hack", label: "Hack", type: "intent" },
  { id: "tips", label: "Tips", type: "intent" },
  { id: "tricks", label: "Tricks", type: "intent" },
  { id: "advice", label: "Advice", type: "intent" },
  { id: "cheatsheet", label: "Cheatsheet", type: "intent" },
  { id: "summary", label: "Summary", type: "intent" },

  // --- LEVEL ---
  { id: "beginner", label: "Beginner", type: "level" },
  { id: "intermediate", label: "Intermediate", type: "level" },
  { id: "advanced", label: "Advanced", type: "level" },
  { id: "elementary", label: "Elementary", type: "level" },
  { id: "middle-school", label: "Middle School", type: "level" },
  { id: "high-school", label: "High School", type: "level" },

  // --- URGENCY ---
  { id: "fast", label: "Fast", type: "urgency" },
  { id: "quick", label: "Quick", type: "urgency" },
  { id: "5-minute", label: "5-Minute", type: "urgency" },
  { id: "last-minute", label: "Last Minute", type: "urgency" },
  { id: "no-supplies", label: "No Supplies Needed", type: "urgency" },

  // --- OUTCOME ---
  { id: "exam-prep", label: "Exam Prep", type: "outcome" },
  { id: "test-ready", label: "Test Ready", type: "outcome" },
  { id: "science-fair", label: "Science Fair", type: "outcome" },
  { id: "homework-help", label: "Homework Help", type: "outcome" },
  { id: "presentation", label: "Presentation", type: "outcome" },
  { id: "essay-booster", label: "Essay Booster", type: "outcome" }
];

export const blogCategories = [
  // --- BY CONTENT TYPE (The "How") ---
  { id: "how-to", label: "Step-by-Step Guides", icon: "book-open" },
  { id: "diy", label: "DIY Projects", icon: "hammer" },
  { id: "tips", label: "Study Tips & Tricks", icon: "lightbulb" },
  { id: "video", label: "Video Tutorials", icon: "play-circle" },
  { id: "cheatsheet", label: "Quick Reference & Cheatsheets", icon: "file-text" },

  // --- BY CORE SUBJECT (The "What") ---
  { id: "stem", label: "Science & Technology", icon: "flask" },
  { id: "math", label: "Mathematics", icon: "divide" },
  { id: "humanities", label: "History & Social Studies", icon: "globe" },
  { id: "language-arts", label: "English & Literature", icon: "edit-3" },
  { id: "arts", label: "Creative Arts & Music", icon: "feather" },
  { id: "languages", label: "World Languages", icon: "languages" },

  // --- BY SCHOOL LEVEL ---
  { id: "elementary", label: "Junior School (K-5)", icon: "smile" },
  { id: "middle-school", label: "Middle School (6-8)", icon: "user" },
  { id: "high-school", label: "High School (9-12)", icon: "graduation-cap" },

  // --- BY STUDENT LIFE ---
  { id: "wellness", label: "Health & Mindfulness", icon: "heart" },
  { id: "productivity", label: "Time Management", icon: "clock" },
  { id: "careers", label: "Career & College Prep", icon: "briefcase" },
  { id: "extracurricular", label: "Clubs & Sports", icon: "award" },

  // --- SPECIAL SECTIONS ---
  { id: "exam-prep", label: "Exam & Test Prep", icon: "check-square" },
  { id: "teacher-corner", label: "Teacher Resources", icon: "coffee" },
  { id: "parent-portal", label: "Parent Guides", icon: "users" }
];

const blogSearchSuggestions = [
  // --- MATH & SCIENCE ---
  "How to solve quadratic equations using the formula",
  "DIY solar oven project for science fair",
  "Tips for memorizing the periodic table",
  "How to balance chemical equations step-by-step",
  "DIY volcano eruption experiment at home",
  "Tips for understanding calculus limits",
  "How to calculate percentages quickly in your head",
  "DIY plant cell model using household items",
  "Tips for preparing for the Math Olympiad",
  "How to use a microscope: a beginner's guide",

  // --- ENGLISH & LITERACY ---
  "How to write a persuasive essay outline",
  "DIY bookmarks for summer reading",
  "Tips for improving your creative writing flow",
  "How to analyze a poem for deeper meaning",
  "Tips for public speaking and debate",
  "How to avoid common grammar mistakes in essays",
  "DIY reading nook ideas for small bedrooms",
  "Tips for speed reading without losing comprehension",
  "How to cite sources in APA and MLA style",
  "Tips for building a better vocabulary daily",

  // --- STUDY SKILLS & PRODUCTIVITY ---
  "How to create a realistic study timetable",
  "DIY desk organizer from recycled materials",
  "Tips for staying focused during long study sessions",
  "How to take effective Cornell-style notes",
  "DIY flashcards for active recall",
  "Tips for managing exam stress and anxiety",
  "How to organize your digital files for school",
  "DIY vision board for academic goals",
  "Tips for better sleep during finals week",
  "How to use the Pomodoro technique for homework",

  // --- ARTS & CREATIVITY ---
  "How to mix primary colors to get any shade",
  "DIY watercolor greeting cards",
  "Tips for beginner photography in nature",
  "How to sketch realistic facial proportions",
  "DIY tie-dye t-shirt patterns",
  "Tips for learning a new musical instrument",
  "How to write your first song lyrics",
  "DIY classroom decorations for teachers",
  "Tips for digital art on a tablet",
  "How to make origami animals for beginners",

  // --- HISTORY & SOCIAL STUDIES ---
  "How to read a historical map effectively",
  "DIY family tree project for history class",
  "Tips for remembering key historical dates",
  "How to write a bibliography for history papers",
  "Tips for analyzing primary vs secondary sources",
  "DIY ancient civilization dioramas",
  "How to research your local town's history",
  "Tips for understanding global geography",
  "How to prepare for a mock UN debate",
  "DIY time capsule project ideas",

  // --- COMPUTER SCIENCE & TECH ---
  "How to code your first 'Hello World' in Python",
  "DIY computer cable management tips",
  "Tips for staying safe on social media",
  "How to build a simple website with HTML/CSS",
  "DIY cardboard smartphone projector",
  "Tips for using keyboard shortcuts to save time",
  "How to spot phishing emails and stay secure",
  "DIY basic robot kit for beginners",
  "Tips for effective Google Search techniques",
  "How to troubleshoot common Wi-Fi issues",

  // --- PHYSICAL EDUCATION & HEALTH ---
  "How to improve your 1-mile run time",
  "DIY healthy lunchbox ideas for school",
  "Tips for proper stretching before sports",
  "How to stay hydrated throughout the school day",
  "DIY yoga space in your living room",
  "Tips for improving hand-eye coordination",
  "How to practice mindfulness and meditation",
  "DIY jump rope workout routine",
  "Tips for better posture while sitting at a desk",
  "How to choose the right sports equipment",

  // --- LIFE SKILLS & DIY ---
  "How to sew a button back onto a shirt",
  "DIY budget-friendly dorm or bedroom decor",
  "Tips for managing your first allowance",
  "How to pack a school bag efficiently",
  "DIY non-toxic cleaning supplies",
  "Tips for basic bicycle maintenance and repair",
  "How to cook five easy meals for students",
  "DIY personalized school supplies",
  "Tips for effective time management in high school",
  "How to prepare for a part-time job interview",

  // --- SCIENCE EXPERIMENTS (DIY) ---
  "How to make a cloud in a bottle",
  "DIY crystal growing kit at home",
  "Tips for winning the school science fair",
  "How to build a bridge with popsicle sticks",
  "DIY magnetic slime recipe",
  "Tips for observing the night sky and stars",
  "How to extract DNA from a strawberry",
  "DIY periscope for kids",
  "Tips for growing an indoor herb garden",
  "How to make a battery from a lemon",

  // --- LANGUAGES & CULTURE ---
  "How to practice Spanish speaking skills daily",
  "DIY language learning flashcards",
  "Tips for learning French verb conjugations",
  "How to use language apps effectively",
  "Tips for immersive language learning at home",
  "DIY cultural craft projects from around the world",
  "How to prepare for a language proficiency test",
  "Tips for understanding cultural etiquette",
  "How to learn a new alphabet (Greek, Cyrillic, etc.)",
  "DIY world map wall art",

  "how do math fractions",
  "way to remember periodic table fast",
  "chemistry help for balancing equations",
  "why my science experiment not working",
  "easy way solve algebra x",
  "how use scientific calculator simple",
  "doing biology drawing easy",
  "physics formulas how to use",
  "math tricks for fast multiply",
  "make solar system model quick",
  "how explain photosynthesis to kid",
  "steps for long division easy",
  "geometry shapes how to draw",
  "science project ideas last minute",
  "how read a ruler properly",

  // --- ENGLISH & WRITING (CASUAL) ---
  "make my essay look longer",
  "how start a story intro",
  "good words use instead of said",
  "fix my bad grammar online",
  "how write poem that rhymes",
  "help me read book faster",
  "how summarize a chapter quick",
  "way to find theme in book",
  "better way write hook for essay",
  "how use comma and semicolon",
  "writing letters to teacher sample",
  "how check my spelling errors",

  // --- STUDY & SCHOOL LIFE (CASUAL) ---
  "how not fall asleep studying",
  "way to organize messy backpack",
  "tips for school morning routine fast",
  "how make notes look aesthetic",
  "where hide phone in class",
  "how make teacher like you",
  "way to study when tired",
  "how pass test without studying",
  "doing homework fast hacks",
  "how talk in front of class no fear",
  "way to stop procrastinating school",
  "how get good grades easily",

  // --- DIY & CREATIVE (CASUAL) ---
  "how make slime no glue",
  "easy drawing for school cover",
  "diy pencil case out of paper",
  "cool paper planes that fly far",
  "how paint with water colors easy",
  "diy school supplies at home",
  "way to decorate boring locker",
  "how make friendship bracelets simple",
  "diy gift for teacher ideas",
  "how tie dye with markers",
  "easy origami for school project",
  "how knit for beginners easy",

  // --- TECH & COMPUTER (CASUAL) ---
  "how fix slow school laptop",
  "way to type faster on keyboard",
  "how make powerpoint look cool",
  "google search tricks for school",
  "how code game for beginners",
  "way to unblock websites school",
  "how use excel for school budget",
  "easy video editing for school",
  "how screen record on chromebook",
  "make my fonts look pretty",

  // --- SPORTS & HEALTH (CASUAL) ---
  "how get fit for gym class",
  "way to run faster no tired",
  "healthy snacks for school bag",
  "how stop being stressed for exams",
  "easy lunch ideas no cook",
  "how wake up early school",
  "way to fix bad posture desk",
  "how play basketball for beginners",
  "stretches for after sitting all day",

  // --- SOCIAL & MISC (CASUAL) ---
  "how make friends in new school",
  "way to deal with mean kids",
  "what wear for school photo",
  "how join school clubs easy",
  "way to save money as student",
  "how ask for help from teacher",
  "tips for first day high school",
  "how survive middle school tips",

  // --- SHORT FORM / KEYWORD STYLE ---
  "math help fractions",
  "diy room decor school",
  "tips exams final week",
  "how write essay fast",
  "science fair ideas easy",
  "best study apps free",
  "how draw map",
  "tips public speaking",
  "grammar fix online",
  "how cite website",
  "coding for kids free",
  "diy bookmarks paper",
  "how memorize notes",
  "biology help plants",
  "history dates remember trick",
  "how calculate percentage",
  "fast typing tips",
  "school lunch prep diy",
  "how make poster board",
  "tips note taking",
  // --- MATH & CALCULATIONS ---
  "how to do long division with remainders",
  "diy abacus for math practice",
  "tips for solving word problems without getting confused",
  "math hacks for 7 times table",
  "how to find area of a triangle",
  "easy way to understand pythagorean theorem",
  "math help for negative numbers",
  "how use protractor for angles",
  "diy geometry shapes with toothpicks",
  "tips for sat math section",
  "how do mental math fast",
  "way to simplify fractions easy",
  "math cheat sheet for algebra 1",
  "how to graph linear equations",
  "doing math homework in half the time",

  // --- SCIENCE & EXPERIMENTS ---
  "how to make a lemon battery",
  "diy water filtration system for school",
  "tips for a winning science fair poster",
  "how do plants breathe experiment",
  "diy marshmallow catapult physics",
  "tips for identifying backyard birds",
  "how to use a telescope for beginners",
  "diy sundial for geography project",
  "tips for safety in school lab",
  "how to make static electricity with a balloon",
  "diy weather station for kids",
  "how explain gravity to a 5th grader",
  "easy way to remember planets in order",
  "how to grow mold on bread experiment",
  "diy kaleidoscope with mirrors",

  // --- ENGLISH & LITERARY SKILLS ---
  "how to write a book report that isn't boring",
  "diy journal for daily writing",
  "tips for identifying metaphors in poetry",
  "how to use a thesaurus effectively",
  "tips for memorizing lines for a school play",
  "how to write a bibliography for kids",
  "diy flashcards for spelling bee",
  "tips for reading aloud with confidence",
  "how to find the main idea of a paragraph",
  "easy way to learn parts of speech",
  "how to write a letter to a pen pal",
  "tips for peer editing a friend's essay",

  // --- HISTORY & CULTURE ---
  "how to draw a map of the world by heart",
  "diy ancient egyptian papyrus paper",
  "tips for researching family history",
  "how to build a medieval castle for school",
  "diy colonial soap making project",
  "tips for understanding the three branches of government",
  "how to make a salt dough map",
  "diy viking shield for history project",
  "tips for visiting a museum for a report",
  "how to interview a grandparent for school",

  // --- TECHNOLOGY & CODING ---
  "how to build a game in scratch",
  "diy laptop stand from cardboard",
  "tips for typing without looking at keys",
  "how to stay safe on minecraft servers",
  "diy phone speaker using paper cups",
  "tips for making a school podcast",
  "how to use google docs for group projects",
  "diy green screen for school videos",
  "tips for creating a strong password",
  "how to basic coding for beginners",

  // --- BROKEN / CASUAL ENGLISH (FOR SEARCH WEIGHTING) ---
  "how fix my grade in math",
  "easy way learn periodic table",
  "science project ideas for 6th grade",
  "why my plant dying science project",
  "how make a resume for first job",
  "way to study when i dont want to",
  "how do essay fast tonight",
  "best way take notes in history",
  "how get a 100 on spelling test",
  "way to remember spanish words",
  "how make volcano erupt big",
  "math fractions help for dummies",
  "how write 5 paragraph essay",
  "tips for middle school drama",
  "how join school basketball team",
  "way to make friends fast school",
  "how talk to teacher about bad grade",
  "diy school supplies cheap",
  "how make cool powerpoint slides",
  "way to organize school locker",
  "how do gym class when tired",
  "science fair volcano baking soda",
  "how read fast and understand",
  "tips for high school freshman",
  "how get more sleep school night",
  "way to study for bio final",
  "how do chemistry labs safe",
  "diy gifts for school friends",
  "how write cursive letters easy",
  "tips for school talent show",

  // --- WELLNESS & PRODUCTIVITY ---
  "how to stop procrastinating on homework",
  "diy stress ball for exam week",
  "tips for healthy breakfast before school",
  "how to pack a gym bag fast",
  "diy vision board for graduation",
  "tips for managing school and sports",
  "how to deal with school bullies",
  "diy calming jar for anxiety",
  "tips for staying hydrated in class",
  "how to organize a study group",

  // --- ART & MUSIC ---
  "how to draw a 3d cube",
  "diy recycled art projects",
  "tips for playing recorder for beginners",
  "how to read sheet music fast",
  "diy tie dye with natural dyes",
  "tips for mixing acrylic paints",
  "how to make a stop motion movie",
  "diy musical instruments for kids",
  "tips for drawing realistic eyes",
  "how to start a school art club",

  // --- CATEGORY-SPECIFIC LONG TAIL ---
  "how to solve rubiks cube for beginners",
  "diy desk lamp from scraps",
  "tips for writing a college application essay",
  "how to use a compass for navigation",
  "diy bird feeder for biology class",
  "tips for learning sign language",
  "how to tell if a website is fake",
  "diy solar system mobile",
  "tips for school debate winners",
  "how to make a budget for school lunch",
  "diy personalized notebook covers",
  "tips for memorizing a speech in 24 hours",
  "how to calculate gpa easily",
  "diy friendship bracelets 3 string",
  "tips for first day of middle school",
  "how to use a library database",
  "diy telescope with magnifying glass",
  "tips for school band auditions",
  "how to make a periscope at home",
  "diy bookmarks with pressed flowers",
  "tips for staying organized with adhd",
  "how to do a presentation without crying",
  "diy classroom door decorations",
  "tips for high school sports tryouts",
  "how to bake cookies for school sale",
  "diy costume for school play",
  "tips for studying in a noisy house",
  "how to make a basic circuit",
  "diy puppet theater for school",
  "tips for choosing high school electives"
];

const formatDate = (date) => format(new Date(date), 'dd/MM/yyyy | HH:mm');

const sanitizeText = (val, max) => 
    typeof val === 'string' ? val.trim().replace(/\s+/g, ' ').replace(/[^\x20-\x7E]/g, '').slice(0, max) : undefined;

export const composeBlog = async (req, res) => {
    // Safe extract Author data
    const authorId = req.user?.id;
    const authorRole = req.user?.role;
    const autherName = req.user?.name;

    // Safe extract Blog data (e.g., title, content, )
    const category = req.body?.category;
    const title = req.body?.title;
    const content = req.body?.content;
    const tags = req.body?.tags;
    const isNew = req.body?.isNew;

    // Null check
    if (!category || !title || !content || !tags || !isNew) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_DATA",
                message: "Incomplete data provided."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }

    if (isNew !== true) {
        return res.status(422).json({
            success: false,
            status: 422,
            error: {
                code: "UNINTENTIONAL",
                message: "Unintentional route hit."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }

    // Malformation check
    if (typeof (category) !== 'string' || typeof (title) !== 'string' || typeof (content) !== 'string') {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_DATA",
                message: "Malformed data provided."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }

    // tags array check
    if (!Array.isArray(req.body.tags)) {
        return res.status(422).json({
            success: false,
            status: 422,
            error: {
                code: "INVALID_DATA",
                message: "Tags must be an Array."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }

    // Sanitize data
    const s_category = sanitizeText(category, 40);
    const s_title = sanitizeText(title, 100);
    const s_tags = tags.map(tag => sanitizeText(tag, 20));
    const s_content = sanitizeHTML(content);
    
    // Define blog payload
    const blogPayload = {
        author: {
            id: authorId,
            role: authorRole,
            name: autherName
        },
        metadata: {
            category: s_category,
            tags: s_tags
        },
        title: s_title,
        content: s_content
    }

    const tSession = await mongoose.startSession()

    try {
        tSession.startTransaction()
        const newBlog = new blog(blogPayload);
        await newBlog.save({
            session: tSession
        });
        await tSession.commitTransaction();
        res.json({
            success: true,
            status: 200,
            data: {
                message: "New Blog Created and will be live after review"
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    } catch (error) {
        await tSession.abortTransaction()
        if (error.name === "ValidationError") {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(422).json({
                success: false,
                status: 422,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Incomplete data provided.",
                    eFields: errors
                },
                metadata: {
                    server_time: Date.now(),
                    version: process.env.API_VERSION || 'v0.0.0'
                }
            });
        };
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'blogController',
            message: 'Error creating new blog',
            metadata: {
                userType: req.user?.role
            },
            stackTrace: error
        });
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error occured while creating new blog."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    } finally {
        await tSession.endSession;
    }
}

export const categories = (req, res) => {
    res.json({
        success: true,
        status: 200,
        data: {
            categories: blogCategories
        },
        metadata: {
            server_time: Date.now(),
            version: process.env.API_VERSION || 'v0.0.0'
        }
    });
}

export const suggestions = (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INCOMPLETE_DATA",
                message: "Incomplete data provided.",
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }
    const r = blogSearchSuggestions.filter(f => f.toLowerCase().includes(q.toLowerCase())).slice(0, 10)
    res.json({
        success: true,
        status: 200,
        data: {
            suggestions: r
        },
        metadata: {
            server_time: Date.now(),
            version: process.env.API_VERSION || 'v0.0.0'
        }
    });
}

export const tags = (req, res) => {
    res.json({
        success: true,
        status: 200,
        data: {
            tags: blogTags
        },
        metadata: {
            server_time: Date.now(),
            version: process.env.API_VERSION || 'v0.0.0'
        }
    });
}

export const getMyBlogs = async (req, res) => {
    // Safe extract user details from the request token
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const userName = req.user?.name;

    try {
        const userBlogs = await blog.find({'author.id': userId, isAvailable: true}).select('author metadata title status blogId createdAt updatedAt')
        if (userBlogs.length <= 0) {
            return res.status(404).json({
                success: false,
                status: 404,
                error: {
                    code: "NOT_FOUND",
                    message: "No blogs found",
                },
                metadata: {
                    server_time: Date.now(),
                    version: process.env.API_VERSION || 'v0.0.0'
                }
            });
        }
        const alteredBlogs = [];

        for (const blog of userBlogs) {
            const payload = {
                author: {
                    name: blog.author.name,
                    role: blog.author.role
                },
                metadata: {
                    category: blog.metadata.category,
                    tags: blog.metadata.tags,
                    likes: blog.metadata.likes.length
                },
                title: blog.title,
                status: blog.status,
                blogId: blog.blogId,
                createdAt: formatDate(blog.createdAt),
                updatedAt: formatDate(blog.updatedAt)
            }
            alteredBlogs.push(payload)
        }

        res.json({
            success: true,
            status: 200,
            data: {
                blogs: alteredBlogs
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    } catch (error) {
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'getMyBlogs',
            message: 'Error finding blogs',
            metadata: {
                userType: req.user?.role
            },
            stackTrace: error
        });
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error occured while finding blogs."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }
}

export const getSpBlog = async (req, res) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const userName = req.user?.name;

    const blogId = req.params.viewId

    if (!blogId) {
        res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INCOMPLETE_DATA",
                message: "Blog id not provided."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }

    try {
        const ublog = await blog.findOne({ blogId: blogId, isAvailable: true }) 
        if (!ublog) {
            return res.status(404).json({
                success: false,
                status: 404,
                error: {
                    code: "NOT_FOUND",
                    message: "No blog found or Invalid blog id",
                },
                metadata: {
                    server_time: Date.now(),
                    version: process.env.API_VERSION || 'v0.0.0'
                }
            });
        }

        const payload = {
            author: {
                name: ublog.author.name,
                role: ublog.author.role
            },
            reviewer: {
                name: ublog.reviewer.name,
                role: ublog.reviewer.role
            },
            metadata: {
                category: ublog.metadata.category,
                tags: ublog.metadata.tags,
                likes: ublog.metadata.likes.length
            },
            title: ublog.title,
            content: ublog.content,
            isAvailable: ublog.isAvailable,
            status: ublog.status
        }

        res.json({
            success: true,
            status: 200,
            data: {
                blog: payload
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });

    } catch (error) {
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'getSpBlog',
            message: 'Error finding blog',
            metadata: {
                userType: req.userRole
            },
            stackTrace: error
        });
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error occured while finding blog."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }
}

export const updateBlog = async (req, res) => {
    const userId = req.user?.id;
    const blogId = req.params?.blogId

    const category = req.body?.category;
    const title = req.body?.title;
    const content = req.body?.content;
    const tags = req.body?.tags;
    const isNew = req.body?.isNew;

    // Null check and blog Id is just a custom string
    if (!category || !title || !content || !tags || !blogId) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_DATA",
                message: "Incomplete data provided."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }

    if (isNew !== false) {
        return res.status(422).json({
            success: false,
            status: 422,
            error: {
                code: "UNINTENTIONAL",
                message: "Unintentional route hit."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }

    // Malformation check
    if (typeof (category) !== 'string' || typeof (title) !== 'string' || typeof (content) !== 'string') {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_DATA",
                message: "Malformed data provided."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }

    // tags array check
    if (!Array.isArray(tags)) {
        return res.status(422).json({
            success: false,
            status: 422,
            error: {
                code: "INVALID_DATA",
                message: "Tags must be an Array."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }

    // Sanitize data (every tag is isolated means its first fetched from the server predefined and chosen by the client and then sent back to then sanitized)
    const s_category = sanitizeText(category, 40);
    const s_title = sanitizeText(title, 100);
    const s_tags = tags.map(tag => sanitizeText(tag, 20));
    const s_content = sanitizeHTML(content);
    
    const tSession = await mongoose.startSession()

    try {
        tSession.startTransaction();

        const userBlog = await blog.findOne({blogId: blogId}, null, {session: tSession}).select('author');

        if (!userBlog) {
            await tSession.abortTransaction();
            return res.status(404).json({
                success: false,
                status: 404,
                error: {
                    code: "NOT_FOUND",
                    message: "requested data not found."
                },
                metadata: {
                    server_time: Date.now(),
                    version: process.env.API_VERSION || 'v0.0.0'
                }
            });
        }

        if (userBlog.author.id !== userId) {
            await tSession.abortTransaction();
            return res.status(403).json({
                success: false,
                status: 403,
                error: {
                    code: "NOT_ALLOWED",
                    message: "User not allowed to perform this action."
                },
                metadata: {
                    server_time: Date.now(),
                    version: process.env.API_VERSION || 'v0.0.0'
                }
            });
        }

        const pushUpdate = await blog.updateOne(
            { blogId: blogId },
            { $set: {
                    'metadata.category': s_category,
                    'metadata.tags': s_tags,
                    title: s_title,
                    content: s_content,
                    'status.state': "DRAFT",
                }
            },
            { session: tSession }
        )

        if (!pushUpdate.acknowledged) {
            throw new Error('Not updated')
        }

        await tSession.commitTransaction()

        res.json({
            success: true,
            status: 200,
            data: {
                message: 'Updated!'
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });


    } catch (error) {
        await tSession.abortTransaction()
        if (error.name === "ValidationError") {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(422).json({
                success: false,
                status: 422,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Incomplete data provided.",
                    eFields: errors
                },
                metadata: {
                    server_time: Date.now(),
                    version: process.env.API_VERSION || 'v0.0.0'
                }
            });
        };
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'updateBlog',
            message: 'Error updating blog',
            metadata: {
                userType: req.user?.role,
                userId: req.user?.id,
                orderId: blogId
            },
            stackTrace: error
        });
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error occured while updating."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    } finally {
        await tSession.endSession();
    }
}