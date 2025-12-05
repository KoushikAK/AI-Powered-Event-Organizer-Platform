import { internalMutation } from "./_generated/server";

// Sample events data with Unsplash images
const SAMPLE_EVENTS = [
  {
    title: "React 19 Workshop: Master the New Features",
    description: `Join us for an intensive hands-on workshop diving deep into React 19's revolutionary features! 

In this session, you'll learn about:
- The new Actions API and how it simplifies form handling
- Server Components and their impact on performance
- The improved use() hook and its practical applications
- Asset loading improvements for better UX
- Migration strategies from React 18

Whether you're a seasoned React developer or just getting started, this workshop will equip you with the knowledge to build faster, more efficient applications. Bring your laptop and be ready to code!

Light refreshments will be provided. Limited seats available.`,
    category: "tech",
    tags: ["tech", "react", "javascript", "frontend"],
    city: "Bangalore",
    state: "Karnataka",
    venue: "https://maps.google.com/?q=WeWork+Embassy+Golf+Links",
    address: "WeWork Embassy Golf Links, Domlur, Bangalore",
    capacity: 50,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80",
    themeColor: "#4c1d95",
  },
  {
    title: "AI & Machine Learning Meetup - Building with LLMs",
    description: `Explore the exciting world of Large Language Models and learn how to integrate them into your applications!

This meetup covers:
- Introduction to LLM APIs (OpenAI, Anthropic, Google)
- Prompt engineering best practices
- Building RAG applications
- Fine-tuning strategies
- Real-world use cases and demos

Network with fellow AI enthusiasts and developers. Q&A session included.

Pizza and drinks provided!`,
    category: "tech",
    tags: ["tech", "ai", "machine-learning", "llm"],
    city: "Hyderabad",
    state: "Telangana",
    venue: "https://maps.google.com/?q=T-Hub+Hyderabad",
    address: "T-Hub, IIIT Hyderabad Campus, Gachibowli",
    capacity: 100,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    themeColor: "#1e3a8a",
  },
  {
    title: "Indie Music Night - Acoustic Sessions",
    description: `An evening of soulful acoustic performances by indie artists from across India!

Featuring:
- 5 handpicked indie bands
- Unplugged performances
- Open mic session (limited slots)
- Meet & greet with artists

Experience the raw talent of upcoming musicians in an intimate setting. Perfect for music lovers who appreciate authentic, heartfelt performances.

Food and beverages available for purchase at the venue.`,
    category: "music",
    tags: ["music", "indie", "acoustic", "live"],
    city: "Mumbai",
    state: "Maharashtra",
    venue: "https://maps.google.com/?q=The+Habitat+Khar",
    address: "The Habitat, Khar West, Mumbai",
    capacity: 120,
    ticketType: "paid",
    ticketPrice: 499,
    coverImage:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80",
    themeColor: "#831843",
  },
  {
    title: "Startup Networking Breakfast",
    description: `Connect with fellow entrepreneurs, investors, and startup enthusiasts over breakfast!

What to expect:
- Speed networking sessions
- Pitch practice opportunities
- One-on-one mentor meetings
- Funding insights from VCs
- Success stories from local founders

This is your chance to expand your professional network, find potential co-founders, or get valuable feedback on your startup idea.

Continental breakfast included in registration.`,
    category: "business",
    tags: ["business", "networking", "startup", "entrepreneurship"],
    city: "Gurgaon",
    state: "Haryana",
    venue: "https://maps.google.com/?q=91springboard+Gurgaon",
    address: "91springboard, Sector 44, Gurgaon",
    capacity: 40,
    ticketType: "paid",
    ticketPrice: 299,
    coverImage:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80",
    themeColor: "#065f46",
  },
  {
    title: "Weekend Photography Walk - Street Stories",
    description: `Capture the vibrant streets of Delhi through your lens!

Join our photography walk covering:
- Chandni Chowk's bustling markets
- Hidden architectural gems
- Street food and portraits
- Golden hour shooting techniques
- Post-processing tips

Suitable for all skill levels. Bring your camera (phone cameras welcome too!). Our experienced photographer will guide you through composition techniques and storytelling through images.

Chai stops included along the way!`,
    category: "art",
    tags: ["art", "photography", "culture", "walking-tour"],
    city: "Delhi",
    state: "Delhi",
    venue: "https://maps.google.com/?q=Red+Fort+Delhi",
    address: "Red Fort Metro Station Exit, Delhi",
    capacity: 25,
    ticketType: "paid",
    ticketPrice: 799,
    coverImage:
      "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=1200&q=80",
    themeColor: "#92400e",
  },
  {
    title: "Full Stack Development Bootcamp - Day 1",
    description: `Kickstart your journey to becoming a full-stack developer!

Day 1 covers:
- Setting up your development environment
- Git & GitHub fundamentals
- HTML5 & CSS3 essentials
- Introduction to JavaScript
- Building your first webpage

This is the first session of our 6-week bootcamp series. Perfect for beginners who want to break into tech. No prior coding experience required!

Laptop required. Course materials provided.`,
    category: "education",
    tags: ["education", "coding", "fullstack", "beginner"],
    city: "Pune",
    state: "Maharashtra",
    venue: "https://maps.google.com/?q=Cummins+College+Pune",
    address: "Cummins College, Karve Nagar, Pune",
    capacity: 30,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
    themeColor: "#7f1d1d",
  },
  {
    title: "Sunday Football Tournament",
    description: `5-a-side football tournament for amateur players!

Tournament details:
- 8 teams competing
- Round-robin + knockout format
- Prizes for top 3 teams
- Best player award
- Free jersey for all participants

Register as a team (5 players + 2 substitutes) or individually (we'll match you with a team).

Referee provided. Water and energy drinks available. Medical support on standby.`,
    category: "sports",
    tags: ["sports", "football", "tournament", "fitness"],
    city: "Chennai",
    state: "Tamil Nadu",
    venue: "https://maps.google.com/?q=Jawaharlal+Nehru+Stadium+Chennai",
    address: "JLN Stadium Indoor Complex, Chennai",
    capacity: 56,
    ticketType: "paid",
    ticketPrice: 350,
    coverImage:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
    themeColor: "#065f46",
  },
  {
    title: "Healthy Cooking Workshop - Plant-Based Cuisine",
    description: `Learn to create delicious, nutritious plant-based meals!

Workshop includes:
- 5 complete recipes to master
- Ingredient selection tips
- Meal prep strategies
- Nutritional balancing
- Recipe booklet to take home

Our chef instructor will guide you through preparing a full plant-based meal from appetizer to dessert. All ingredients and cooking equipment provided.

Taste everything you cook! Great for health enthusiasts and curious foodies alike.`,
    category: "food",
    tags: ["food", "cooking", "health", "vegan"],
    city: "Kolkata",
    state: "West Bengal",
    venue: "https://maps.google.com/?q=Salt+Lake+Kolkata",
    address: "Community Kitchen, Salt Lake Sector V, Kolkata",
    capacity: 20,
    ticketType: "paid",
    ticketPrice: 1200,
    coverImage:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80",
    themeColor: "#065f46",
  },
  {
    title: "Morning Yoga & Meditation Retreat",
    description: `Start your weekend with peace and mindfulness!

Session includes:
- 60-minute Hatha Yoga practice
- 30-minute guided meditation
- Breathing techniques (Pranayama)
- Sound healing session
- Healthy breakfast

Suitable for all levels - modifications provided for beginners. Our certified instructor creates a welcoming space for everyone.

Yoga mats provided. Please wear comfortable clothing.`,
    category: "health",
    tags: ["health", "yoga", "meditation", "wellness"],
    city: "Jaipur",
    state: "Rajasthan",
    venue: "https://maps.google.com/?q=Central+Park+Jaipur",
    address: "Central Park, C-Scheme, Jaipur",
    capacity: 35,
    ticketType: "paid",
    ticketPrice: 450,
    coverImage:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
    themeColor: "#4c1d95",
  },
  {
    title: "Gaming Tournament - Valorant Championship",
    description: `Compete in the ultimate Valorant showdown!

Tournament format:
- 16 teams (5v5)
- Single elimination bracket
- Best of 3 matches
- Prize pool: ₹50,000
- Live streaming on Twitch

All skill levels welcome. Bring your own peripherals (mouse, headset). High-spec PCs and stable internet provided.

Energy drinks and snacks available. Exciting commentary and crowd interaction!`,
    category: "gaming",
    tags: ["gaming", "esports", "valorant", "tournament"],
    city: "Noida",
    state: "Uttar Pradesh",
    venue: "https://maps.google.com/?q=DLF+Mall+Noida",
    address: "Game Arena, DLF Mall of India, Noida",
    capacity: 80,
    ticketType: "paid",
    ticketPrice: 200,
    coverImage:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80",
    themeColor: "#7f1d1d",
  },
  {
    title: "Women in Tech: Leadership Panel Discussion",
    description: `Inspiring stories and insights from women leaders in technology!

Panel features:
- CTOs from top startups
- Engineering managers from FAANG
- Successful tech entrepreneurs
- VC partners focusing on women-led startups

Topics covered:
- Breaking barriers in tech
- Building inclusive teams
- Work-life integration
- Career growth strategies
- Mentorship importance

Open to all genders. Q&A session and networking lunch included.`,
    category: "networking",
    tags: ["networking", "women-in-tech", "leadership", "career"],
    city: "Bangalore",
    state: "Karnataka",
    venue: "https://maps.google.com/?q=Google+Office+Bangalore",
    address: "Google Office, Old Airport Road, Bangalore",
    capacity: 40,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&q=80",
    themeColor: "#831843",
  },
  {
    title: "Trekking to Triund - Weekend Adventure",
    description: `Experience the majestic Himalayas on this beginner-friendly trek!

Itinerary:
- Day 1: Dharamshala to Triund (9km trek)
- Overnight camping under stars
- Day 2: Sunrise view & descent

Package includes:
- Experienced trek leader
- Camping gear (tents, sleeping bags)
- All meals during trek
- First aid kit
- Photography assistance

Moderate fitness level required. Age 16+ recommended.

Transport from Delhi available at additional cost.`,
    category: "outdoor",
    tags: ["outdoor", "trekking", "adventure", "camping"],
    city: "Dharamshala",
    state: "Himachal Pradesh",
    venue: "https://maps.google.com/?q=McLeod+Ganj",
    address: "McLeod Ganj Main Square, Dharamshala",
    capacity: 20,
    ticketType: "paid",
    ticketPrice: 2500,
    coverImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
    themeColor: "#065f46",
  },
  {
    title: "Community Clean-up Drive - Beach Edition",
    description: `Join hands to keep our beaches clean and beautiful!

Activity plan:
- Beach cleanup (2 hours)
- Waste segregation workshop
- Marine conservation talk
- Group photo session
- Certificate of participation

All cleaning materials provided. Wear comfortable clothes you don't mind getting dirty. Sunscreen and hat recommended.

Refreshments provided. A great way to give back to nature while meeting like-minded people!`,
    category: "community",
    tags: ["community", "environment", "volunteer", "beach"],
    city: "Goa",
    state: "Goa",
    venue: "https://maps.google.com/?q=Calangute+Beach+Goa",
    address: "Calangute Beach, North Goa",
    capacity: 100,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    themeColor: "#1e3a8a",
  },
  {
    title: "JavaScript Performance Optimization Masterclass",
    description: `Level up your JS skills with advanced performance techniques!

Topics covered:
- Memory management & garbage collection
- Event loop deep dive
- Web Workers & multithreading
- Code splitting strategies
- Bundle optimization with Webpack/Vite
- React performance patterns
- Profiling with Chrome DevTools

Intermediate JavaScript knowledge required. Bring your laptop with Node.js installed.

Code examples and cheat sheets provided.`,
    category: "tech",
    tags: ["tech", "javascript", "performance", "advanced"],
    city: "Ahmedabad",
    state: "Gujarat",
    venue: "https://maps.google.com/?q=IIM+Ahmedabad",
    address: "CIIE, IIM Ahmedabad Campus",
    capacity: 40,
    ticketType: "paid",
    ticketPrice: 999,
    coverImage:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&q=80",
    themeColor: "#92400e",
  },
  {
    title: "Indie Game Dev Jam - 48 Hour Challenge",
    description: `Create a game from scratch in 48 hours!

Event highlights:
- Theme revealed at start
- Solo or team participation (max 4)
- Mentorship from industry devs
- Game engine workshops (Unity/Godot)
- Asset creation support
- Final showcase & judging

Prizes for:
- Best Overall Game
- Most Innovative Mechanic
- Best Art Style
- People's Choice

Sleeping bags welcome. Food and drinks provided throughout.`,
    category: "gaming",
    tags: ["gaming", "game-development", "hackathon", "indie"],
    city: "Bangalore",
    state: "Karnataka",
    venue: "https://maps.google.com/?q=Bangalore+International+Centre",
    address: "Bangalore International Centre, Domlur",
    capacity: 60,
    ticketType: "paid",
    ticketPrice: 500,
    coverImage:
      "https://images.unsplash.com/photo-1556438064-2d7646166914?w=1200&q=80",
    themeColor: "#4c1d95",
  },
  {
    title: "AI Product Building Workshop - From Idea to MVP",
    description: `Learn to build AI-powered products from scratch in this hands-on workshop!

What you'll build:
- AI-powered customer support chatbot
- Intelligent document summarizer
- Smart recommendation engine prototype

Skills covered:
- Product ideation with AI capabilities
- API integration (OpenAI, Anthropic, Google)
- Prompt engineering for production
- UI/UX for AI products
- Deployment and scaling basics

Perfect for product managers, entrepreneurs, and developers looking to add AI to their toolkit. No prior ML experience needed - we focus on practical application!

Lunch and refreshments included. Bring your laptop!`,
    category: "tech",
    tags: ["tech", "ai", "product", "startup"],
    city: "Gurgaon",
    state: "Haryana",
    venue: "https://maps.google.com/?q=Innov8+Cyber+Hub+Gurgaon",
    address: "Innov8 Coworking, Cyber Hub, DLF Cyber City, Gurgaon",
    capacity: 40,
    ticketType: "paid",
    ticketPrice: 1499,
    coverImage:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
    themeColor: "#4c1d95",
  },
  {
    title: "Startup Founder's Breakfast - Funding & Growth Stories",
    description: `Connect with fellow founders and learn from successful entrepreneurs over breakfast!

Featured speakers:
- Series B founder sharing fundraising journey
- Angel investor revealing what they look for
- Growth hacker with proven scaling strategies
- Failed startup founder sharing lessons learned

Agenda:
- 8:00 AM - Networking breakfast
- 9:00 AM - Panel discussion
- 10:00 AM - Q&A session
- 10:30 AM - One-on-one speed networking

This intimate gathering is perfect for early-stage founders, aspiring entrepreneurs, and anyone interested in the startup ecosystem.

Continental breakfast and unlimited coffee included!`,
    category: "business",
    tags: ["business", "startup", "networking", "entrepreneurship"],
    city: "Gurgaon",
    state: "Haryana",
    venue: "https://maps.google.com/?q=WeWork+Two+Horizon+Center+Gurgaon",
    address: "WeWork Two Horizon Center, Golf Course Road, Gurgaon",
    capacity: 35,
    ticketType: "paid",
    ticketPrice: 399,
    coverImage:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=80",
    themeColor: "#065f46",
  },
  {
    title: "Weekend Photography Masterclass - Portrait & Street",
    description: `Elevate your photography skills with professional techniques!

Day 1 - Portrait Photography:
- Lighting setups (natural & artificial)
- Posing and directing subjects
- Camera settings for portraits
- Live model shoot session
- Post-processing in Lightroom

Day 2 - Street Photography:
- Finding compelling stories
- Composition techniques
- Candid vs posed shots
- Photo walk in Cyber Hub
- Ethics in street photography

Equipment: DSLR/Mirrorless camera required (no phone cameras for this workshop). Tripod optional.

All skill levels welcome. You'll leave with a portfolio of stunning images!

Snacks and beverages provided both days.`,
    category: "art",
    tags: ["art", "photography", "workshop", "creative"],
    city: "Gurgaon",
    state: "Haryana",
    venue: "https://maps.google.com/?q=Visual+Arts+Gallery+Gurgaon",
    address: "Visual Arts Gallery, Sector 44, Gurgaon",
    capacity: 20,
    ticketType: "paid",
    ticketPrice: 2499,
    coverImage:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80",
    themeColor: "#92400e",
  },
  {
    title: "Corporate Cricket Tournament - Season 3",
    description: `The biggest corporate cricket showdown in Gurgaon is back!

Tournament format:
- 12 corporate teams competing
- T10 format (10 overs per side)
- League stage + knockout rounds
- Professional umpires and scoring
- Live commentary

Prizes:
- Winner: ₹1,00,000 + Trophy
- Runner-up: ₹50,000
- Best Batsman, Bowler & Player awards

Register your company team (11 players + 4 substitutes). Individual registrations also open - we'll form mixed teams.

What's included:
- Professional cricket ground
- Match balls and equipment
- Refreshments throughout
- Team jerseys
- Photos & videos

Perfect for team building and corporate bonding!`,
    category: "sports",
    tags: ["sports", "cricket", "corporate", "tournament"],
    city: "Gurgaon",
    state: "Haryana",
    venue: "https://maps.google.com/?q=Tau+Devi+Lal+Stadium+Gurgaon",
    address: "Tau Devi Lal Stadium, Sector 38, Gurgaon",
    capacity: 180,
    ticketType: "paid",
    ticketPrice: 500,
    coverImage:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80",
    themeColor: "#065f46",
  },
  {
    title: "Mindfulness & Stress Management for Professionals",
    description: `Combat workplace stress with evidence-based mindfulness techniques!

This workshop is designed for busy professionals who want to:
- Reduce anxiety and stress
- Improve focus and productivity
- Better manage work-life balance
- Build emotional resilience
- Enhance decision-making clarity

Session includes:
- Understanding stress response
- Guided meditation practice
- Breathing techniques for instant calm
- Mindful communication at work
- Creating daily wellness routines
- Apps and tools for continued practice

Led by a certified mindfulness coach with 10+ years of corporate wellness experience.

Yoga mats and meditation cushions provided. Wear comfortable clothing.

Healthy snacks and herbal teas included.`,
    category: "health",
    tags: ["health", "wellness", "mindfulness", "corporate"],
    city: "Gurgaon",
    state: "Haryana",
    venue: "https://maps.google.com/?q=The+Yoga+Studio+Gurgaon",
    address: "The Yoga Studio, South City 2, Gurgaon",
    capacity: 25,
    ticketType: "paid",
    ticketPrice: 899,
    coverImage:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80",
    themeColor: "#831843",
  },
  {
    title: "Pizza Palooza: A Slice of Heaven",
    description: `Join us for an evening of pizza making and tasting! Learn the secrets to crafting the perfect pizza dough and discover a variety of delicious toppings. You'll leave with new skills and a full stomach.`,
    category: "food",
    tags: ["food"],
    city: "Gurgaon",
    state: "Haryana",
    venue: "https://maps.app.goo.gl/YXJ5J2eCVWbskBSL9",
    address:
      "32nd Avenue - NH 48, Sector 15 Part 2, Sector 15, Gurgaon, Haryana 122001",
    capacity: 10,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NjkyNzJ8MHwxfHNlYXJjaHwxfHxwaXp6YXxlbnwwfHx8fDE3NjI5NTA5NTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    themeColor: "#831843",
  },
  {
    title: "React & Next.js: Building the Future of Web Applications",
    description: `Explore the latest advancements in React and Next.js, and discover how these technologies are shaping modern web development. This event provides insights into server-side rendering, performance optimization, and the future roadmap for building scalable and efficient web applications. Attendees will gain practical knowledge and explore best practices for leveraging these powerful tools.`,
    category: "tech",
    tags: ["tech"],
    city: "Gurgaon",
    state: "Haryana",
    venue: "https://maps.app.goo.gl/tgdtbwXkAwpHkHAw6",
    address:
      "Google Office - Tower A, IN-GUR-SIGA, Sector 15 Part 2, Village Silokhera, Gurgaon, Haryana 122001",
    capacity: 75,
    ticketType: "paid",
    ticketPrice: 250,
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NjkyNzJ8MHwxfHNlYXJjaHwxfHxyZWFjdCUyMGpzfGVufDB8fHx8MTc2Mjk0NjQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    themeColor: "#1e3a8a",
  },
  {
    title: "Cloud Native Summit 2025",
    description: `Join the largest gathering of cloud native enthusiasts, developers, and thought leaders!

Topics include:
- Kubernetes best practices
- Serverless architectures
- Microservices patterns
- Cloud security and compliance
- DevOps culture and CI/CD

Keynote speakers from top tech companies. Great opportunity to network and learn about the future of cloud computing.

Lunch and swag bags provided for all attendees.`,
    category: "tech",
    tags: ["tech", "cloud", "kubernetes", "devops"],
    city: "Bangalore",
    state: "Karnataka",
    venue: "https://maps.google.com/?q=Sheraton+Grand+Bangalore",
    address: "Sheraton Grand, Whitefield, Bangalore",
    capacity: 500,
    ticketType: "paid",
    ticketPrice: 2500,
    coverImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
    themeColor: "#0f172a",
  },
  {
    title: "Jazz by the Bay",
    description: `An enchanting evening of smooth jazz and soulful melodies by the sea!

Featuring:
- International jazz quartets
- Local saxophone legends
- Improvisational jam sessions
- Wine and cheese tasting

Relax under the stars and enjoy the rhythm of the night. Perfect for a romantic date or a chill evening with friends.`,
    category: "music",
    tags: ["music", "jazz", "concert", "nightlife"],
    city: "Mumbai",
    state: "Maharashtra",
    venue: "https://maps.google.com/?q=Marine+Drive+Mumbai",
    address: "Open Air Theatre, Marine Drive, Mumbai",
    capacity: 200,
    ticketType: "paid",
    ticketPrice: 1500,
    coverImage:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&q=80",
    themeColor: "#4a044e",
  },
  {
    title: "Digital Marketing Masterclass",
    description: `Master the art of digital marketing in this intensive one-day workshop!

Curriculum:
- SEO & SEM strategies
- Social media growth hacking
- Content marketing that converts
- Email marketing automation
- Analytics and ROI measurement

Led by industry experts with proven track records. Certificate of completion provided.`,
    category: "business",
    tags: ["business", "marketing", "digital", "growth"],
    city: "Delhi",
    state: "Delhi",
    venue: "https://maps.google.com/?q=India+Habitat+Centre",
    address: "India Habitat Centre, Lodhi Road, Delhi",
    capacity: 60,
    ticketType: "paid",
    ticketPrice: 3000,
    coverImage:
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&q=80",
    themeColor: "#c2410c",
  },
  {
    title: "Pottery Workshop for Beginners",
    description: `Get your hands dirty and create something beautiful!

What you'll learn:
- Basics of clay preparation
- Wheel throwing techniques
- Hand-building methods
- Glazing and firing basics

Take home your own handmade mug or bowl. No prior experience needed. All materials included.`,
    category: "art",
    tags: ["art", "craft", "workshop", "creative"],
    city: "Pune",
    state: "Maharashtra",
    venue: "https://maps.google.com/?q=Koregaon+Park+Pune",
    address: "The Clay Studio, Koregaon Park, Pune",
    capacity: 15,
    ticketType: "paid",
    ticketPrice: 1200,
    coverImage:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80",
    themeColor: "#a16207",
  },
  {
    title: "Marathon for a Cause",
    description: `Run for a greener future! Join our annual charity marathon.

Categories:
- 5K Fun Run
- 10K Challenge
- Half Marathon (21K)

Proceeds go towards local tree plantation drives. Medal and breakfast for all finishers.`,
    category: "sports",
    tags: ["sports", "running", "marathon", "charity"],
    city: "Hyderabad",
    state: "Telangana",
    venue: "https://maps.google.com/?q=Necklace+Road+Hyderabad",
    address: "People's Plaza, Necklace Road, Hyderabad",
    capacity: 1000,
    ticketType: "paid",
    ticketPrice: 500,
    coverImage:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&q=80",
    themeColor: "#15803d",
  },
  {
    title: "Street Food Festival",
    description: `A culinary journey through the flavors of India!

Highlights:
- Over 50 food stalls
- Regional delicacies from 20 states
- Live cooking demonstrations
- Food photography contest
- Live music performances

Come hungry, leave happy! Entry ticket covers tasting portions at select stalls.`,
    category: "food",
    tags: ["food", "festival", "culture", "street-food"],
    city: "Kolkata",
    state: "West Bengal",
    venue: "https://maps.google.com/?q=Eco+Park+Kolkata",
    address: "Eco Park, New Town, Kolkata",
    capacity: 500,
    ticketType: "paid",
    ticketPrice: 200,
    coverImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
    themeColor: "#b91c1c",
  },
  {
    title: "Holistic Wellness Retreat",
    description: `Rejuvenate your mind, body, and soul in the lap of nature.

Includes:
- Ayurvedic consultation
- Yoga and meditation sessions
- Organic spa treatments
- Nature walks
- Detox meals

A perfect weekend getaway to disconnect from the chaos and reconnect with yourself.`,
    category: "health",
    tags: ["health", "wellness", "retreat", "yoga"],
    city: "Kochi",
    state: "Kerala",
    venue: "https://maps.google.com/?q=Fort+Kochi",
    address: "Wellness Resort, Fort Kochi, Kerala",
    capacity: 20,
    ticketType: "paid",
    ticketPrice: 5000,
    coverImage:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80",
    themeColor: "#047857",
  },
  {
    title: "Retro Gaming Night",
    description: `Relive the golden era of gaming!

Games available:
- Pac-Man, Mario, Sonic
- Street Fighter II tournaments
- Classic pinball machines
- Console corner (NES, SEGA, PS1)

Cosplay encouraged! Winner of the high-score challenge gets a vintage console.`,
    category: "gaming",
    tags: ["gaming", "retro", "arcade", "fun"],
    city: "Bangalore",
    state: "Karnataka",
    venue: "https://maps.google.com/?q=Indiranagar+Bangalore",
    address: "Arcade Bar, Indiranagar, Bangalore",
    capacity: 50,
    ticketType: "paid",
    ticketPrice: 800,
    coverImage:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
    themeColor: "#7c3aed",
  },
  {
    title: "Founders Mixer",
    description: `An exclusive evening for startup founders and innovators.

Agenda:
- Fireside chat with a unicorn founder
- Structured networking sessions
- Problem-solving roundtables
- Cocktails and dinner

Strictly for founders and C-level executives. Approval required for registration.`,
    category: "business",
    tags: ["business", "startup", "networking", "founders"],
    city: "Hyderabad",
    state: "Telangana",
    venue: "https://maps.google.com/?q=Hitex+Hyderabad",
    address: "Novotel, HICC Complex, Hyderabad",
    capacity: 30,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
    themeColor: "#1e40af",
  },
  {
    title: "Midnight Cycling Tour",
    description: `Explore the city lights on two wheels!

Route:
- Colaba Causeway
- Marine Drive
- Gateway of India
- CST Station

Safety gear and cycles provided. Refreshments at the end of the ride. Experience Mumbai like never before.`,
    category: "outdoor",
    tags: ["outdoor", "cycling", "adventure", "night"],
    city: "Mumbai",
    state: "Maharashtra",
    venue: "https://maps.google.com/?q=Colaba+Mumbai",
    address: "Start Point: Colaba Causeway, Mumbai",
    capacity: 40,
    ticketType: "paid",
    ticketPrice: 600,
    coverImage:
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1200&q=80",
    themeColor: "#111827",
  },
  {
    title: "Charity Gala Dinner",
    description: `A night of elegance and giving back.

Program:
- Live orchestral performance
- Silent auction
- Keynote address by social activists
- Gourmet 4-course dinner

All funds raised support child education initiatives. Dress code: Black Tie.`,
    category: "community",
    tags: ["community", "charity", "gala", "social-cause"],
    city: "Delhi",
    state: "Delhi",
    venue: "https://maps.google.com/?q=Taj+Palace+Delhi",
    address: "Taj Palace, Chanakyapuri, Delhi",
    capacity: 150,
    ticketType: "paid",
    ticketPrice: 5000,
    coverImage:
      "https://unsplash.com/photos/a-table-set-up-for-a-party-with-candles-and-flowers--3pvRUfQc-c",
    themeColor: "#be123c",
  },
  {
    title: "Data Science Bootcamp",
    description: `Launch your career in Data Science!

Modules:
- Python for Data Science
- Exploratory Data Analysis
- Machine Learning Algorithms
- Data Visualization with Tableau
- Capstone Project

Intensive weekend program. Mentorship from industry data scientists.`,
    category: "education",
    tags: ["education", "data-science", "python", "bootcamp"],
    city: "Bangalore",
    state: "Karnataka",
    venue: "https://maps.google.com/?q=HSR+Layout+Bangalore",
    address: "TechHub, HSR Layout, Bangalore",
    capacity: 25,
    ticketType: "paid",
    ticketPrice: 4000,
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    themeColor: "#0e7490",
  },
  {
    title: "Stand-up Comedy Special",
    description: `Get ready to laugh your heart out!

Lineup:
- 3 Opening Acts
- Headliner: [Surprise Celebrity Comic]
- Improv Comedy segment

Grab a drink, sit back, and enjoy the show. Strictly 18+.`,
    category: "art",
    tags: ["art", "comedy", "entertainment", "nightlife"],
    city: "Mumbai",
    state: "Maharashtra",
    venue: "https://maps.google.com/?q=Canvas+Laugh+Club",
    address: "Canvas Laugh Club, Lower Parel, Mumbai",
    capacity: 100,
    ticketType: "paid",
    ticketPrice: 750,
    coverImage:
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&q=80",
    themeColor: "#b45309",
  },
  {
    title: "Organic Farmers Market",
    description: `Fresh, local, and sustainable!

Available:
- Organic fruits and vegetables
- Homemade jams and pickles
- Handcrafted soaps
- Eco-friendly products

Meet the farmers and learn about sustainable living. Bring your own bags!`,
    category: "community",
    tags: ["community", "organic", "market", "sustainable"],
    city: "Pune",
    state: "Maharashtra",
    venue: "https://maps.google.com/?q=Empress+Garden+Pune",
    address: "Empress Garden, Camp, Pune",
    capacity: 200,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&q=80",
    themeColor: "#166534",
  },
  {
    title: "Blockchain Developers Conference",
    description: `Building the decentralized future.

Tracks:
- Smart Contract Security
- DeFi Protocols
- NFT Standards
- Layer 2 Scaling Solutions
- Web3 Infrastructure

Hackathon included! Win prizes in crypto.`,
    category: "tech",
    tags: ["tech", "blockchain", "web3", "crypto"],
    city: "Hyderabad",
    state: "Telangana",
    venue: "https://maps.google.com/?q=HICC+Hyderabad",
    address: "HICC, Kondapur, Hyderabad",
    capacity: 300,
    ticketType: "paid",
    ticketPrice: 1500,
    coverImage:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80",
    themeColor: "#4338ca",
  },
  {
    title: "Poetry Under the Stars",
    description: `An intimate evening of spoken word and poetry.

Featuring:
- Renowned contemporary poets
- Open mic slots for aspiring writers
- Live acoustic background music
- Book signing session

Bring a blanket and your favorite verses. Coffee and pastries available.`,
    category: "literature",
    tags: ["literature", "poetry", "arts", "open-mic"],
    city: "Jaipur",
    state: "Rajasthan",
    venue: "https://maps.google.com/?q=Diggi+Palace+Jaipur",
    address: "Diggi Palace, Jaipur",
    capacity: 80,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1490633874781-1c63cc424610?w=1200&q=80",
    themeColor: "#701a75",
  },
  {
    title: "Sustainable Fashion Week",
    description: `Discover the future of fashion!

Showcasing:
- Eco-friendly clothing lines
- Upcycling workshops
- Panel talks on ethical fashion
- Pop-up thrift store

Meet designers who are changing the industry. Shop guilt-free!`,
    category: "fashion",
    tags: ["fashion", "sustainable", "lifestyle", "shopping"],
    city: "Mumbai",
    state: "Maharashtra",
    venue: "https://maps.google.com/?q=Jio+World+Drive+Mumbai",
    address: "Jio World Drive, BKC, Mumbai",
    capacity: 300,
    ticketType: "paid",
    ticketPrice: 1000,
    coverImage:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&q=80",
    themeColor: "#059669",
  },
  {
    title: "Stargazing & Astronomy Night",
    description: `Explore the cosmos with expert astronomers.

Activities:
- Telescope viewing sessions
- Constellation mapping
- Astrophotography basics
- Talk on "Life on Mars"

Escape the city lights and witness the beauty of the universe. Camping options available.`,
    category: "science",
    tags: ["science", "astronomy", "outdoor", "education"],
    city: "Bangalore",
    state: "Karnataka",
    venue: "https://maps.google.com/?q=Nandi+Hills+Bangalore",
    address: "Nandi Hills, Bangalore",
    capacity: 40,
    ticketType: "paid",
    ticketPrice: 1200,
    coverImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
    themeColor: "#172554",
  },
  {
    title: "Puppy Yoga & Adoption Drive",
    description: `Yoga with a dose of cuteness!

Event details:
- 45-minute yoga session with puppies
- Meet adoptable dogs from local shelters
- Dog training tips from experts
- Pet photography booth

All proceeds go to animal welfare. Bring your own mat!`,
    category: "pets",
    tags: ["pets", "yoga", "charity", "wellness"],
    city: "Delhi",
    state: "Delhi",
    venue: "https://maps.google.com/?q=Lodhi+Garden+Delhi",
    address: "Lodhi Garden, Delhi",
    capacity: 30,
    ticketType: "paid",
    ticketPrice: 800,
    coverImage:
      "https://images.unsplash.com/photo-1544568100-847a948585b9?w=1200&q=80",
    themeColor: "#db2777",
  },
  {
    title: "Indie Film Festival 2025",
    description: `Celebrating independent cinema from around the globe.

Screenings:
- Award-winning short films
- Documentaries on social issues
- Experimental cinema
- Q&A with directors

Popcorn and soda on the house! Vote for the Audience Choice Award.`,
    category: "film",
    tags: ["film", "cinema", "festival", "arts"],
    city: "Kolkata",
    state: "West Bengal",
    venue: "https://maps.google.com/?q=Nandan+Kolkata",
    address: "Nandan, Kolkata",
    capacity: 150,
    ticketType: "paid",
    ticketPrice: 300,
    coverImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80",
    themeColor: "#9f1239",
  },
  {
    title: "Heritage Walk: Old City Secrets",
    description: `Walk through history in the lanes of the Old City.

Highlights:
- Visit 200-year-old havelis
- Stories of forgotten kings
- Traditional food tasting
- Architecture photography tips

Guided by a historian. Comfortable walking shoes recommended.`,
    category: "history",
    tags: ["history", "culture", "walking-tour", "education"],
    city: "Ahmedabad",
    state: "Gujarat",
    venue: "https://maps.google.com/?q=Sidi+Saiyyed+Mosque",
    address: "Sidi Saiyyed Mosque, Ahmedabad",
    capacity: 20,
    ticketType: "paid",
    ticketPrice: 500,
    coverImage:
      "https://images.unsplash.com/photo-1583486826685-697968541a36?w=1200&q=80",
    themeColor: "#78350f",
  },
  {
    title: "Robotics Workshop for Kids",
    description: `Build your first robot!

Curriculum:
- Introduction to electronics
- assembling a line-follower robot
- Basic coding logic
- Robot race competition

Kit included. Perfect for ages 10-15. Parents welcome to observe.`,
    category: "science",
    tags: ["science", "robotics", "kids", "education"],
    city: "Chennai",
    state: "Tamil Nadu",
    venue: "https://maps.google.com/?q=IIT+Madras+Research+Park",
    address: "IIT Madras Research Park, Chennai",
    capacity: 25,
    ticketType: "paid",
    ticketPrice: 2000,
    coverImage:
      "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=1200&q=80",
    themeColor: "#0284c7",
  },
  {
    title: "Vintage Car Rally",
    description: `A showcase of classic automobiles.

Features:
- Over 50 vintage cars and bikes
- Restoration workshops
- Jazz band performance
- Best Dressed (Vintage Theme) contest

A treat for petrolheads and history buffs alike.`,
    category: "history",
    tags: ["history", "cars", "vintage", "lifestyle"],
    city: "Gurgaon",
    state: "Haryana",
    venue: "https://maps.google.com/?q=Leisure+Valley+Park+Gurgaon",
    address: "Leisure Valley Park, Gurgaon",
    capacity: 500,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",
    themeColor: "#b45309",
  },
  {
    title: "DIY Home Decor Workshop",
    description: `Spruce up your space on a budget!

Learn to make:
- Macrame wall hangings
- Painted terracotta pots
- Scented candles
- Upcycled bottle lamps

All materials provided. Take home your creations!`,
    category: "art",
    tags: ["art", "diy", "craft", "home"],
    city: "Bangalore",
    state: "Karnataka",
    venue: "https://maps.google.com/?q=Koramangala+Bangalore",
    address: "The Art House, Koramangala, Bangalore",
    capacity: 15,
    ticketType: "paid",
    ticketPrice: 1500,
    coverImage:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&q=80",
    themeColor: "#d97706",
  },
  {
    title: "Book Launch: 'The Future is Now'",
    description: `Launch of the highly anticipated sci-fi novel by [Author Name].

Agenda:
- Author reading
- Panel discussion on AI in fiction
- Book signing
- High tea

Get a signed copy at a discounted price!`,
    category: "literature",
    tags: ["literature", "books", "scifi", "culture"],
    city: "Hyderabad",
    state: "Telangana",
    venue: "https://maps.google.com/?q=Crossword+Bookstore+Hyderabad",
    address: "Crossword Bookstore, GVK One Mall, Hyderabad",
    capacity: 50,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1200&q=80",
    themeColor: "#4338ca",
  },
  {
    title: "Pet Grooming Masterclass",
    description: `Learn to groom your furry friend like a pro!

Topics:
- Brushing and detangling techniques
- Nail trimming safety
- Bathing best practices
- Ear and eye cleaning

Demonstration on live models. Q&A with a certified groomer.`,
    category: "pets",
    tags: ["pets", "grooming", "education", "workshop"],
    city: "Pune",
    state: "Maharashtra",
    venue: "https://maps.google.com/?q=Viman+Nagar+Pune",
    address: "Pawfect Spa, Viman Nagar, Pune",
    capacity: 20,
    ticketType: "paid",
    ticketPrice: 1000,
    coverImage:
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=1200&q=80",
    themeColor: "#be185d",
  },
  {
    title: "Cosplay Convention 2025",
    description: `The ultimate gathering for pop culture fans!

Events:
- Cosplay championship
- Anime screenings
- Manga exchange
- Gaming zone
- Artist alley

Dress up as your favorite character and win big prizes!`,
    category: "fashion",
    tags: ["fashion", "cosplay", "anime", "pop-culture"],
    city: "Delhi",
    state: "Delhi",
    venue: "https://maps.google.com/?q=Pragati+Maidan+Delhi",
    address: "Pragati Maidan, Delhi",
    capacity: 1000,
    ticketType: "paid",
    ticketPrice: 500,
    coverImage:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=1200&q=80",
    themeColor: "#6d28d9",
  },
];

