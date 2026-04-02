export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import bcryptjs from "bcryptjs";
import User from "@/models/User";
import SiteSettings from "@/models/SiteSettings";
import Sector from "@/models/Sector";
import News from "@/models/News";
import Resource from "@/models/Resource";
import Gallery from "@/models/Gallery";
import TeamMember from "@/models/TeamMember";
import AboutContent from "@/models/AboutContent";

export async function GET() {
  // Block in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Seed route is disabled in production." },
      { status: 403 }
    );
  }

  try {
    await connectDB();
    const results: Record<string, string> = {};

    // ─── 1. Seed Superadmin User ────────────────────────────────────────

    const existingAdmin = await User.findOne({ role: "superadmin" });

    if (!existingAdmin) {
      const email = process.env.SUPERADMIN_EMAIL;
      const password = process.env.SUPERADMIN_PASSWORD;

      if (!email || !password) {
        results.superadmin =
          "Skipped — SUPERADMIN_EMAIL or SUPERADMIN_PASSWORD not set in env";
      } else {
        const hashedPassword = await bcryptjs.hash(password, 10);

        await User.create({
          name: "Super Admin",
          email,
          password: hashedPassword,
          role: "superadmin",
        });

        results.superadmin = "Created superadmin user";
      }
    } else {
      results.superadmin = "Superadmin already exists — skipped";
    }

    // ─── 2. Seed Site Settings ──────────────────────────────────────────

    const settingsToSeed = [
      {
        key: "menu_order",
        value: [
          { label: "Home", href: "/", order: 0 },
          { label: "About", href: "/about", order: 1 },
          {
            label: "Sectors",
            href: "/sectors",
            order: 2,
            children: [
              { label: "Health", href: "/sectors/health" },
              { label: "Nutrition", href: "/sectors/nutrition" },
              { label: "Education", href: "/sectors/education" },
              { label: "WaSH", href: "/sectors/wash" },
              { label: "Food Security & Livelihood", href: "/sectors/food-security-and-livelihood" },
              { label: "DRR", href: "/sectors/drr" },
              { label: "Climate Change", href: "/sectors/climate-change" },
              { label: "Protection", href: "/sectors/protection" },
              { label: "Agriculture", href: "/sectors/agriculture" },
            ],
          },
          { label: "News & Stories", href: "/news", order: 3 },
          { label: "Resources", href: "/resources", order: 4 },
          { label: "Gallery", href: "/gallery", order: 5 },
          { label: "Get Involved", href: "/get-involved", order: 6 },
          { label: "Contact", href: "/contact", order: 7 },
        ],
      },
      {
        key: "hero_slides",
        value: [
          {
            title: "Empowering Communities Since 2002",
            subtitle:
              "AROHI works for socio-economic development of disadvantaged people across Barisal Division, Southern Bangladesh.",
            ctaText: "Learn More",
            ctaLink: "/about",
          },
          {
            title: "Health, Nutrition & Education for All",
            subtitle:
              "Providing essential health services, nutrition support, and quality education to vulnerable communities in rural and remote areas.",
            ctaText: "Our Programs",
            ctaLink: "/sectors/health",
          },
          {
            title: "Building Resilience Against Climate Change",
            subtitle:
              "Strengthening disaster preparedness, promoting climate adaptation, and supporting sustainable livelihoods for coastal communities.",
            ctaText: "Get Involved",
            ctaLink: "/get-involved",
          },
        ],
      },
      {
        key: "stats",
        value: [
          { label: "Years of Service", value: "23+", icon: "Calendar" },
          { label: "Working Districts", value: "3", icon: "MapPin" },
          { label: "Beneficiaries Reached", value: "50,000+", icon: "Users" },
          { label: "Active Programs", value: "17+", icon: "Briefcase" },
        ],
      },
      {
        key: "partner_logos",
        value: [
          { name: "NGO Forum for Public Health", logo: "" },
          { name: "Department of Social Welfare", logo: "" },
          { name: "USAID-DAI", logo: "" },
          { name: "World Bank", logo: "" },
          { name: "DPHE", logo: "" },
          { name: "Department of Agriculture", logo: "" },
          { name: "ACDI/VOCA", logo: "" },
          { name: "The Hunger Project", logo: "" },
        ],
      },
    ];

    const settingsResults: string[] = [];

    for (const setting of settingsToSeed) {
      const existing = await SiteSettings.findOne({ key: setting.key });
      if (!existing) {
        await SiteSettings.create(setting);
        settingsResults.push(`${setting.key} — created`);
      } else {
        settingsResults.push(`${setting.key} — already exists, skipped`);
      }
    }

    results.siteSettings = settingsResults.join("; ");

    // ─── 3. Seed Sectors ────────────────────────────────────────────────

    const sectorsToSeed = [
      {
        name: "Health",
        slug: "health",
        description:
          "Delivering essential healthcare services to rural and remote communities including maternal health, child health, and disease prevention across Barisal Division.",
        icon: "HeartPulse",
        order: 1,
        stats: [
          { label: "Health Camps Conducted", value: "200+", icon: "Hospital" },
          { label: "Beneficiaries Served", value: "15,000+", icon: "Users" },
          { label: "Child Eye Care Cases", value: "5,000+", icon: "Eye" },
        ],
        programs: [
          {
            title: "Health & Nutrition Support Program",
            description:
              "Providing health and nutrition support services in rural and urban areas of Barisal City Corporation.",
          },
          {
            title: "Child Eye Health Care",
            description:
              "Child eye health care project in Barisal District with BCC, supported by Ispahani Islamia Eye Institute & Hospital, Barishal.",
          },
          {
            title: "Maternal & Child Health",
            description:
              "Reducing maternal and child mortality through awareness campaigns, health education, and referral support.",
          },
        ],
        achievements: [
          "Conducted 200+ health camps across Barisal Division",
          "Provided child eye health care services in Barisal District",
          "Improved maternal and child health outcomes in target communities",
        ],
      },
      {
        name: "Nutrition",
        slug: "nutrition",
        description:
          "Addressing malnutrition among children, pregnant women, and lactating mothers through community-based nutrition programs and policy advocacy.",
        icon: "Apple",
        order: 2,
        stats: [
          { label: "Communities Reached", value: "96+", icon: "MapPin" },
          { label: "Children Screened", value: "8,000+", icon: "Baby" },
          { label: "Mothers Supported", value: "3,000+", icon: "Heart" },
        ],
        programs: [
          {
            title: "Community-Based Nutrition",
            description:
              "Screening, counseling, and treatment support for malnourished children and mothers in rural villages.",
          },
          {
            title: "National Nutrition Policy Advocacy",
            description:
              "Identifying gaps in the National Nutrition Policy (NNP-2015) and advocating for improvements through CSA for SUN network.",
          },
          {
            title: "Infant & Young Child Feeding",
            description:
              "Promoting exclusive breastfeeding, appropriate complementary feeding, and maternal nutrition education.",
          },
        ],
        achievements: [
          "Active member of CSA for SUN (Scaling Up Nutrition) network",
          "Identified gaps in National Nutrition Policy (NNP-2015)",
          "Reached thousands of children and mothers with nutrition support",
        ],
      },
      {
        name: "Education",
        slug: "education",
        description:
          "Providing quality education support, empowerment programs, and learning opportunities for disadvantaged children and youth in Barisal Division.",
        icon: "GraduationCap",
        order: 3,
        stats: [
          { label: "Students Supported", value: "2,000+", icon: "Users" },
          { label: "Schools Engaged", value: "50+", icon: "School" },
          { label: "Scholarships Given", value: "500+", icon: "Award" },
        ],
        programs: [
          {
            title: "Education Support for Poor Students",
            description:
              "Providing educational support for underprivileged students funded by Depti Foundation.",
          },
          {
            title: "PROKAS Education Program",
            description:
              "Promoting Rights, Opportunities and Knowledge for All through strengthening capacity of local organizations.",
          },
          {
            title: "Youth Skills Development",
            description:
              "Building capacity of youth through career skill clubs and vocational training programs.",
          },
        ],
        achievements: [
          "Supported education of thousands of underprivileged students",
          "Implemented PROKAS program funded by international partners",
          "Member of CAMPE (Campaign for Popular Education)",
        ],
      },
      {
        name: "Water Sanitation and Hygiene (WaSH)",
        slug: "wash",
        description:
          "Ensuring access to safe drinking water, sanitary latrines, and hygiene awareness in rural and coastal communities of Barisal Division.",
        icon: "Droplets",
        order: 4,
        stats: [
          { label: "Tubewells Installed", value: "300+", icon: "Droplet" },
          { label: "Latrines Constructed", value: "1,500+", icon: "Building" },
          { label: "People Reached", value: "20,000+", icon: "Users" },
        ],
        programs: [
          {
            title: "Bangladesh Rural Water Supply & Sanitation (BRWSSP)",
            description:
              "Rural water supply and sanitation project through NGO Forum for Public Health, funded by GOB-World Bank and DPHE.",
          },
          {
            title: "Sustainable Hygiene Promotion",
            description:
              "Developing sustainable hygiene promotion programs in hotel-based and community settings.",
          },
          {
            title: "Safe Water & Sanitation Access",
            description:
              "Constructing sources of safe drinking water and sanitary latrines in underserved areas.",
          },
        ],
        achievements: [
          "Implemented BRWSSP project with NGO Forum for Public Health",
          "Installed hundreds of tubewells and sanitary latrines",
          "Member of Global Water Partnership (GWP) and Bangladesh Water Partnership (BWP)",
        ],
      },
      {
        name: "Food Security & Livelihood",
        slug: "food-security-and-livelihood",
        description:
          "Reducing poverty through income generating activities, micro-enterprise promotion, and agricultural livelihood support for rural communities.",
        icon: "Wheat",
        order: 5,
        stats: [
          { label: "Farmers Supported", value: "500+", icon: "Users" },
          { label: "Micro-Enterprises", value: "200+", icon: "Store" },
          { label: "VGD Beneficiaries", value: "5,000+", icon: "Handshake" },
        ],
        programs: [
          {
            title: "Vulnerable Group Development (VGD)",
            description:
              "VGD program funded by Department of Women Affairs, providing food security support to vulnerable women.",
          },
          {
            title: "Micro-Enterprise Promotion",
            description:
              "Building small-scale entrepreneurship and providing training and monetary support for income generating activities.",
          },
          {
            title: "Agricultural Livelihood Support",
            description:
              "Supporting farmers through AROHI Agro Business (AAB) with modern farming techniques, contract farming, and market linkages.",
          },
        ],
        achievements: [
          "Implemented VGD program through Department of Women Affairs",
          "Established AROHI Agro Business (AAB) supporting 500+ farmers",
          "Promoted micro-enterprises for poverty reduction",
        ],
      },
      {
        name: "Disaster Risk Reduction (DRR)",
        slug: "drr",
        description:
          "Strengthening community resilience against natural disasters including floods, cyclones, tidal surges, and river erosion in the coastal belt of Barisal Division.",
        icon: "ShieldAlert",
        order: 6,
        stats: [
          { label: "Communities Prepared", value: "60+", icon: "Shield" },
          { label: "Disaster Responses", value: "30+", icon: "AlertTriangle" },
          { label: "Families Rehabilitated", value: "3,000+", icon: "Home" },
        ],
        programs: [
          {
            title: "Community-Based Disaster Preparedness",
            description:
              "Training communities on early warning systems, evacuation planning, and emergency preparedness in cyclone-prone coastal areas.",
          },
          {
            title: "Post-Disaster Rehabilitation",
            description:
              "Rehabilitating families affected by floods, cyclones, tornados, tidal waves, and river erosion.",
          },
          {
            title: "South Western Bangladesh Rural Development",
            description:
              "SWBRDPO project funded by JICA through LGED, focused on rural development and disaster resilience.",
          },
        ],
        achievements: [
          "Responded to 30+ natural disaster events across Barisal Division",
          "Rehabilitated thousands of families affected by cyclones and floods",
          "Member of District Disaster Rehabilitation (DRR) committee",
        ],
      },
      {
        name: "Climate Change",
        slug: "climate-change",
        description:
          "Promoting climate justice, environmental awareness, and sustainable practices for communities in the vulnerable coastal belt of southern Bangladesh.",
        icon: "Leaf",
        order: 7,
        stats: [
          { label: "Awareness Campaigns", value: "100+", icon: "Megaphone" },
          { label: "Communities Engaged", value: "50+", icon: "Users" },
          { label: "Environmental Projects", value: "15+", icon: "TreePine" },
        ],
        programs: [
          {
            title: "Climate Justice Awareness",
            description:
              "Creating awareness about environment and climate justice among coastal communities vulnerable to climate change impacts.",
          },
          {
            title: "Eco-Friendly Agriculture",
            description:
              "Promoting eco-friendly agro chemicals and sustainable farming practices through AROHI Agro Business.",
          },
          {
            title: "Environmental Conservation",
            description:
              "Working with Department of Environment and Department of Forest on environmental conservation initiatives.",
          },
        ],
        achievements: [
          "Conducted 100+ climate awareness campaigns in coastal areas",
          "Promoted eco-friendly agricultural practices among 500+ farmers",
          "Active coordination with Department of Environment and Department of Forest",
        ],
      },
      {
        name: "Protection",
        slug: "protection",
        description:
          "Safeguarding human rights, women's rights, child rights, and providing legal aid and support to vulnerable and marginalized communities.",
        icon: "Shield",
        order: 8,
        stats: [
          { label: "Legal Aid Cases", value: "1,000+", icon: "FileText" },
          { label: "Awareness Sessions", value: "500+", icon: "Users" },
          { label: "PWD Supported", value: "2,000+", icon: "Heart" },
        ],
        programs: [
          {
            title: "Rights of Persons with Disabilities",
            description:
              "Promoting rights of people with disabilities through disability-inclusive local governance and Social Welfare Department programs.",
          },
          {
            title: "Legal Aid & Human Rights",
            description:
              "Providing legal aid education, support on human rights, women's rights, child rights, and anti-trafficking awareness.",
          },
          {
            title: "Consumer Rights & Food Safety",
            description:
              "Program on consumer rights promotion and food safety under Food Safety Network of Bangladesh and CAB.",
          },
        ],
        achievements: [
          "Provided legal aid to 1,000+ vulnerable individuals",
          "Operated disability development programs through Social Welfare Department",
          "Active member of ALRD (Association for Land Reform and Development)",
        ],
      },
      {
        name: "Agriculture",
        slug: "agriculture",
        description:
          "Modernizing agricultural practices, supporting farmers with technical knowledge, quality inputs, and market access through AROHI Agro Business (AAB).",
        icon: "Sprout",
        order: 9,
        stats: [
          { label: "Farmers Enlisted", value: "500+", icon: "Users" },
          { label: "IPM/ICM Clubs", value: "20+", icon: "Leaf" },
          { label: "Products Marketed", value: "4+", icon: "Package" },
        ],
        programs: [
          {
            title: "Contract Farming & Marketing",
            description:
              "Contract farming with rural farmers for mung bean, rice, handmade puffed rice, and milk production with guaranteed market access.",
          },
          {
            title: "ICM/IPM Capacity Building",
            description:
              "Agriculture-based livelihood and capacity development for ICM/IPM club members through Department of Agriculture.",
          },
          {
            title: "Agro Processing & Branding",
            description:
              "Processing and branding of mung dal, frozen milk, and handmade puffed rice through AROHI Agro Business (AAB).",
          },
        ],
        achievements: [
          "Established AROHI Agro Business (AAB) in 2015",
          "Enlisted 500+ farmers in contract farming across Barisal",
          "Successfully marketed branded mung dal, frozen milk, and puffed rice products",
        ],
      },
    ];

    const existingSectorCount = await Sector.countDocuments();

    if (existingSectorCount === 0) {
      await Sector.insertMany(sectorsToSeed);
      results.sectors = `Created ${sectorsToSeed.length} sectors`;
    } else {
      results.sectors = `${existingSectorCount} sectors already exist — skipped`;
    }

    // ─── 4. Seed News ──────────────────────────────────────────────────

    const newsToSeed = [
      {
        title: "AROHI Launches PROKAS Program for Community Empowerment",
        slug: "arohi-launches-prokas-program",
        category: "Education",
        excerpt:
          "AROHI has launched the PROKAS program — Promoting Rights, Opportunities and Knowledge for All — funded by international partners to strengthen capacity of local organizations in Barisal.",
        content: `<p>AROHI has officially launched the PROKAS (Promoting Rights, Opportunities and Knowledge for All through Strengthening Capacity of Local based Organisations) program in Barisal Division. The program, funded by NAGORIKATA, BLAST, GFA, and supported by Canada and Switzerland, aims to empower local communities through education, rights awareness, and organizational capacity building.</p>
<p>The PROKAS program focuses on building the capacity of community-based organizations to deliver services effectively and advocate for the rights of marginalized populations. Training modules cover organizational management, financial accountability, program design, and community mobilization techniques.</p>
<p>AROHI Executive Director A.T.M. Khorshed Alam stated that this initiative represents a significant step forward in AROHI's mission to bring socio-economic and cultural development to the lives of vulnerable communities in southern Bangladesh. The program will operate across multiple upazilas in Barisal Division.</p>`,
        author: "Admin",
        published: true,
        image: "",
      },
      {
        title: "Child Eye Health Care Project Expands in Barisal",
        slug: "child-eye-health-care-expands",
        category: "Health",
        excerpt:
          "AROHI's child eye health care project in Barisal District, supported by Ispahani Islamia Eye Institute, has expanded to reach more children in underserved areas.",
        content: `<p>AROHI's child eye health care project, conducted in partnership with Ispahani Islamia Eye Institute & Hospital Barishal and Barisal City Corporation, has expanded its reach to cover additional wards and unions across the district. The project screens children for vision problems and provides referrals for treatment and corrective measures.</p>
<p>Trained health workers conduct screenings at schools and community centers, identifying children with refractive errors, infections, and other eye conditions that can be treated early. Children requiring further care are referred to partner hospitals for specialized treatment at no cost to their families.</p>
<p>Since its inception, the project has screened thousands of children and provided essential eye care services to those in need. Community response has been overwhelmingly positive, with parents and teachers expressing gratitude for bringing these critical services to their doorstep.</p>`,
        author: "Admin",
        published: true,
        image: "",
      },
      {
        title: "AROHI Agro Business Empowers Farmers with Contract Farming",
        slug: "aab-contract-farming-success",
        category: "Agriculture",
        excerpt:
          "AROHI Agro Business (AAB) has successfully enlisted over 500 farmers in contract farming for mung bean, rice, and milk production across Barisal District.",
        content: `<p>AROHI Agro Business (AAB), the social enterprise arm of AROHI established in 2015, has reached a milestone of enlisting over 500 farmers in its contract farming program across Barisal District. The program provides farmers with technical training on modern cultivation techniques, quality inputs including seeds, fertilizers, and eco-friendly pesticides, and guaranteed market access for their produce.</p>
<p>AAB has been particularly successful in mung bean cultivation, where farmers receive training on post-harvest management and can sell their produce directly to AAB at fair prices, eliminating middlemen and ensuring better returns. The organization also processes and brands mung dal, frozen milk, and traditional handmade puffed rice under its own label.</p>
<p>The program has created a sustainable relationship between AROHI and farming communities, where farmers benefit from guaranteed market access, technical knowledge, and quality inputs, while AAB ensures a steady supply of fresh, safe, and high-quality agricultural products for consumers in Barisal and beyond.</p>`,
        author: "Admin",
        published: true,
        image: "",
      },
      {
        title: "Disability Rights Program Strengthens Inclusive Governance",
        slug: "disability-rights-program",
        category: "Protection",
        excerpt:
          "AROHI's program for promoting rights of persons with disabilities is making strides in disability-inclusive local governance across Barisal Division.",
        content: `<p>AROHI's ongoing program for promoting the rights of Persons with Disabilities (PWD) through disability-inclusive local governance has been making significant progress in Barisal Division. Working in close collaboration with the Social Welfare Department, the program focuses on mainstreaming disability inclusion into local government planning and service delivery.</p>
<p>The program includes formation of disable self-help groups, community-based rehabilitation services, and advocacy for the rights of persons with disabilities at union, upazila, and district levels. AROHI has established Disability Development Committees at multiple levels to ensure sustained representation and participation of PWD in decision-making processes.</p>
<p>Through this initiative, hundreds of persons with disabilities have received assistive devices, skills training, and support for micro-enterprise development. The program also conducts regular awareness sessions to reduce stigma and promote acceptance of disability in rural communities.</p>`,
        author: "Admin",
        published: true,
        image: "",
      },
      {
        title: "Water Supply and Sanitation Project Benefits Rural Communities",
        slug: "brwssp-water-sanitation-project",
        category: "WaSH",
        excerpt:
          "The Bangladesh Rural Water Supply and Sanitation Project (BRWSSP) implemented by AROHI through NGO Forum has improved water access for thousands of families.",
        content: `<p>AROHI's implementation of the Bangladesh Rural Water Supply and Sanitation Project (BRWSSP) through NGO Forum for Public Health, funded by the Government of Bangladesh and the World Bank through the Department of Public Health Engineering (DPHE), has successfully improved access to safe drinking water and sanitation for thousands of families across Barisal Division.</p>
<p>The project has installed hundreds of tubewells and constructed sanitary latrines in remote and underserved areas, including char (river island) communities that previously had no access to safe water sources. Community members have been trained in water point maintenance and hygiene promotion to ensure sustainability of the infrastructure.</p>
<p>Hygiene promotion activities accompany the hardware interventions, with trained community volunteers conducting door-to-door sessions on handwashing, safe water storage, and sanitary practices. The combination of infrastructure development and behavior change communication has led to measurable improvements in health outcomes in target communities.</p>`,
        author: "Admin",
        published: true,
        image: "",
      },
      {
        title: "AROHI Celebrates 23 Years of Community Service",
        slug: "arohi-23-years-celebration",
        category: "Community",
        excerpt:
          "AROHI marks 23 years of dedicated service to disadvantaged communities in Barisal Division, reflecting on achievements and future goals.",
        content: `<p>AROHI — Association of Rural Opportunities and Human Initiatives — celebrated its 23rd anniversary, marking over two decades of dedicated service to disadvantaged and marginalized communities across Barisal Division in southern Bangladesh. Since its inception in 2002, AROHI has grown from a small local initiative to a recognized regional NGO working across multiple sectors.</p>
<p>Over the years, AROHI has implemented programs in health, nutrition, education, water sanitation and hygiene, food security and livelihood, disaster risk reduction, climate change, protection, and agriculture. The organization operates from its head office in Barisal city with field offices in Mehendiganj, BCC, Kalapara (Patuakhali), and Bhola Sadar.</p>
<p>Looking ahead, AROHI aims to expand its programs to reach more vulnerable communities, strengthen its partnerships with government and international agencies, and continue its mission of empowering disadvantaged people through sustainable development. The organization's commitment to accountability, transparency, and respect for vulnerable groups remains at the core of its work.</p>`,
        author: "Admin",
        published: true,
        image: "",
      },
    ];

    const existingNewsCount = await News.countDocuments();

    if (existingNewsCount === 0) {
      await News.insertMany(newsToSeed);
      results.news = `Created ${newsToSeed.length} news articles`;
    } else {
      results.news = `${existingNewsCount} news articles already exist — skipped`;
    }

    // ─── 5. Seed Resources ────────────────────────────────────────────

    const resourcesToSeed = [
      {
        title: "AROHI Annual Report 2024",
        description:
          "Comprehensive annual report covering AROHI's programs, achievements, financial statements, and impact across all sectors in Barisal Division.",
        fileUrl: "#",
        fileType: "PDF",
        category: "Reports",
        fileSize: "3.2 MB",
        published: true,
      },
      {
        title: "AROHI Organization Profile",
        description:
          "Detailed profile of AROHI including background, vision, mission, governance structure, working areas, and partnership information.",
        fileUrl: "#",
        fileType: "PDF",
        category: "Publications",
        fileSize: "1.8 MB",
        published: true,
      },
      {
        title: "AROHI Agro Business (AAB) Profile",
        description:
          "Profile of AROHI Agro Business covering contract farming, mung bean processing, frozen milk, and agricultural marketing operations in Barisal.",
        fileUrl: "#",
        fileType: "PDF",
        category: "Publications",
        fileSize: "2.1 MB",
        published: true,
      },
      {
        title: "WaSH Program Guidelines",
        description:
          "Operational guidelines for water supply, sanitation, and hygiene programs implemented under BRWSSP and other WaSH initiatives in Barisal Division.",
        fileUrl: "#",
        fileType: "PDF",
        category: "Guidelines",
        fileSize: "1.5 MB",
        published: true,
      },
      {
        title: "Disability Inclusion Framework",
        description:
          "Framework document for promoting rights of persons with disabilities through disability-inclusive local governance and community-based rehabilitation.",
        fileUrl: "#",
        fileType: "PDF",
        category: "Guidelines",
        fileSize: "980 KB",
        published: true,
      },
      {
        title: "Nutrition Program Data Sheet",
        description:
          "Data sheet covering nutrition screening results, malnutrition rates, and intervention outcomes across AROHI's nutrition programs in Barisal Division.",
        fileUrl: "#",
        fileType: "XLSX",
        category: "Data Sheets",
        fileSize: "750 KB",
        published: true,
      },
    ];

    const existingResourceCount = await Resource.countDocuments();

    if (existingResourceCount === 0) {
      await Resource.insertMany(resourcesToSeed);
      results.resources = `Created ${resourcesToSeed.length} resources`;
    } else {
      results.resources = `${existingResourceCount} resources already exist — skipped`;
    }

    // ─── 6. Seed Gallery ──────────────────────────────────────────────

    const galleryToSeed = [
      {
        title: "AROHI Community Health Camp",
        caption:
          "AROHI health workers conduct a community health camp in a rural village of Barisal, providing free health screenings and consultations to families.",
        imageUrl: "/images/placeholder.jpg",
        category: "Health",
        featured: true,
        order: 1,
      },
      {
        title: "Education Support for Underprivileged Students",
        caption:
          "Students receiving educational materials and support through AROHI's education empowerment program in Barisal Division.",
        imageUrl: "/images/placeholder.jpg",
        category: "Education",
        featured: true,
        order: 2,
      },
      {
        title: "AROHI Agro Business Farmer Training",
        caption:
          "Farmers in Barisal participate in a training session on modern cultivation techniques organized by AROHI Agro Business (AAB).",
        imageUrl: "/images/placeholder.jpg",
        category: "Agriculture",
        featured: true,
        order: 3,
      },
      {
        title: "Tubewell Installation in Remote Area",
        caption:
          "A newly installed tubewell providing safe drinking water to a char (river island) community through AROHI's BRWSSP program.",
        imageUrl: "/images/placeholder.jpg",
        category: "WaSH",
        featured: false,
        order: 4,
      },
      {
        title: "Disability Rights Awareness Session",
        caption:
          "Community members gather for a disability rights awareness session organized by AROHI to promote inclusion and acceptance of persons with disabilities.",
        imageUrl: "/images/placeholder.jpg",
        category: "Protection",
        featured: true,
        order: 5,
      },
      {
        title: "Disaster Preparedness Training",
        caption:
          "Coastal community members participate in a disaster preparedness training conducted by AROHI to strengthen resilience against cyclones and floods.",
        imageUrl: "/images/placeholder.jpg",
        category: "DRR",
        featured: false,
        order: 6,
      },
      {
        title: "Mung Bean Harvest with Contract Farmers",
        caption:
          "Contract farmers in Barisal harvest mung beans as part of AROHI Agro Business's sustainable agriculture and market linkage program.",
        imageUrl: "/images/placeholder.jpg",
        category: "Agriculture",
        featured: false,
        order: 7,
      },
      {
        title: "Women's Empowerment Workshop",
        caption:
          "Vulnerable women participate in a capacity building and leadership workshop organized by AROHI to promote gender equality and women's empowerment.",
        imageUrl: "/images/placeholder.jpg",
        category: "Community",
        featured: false,
        order: 8,
      },
    ];

    const existingGalleryCount = await Gallery.countDocuments();

    if (existingGalleryCount === 0) {
      await Gallery.insertMany(galleryToSeed);
      results.gallery = `Created ${galleryToSeed.length} gallery items`;
    } else {
      results.gallery = `${existingGalleryCount} gallery items already exist — skipped`;
    }

    // ─── 7. Seed Team Members ─────────────────────────────────────────

    const teamMembersToSeed = [
      {
        name: "A.T.M. Khorshed Alam",
        role: "Executive Director & Founder Member Secretary",
        bio: "A.T.M. Khorshed Alam is the founder and Executive Director of AROHI, leading the organization since its inception in 2002. A dedicated social worker, he also serves as Secretary of NATAB and Vice President of FNB-Barishal. Under his leadership, AROHI has grown from a small local initiative to a recognized regional NGO working across multiple sectors in Barisal Division, implementing 17+ programs with national and international partners.",
        photo: "",
        order: 1,
      },
      {
        name: "Md. Shabuddin",
        role: "Chairman",
        bio: "Md. Shabuddin serves as the Chairman of AROHI's governing body. A respected social worker and teacher, he provides strategic guidance and oversight to ensure the organization stays true to its mission of serving disadvantaged communities. His leadership and community standing have been instrumental in building trust and credibility for AROHI across Barisal Division.",
        photo: "",
        order: 2,
      },
      {
        name: "Gopal Sarker",
        role: "Vice-Chairman",
        bio: "Gopal Sarker serves as Vice-Chairman of AROHI's governing body. A journalist by profession, he brings valuable media expertise and community connections to the organization. His role in advocacy and public communication has helped raise awareness about AROHI's programs and the needs of vulnerable communities in southern Bangladesh.",
        photo: "",
        order: 3,
      },
      {
        name: "Md. Manirul Islam",
        role: "Treasurer",
        bio: "Md. Manirul Islam serves as Treasurer of AROHI, overseeing the organization's financial management and accountability. A businessman with strong financial acumen, he ensures that AROHI maintains transparent and responsible management of funds from donors, government agencies, and partner organizations.",
        photo: "",
        order: 4,
      },
    ];

    const existingTeamCount = await TeamMember.countDocuments();

    if (existingTeamCount === 0) {
      await TeamMember.insertMany(teamMembersToSeed);
      results.teamMembers = `Created ${teamMembersToSeed.length} team members`;
    } else {
      results.teamMembers = `${existingTeamCount} team members already exist — skipped`;
    }

    // ─── 8. Seed About Content ──────────────────────────────────────────

    let existingAbout = await AboutContent.findOne();

    // Migrate: if missionBody is empty, delete and re-seed
    if (existingAbout && !existingAbout.missionBody) {
      await AboutContent.deleteOne({ _id: existingAbout._id });
      existingAbout = null;
    }

    if (!existingAbout) {
      await AboutContent.create({
        heroTitle: "About AROHI",
        heroSubtitle:
          "Empowering disadvantaged communities in Barisal Division through sustainable socio-economic development since 2002.",
        missionLabel: "Our Mission",
        missionTitle: "Working for the Disadvantaged",
        missionBody: "<p>AROHI — Association of Rural Opportunities and Human Initiatives — was established in 2002 to bring socio-economic and cultural development to the lives of minority women, children, and persons with disabilities in southern Bangladesh through community empowerment and skill building.</p><p>Operating from our head office in Barisal with field offices across Mehendiganj, Barisal City Corporation, Kalapara (Patuakhali), and Bhola Sadar, we work with 84+ staff members across 3 districts, 6 upazilas, and over 300 villages to deliver programs in health, nutrition, education, WaSH, food security, DRR, climate change, protection, and agriculture.</p><p>Our vision is to promote the socio-economic conditions of Persons with Disabilities (PWD), indigenous and minority groups, women, children, youth, and landless people through forming village development committees and strengthening their knowledge and skills for self-reliance.</p>",
        missionImage: "",
        timelineLabel: "Our Journey",
        timelineTitle: "History of AROHI",
        timelineSubtitle:
          "Over two decades of dedicated service to disadvantaged communities in Barisal Division.",
        timeline: [
          {
            year: "2002",
            title: "AROHI Founded",
            description:
              "AROHI was established in Barisal as a local level non-government, non-political, nonprofit voluntary organization by likeminded social workers committed to community development.",
          },
          {
            year: "2014",
            title: "Registered with Women Affairs",
            description:
              "AROHI expanded its scope by registering with the Department of Women Affairs, strengthening its focus on women's empowerment and gender equality programs.",
          },
          {
            year: "2015",
            title: "AROHI Agro Business (AAB) Launched",
            description:
              "Established AROHI Agro Business to support rural farmers through contract farming, modern agriculture techniques, and market linkages in Barisal District.",
          },
          {
            year: "2017",
            title: "Youth Development Registration",
            description:
              "Registered with the Department of Youth Development, expanding programs for youth capacity building and career skills development.",
          },
          {
            year: "2025",
            title: "NGOAB Registration & Expanding Impact",
            description:
              "Received NGOAB registration and now operates 17+ programs across health, nutrition, education, WaSH, food security, DRR, climate change, protection, and agriculture.",
          },
        ],
        valuesLabel: "What Drives Us",
        valuesTitle: "Our Values",
        valuesSubtitle:
          "These core principles guide our work and define who we are as an organization.",
        values: [
          {
            icon: "HiHeart",
            title: "Compassion",
            description:
              "We place the dignity and well-being of every disadvantaged person at the center of everything we do, responding with empathy and care.",
          },
          {
            icon: "HiShieldCheck",
            title: "Accountability",
            description:
              "We uphold the highest standards of transparency, accountability, and ethical conduct in all our operations and partnerships.",
          },
          {
            icon: "HiLightBulb",
            title: "Commitment",
            description:
              "We are committed to the underprivileged and marginalized people of the community for bringing positive changes to their lifestyle.",
          },
          {
            icon: "HiUserGroup",
            title: "Respect",
            description:
              "We respect the religious sentiments, culture, heritage, and existing values of the communities we serve, particularly persons with disabilities and vulnerable groups.",
          },
        ],
      });
      results.aboutContent = "Created about page content";
    } else {
      results.aboutContent = "About content already exists — skipped";
    }

    // ─── Done ───────────────────────────────────────────────────────────

    return NextResponse.json(
      {
        success: true,
        message: "Database seed completed",
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