// Helper functions
function getRandomFutureDate(minDays = 7, maxDays = 90) {
  const now = Date.now();
  const randomDays = Math.floor(Math.random() * (maxDays - minDays) + minDays);
  return now + randomDays * 24 * 60 * 60 * 1000;
}

function getEventEndTime(startTime) {
  const durationHours = Math.floor(Math.random() * 3) + 2;
  return startTime + durationHours * 60 * 60 * 1000;
}

function generateSlug(title) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    `-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
  );
}

// RUN THIS DIRECTLY FROM CONVEX DASHBOARD
// Go to Dashboard > Functions > seed:run > Run
export const run = internalMutation({
  handler: async (ctx) => {
    // First, get or create a default organizer user
    let organizer = await ctx.db.query("users").first();

    if (!organizer) {
      // Create a default organizer if no users exist
      const organizerId = await ctx.db.insert("users", {
        email: "organizer@eventhub.com",
        tokenIdentifier: "seed-user-token",
        name: "EventHub Team",
        hasCompletedOnboarding: true,
        location: {
          city: "Bangalore",
          state: "Karnataka",
          country: "India",
        },
        interests: ["tech", "music", "business"],
        freeEventsCreated: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      organizer = await ctx.db.get(organizerId);
    }

    const createdEvents = [];

    for (const eventData of SAMPLE_EVENTS) {
      const startDate = getRandomFutureDate();
      const endDate = getEventEndTime(startDate);
      const registrationCount = Math.floor(
        Math.random() * eventData.capacity * 0.7
      );

      const event = {
        ...eventData,
        slug: generateSlug(eventData.title),
        organizerId: organizer._id,
        organizerName: organizer.name,
        startDate,
        endDate,
        timezone: "Asia/Kolkata",
        locationType: "physical",
        country: "India",
        registrationCount,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const eventId = await ctx.db.insert("events", event);
      createdEvents.push(eventData.title);
    }

    console.log(`✅ Successfully seeded ${createdEvents.length} events!`);
    return {
      success: true,
      count: createdEvents.length,
      events: createdEvents,
    };
  },
});

// Optional: Clear all events
export const clear = internalMutation({
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();
    let count = 0;

    for (const event of events) {
      const regs = await ctx.db
        .query("registrations")
        .withIndex("by_event", (q) => q.eq("eventId", event._id))
        .collect();

      for (const reg of regs) {
        await ctx.db.delete(reg._id);
      }

      await ctx.db.delete(event._id);
      count++;
    }

    console.log(`🗑️ Cleared ${count} events`);
    return { success: true, deleted: count };
  },
});
