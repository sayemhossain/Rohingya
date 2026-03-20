export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "@/models/User";
import SiteSettings from "@/models/SiteSettings";
import Sector from "@/models/Sector";
import News from "@/models/News";
import Resource from "@/models/Resource";
import Gallery from "@/models/Gallery";
import TeamMember from "@/models/TeamMember";

export async function GET() {
  // Block in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Seed route is disabled in production." },
      { status: 403 }
    );
  }

  try {
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
          { label: "Crisis Overview", href: "/crisis-overview", order: 2 },
          {
            label: "Sectors",
            href: "/sectors",
            order: 3,
            children: [
              { label: "Education", href: "/sectors/education" },
              { label: "Healthcare", href: "/sectors/healthcare" },
              { label: "Shelter", href: "/sectors/shelter" },
              { label: "WASH", href: "/sectors/wash" },
              { label: "Food Security", href: "/sectors/food-security" },
              { label: "Protection", href: "/sectors/protection" },
              { label: "Livelihoods", href: "/sectors/livelihoods" },
              { label: "Nutrition", href: "/sectors/nutrition" },
            ],
          },
          { label: "News & Stories", href: "/news", order: 4 },
          { label: "Resources", href: "/resources", order: 5 },
          { label: "Gallery", href: "/gallery", order: 6 },
          { label: "Get Involved", href: "/get-involved", order: 7 },
          { label: "Contact", href: "/contact", order: 8 },
        ],
      },
      {
        key: "hero_slides",
        value: [
          {
            title: "Standing With the Rohingya",
            subtitle:
              "Supporting over one million refugees in Cox's Bazar through humanitarian aid, education, and sustainable development.",
            ctaText: "Learn More",
            ctaLink: "/crisis-overview",
          },
          {
            title: "Education for Every Child",
            subtitle:
              "Providing quality learning opportunities to Rohingya children and youth displaced by crisis.",
            ctaText: "Our Programs",
            ctaLink: "/sectors/education",
          },
          {
            title: "Building Resilient Communities",
            subtitle:
              "Empowering refugees and host communities through livelihood programs and skills training.",
            ctaText: "Get Involved",
            ctaLink: "/get-involved",
          },
        ],
      },
      {
        key: "stats",
        value: [
          { label: "Refugees in Bangladesh", value: "1,200,000", icon: "Users" },
          { label: "Refugee Camps", value: "33", icon: "Home" },
          { label: "Funding Needed (USD)", value: "876M", icon: "DollarSign" },
          { label: "Humanitarian Partners", value: "150+", icon: "Handshake" },
        ],
      },
      {
        key: "partner_logos",
        value: [
          { name: "UNHCR", logo: "" },
          { name: "UNICEF", logo: "" },
          { name: "WFP", logo: "" },
          { name: "WHO", logo: "" },
          { name: "IOM", logo: "" },
          { name: "BRAC", logo: "" },
          { name: "Save the Children", logo: "" },
          { name: "MSF", logo: "" },
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
        name: "Education",
        slug: "education",
        description:
          "Providing quality education and learning opportunities to Rohingya children and youth in refugee camps.",
        icon: "GraduationCap",
        order: 1,
        stats: [
          { label: "Learning Centers", value: "3,200+", icon: "School" },
          { label: "Students Enrolled", value: "450,000", icon: "Users" },
          { label: "Teachers Trained", value: "12,000", icon: "Award" },
        ],
        programs: [
          {
            title: "Early Childhood Development",
            description:
              "Age-appropriate learning programs for children aged 3–5 in safe and stimulating environments.",
          },
          {
            title: "Primary & Secondary Education",
            description:
              "Structured curriculum delivery aligned with the Myanmar Curriculum for grades 1–10.",
          },
          {
            title: "Skills-Based Training",
            description:
              "Vocational and life skills training for adolescents and youth to build future livelihoods.",
          },
        ],
        achievements: [
          "Established over 3,200 temporary learning centers across 33 camps",
          "Enrolled 450,000+ children in formal and non-formal education programs",
          "Trained 12,000 volunteer teachers from the Rohingya community",
        ],
      },
      {
        name: "Health",
        slug: "health",
        description:
          "Delivering essential healthcare services including primary care, maternal health, and disease prevention.",
        icon: "HeartPulse",
        order: 2,
        stats: [
          { label: "Health Facilities", value: "350+", icon: "Hospital" },
          { label: "Consultations/Month", value: "800,000", icon: "Stethoscope" },
          { label: "Vaccinated Children", value: "500,000+", icon: "Syringe" },
        ],
        programs: [
          {
            title: "Primary Healthcare",
            description:
              "Basic outpatient services, treatment of common illnesses, and referral to specialized care.",
          },
          {
            title: "Maternal & Child Health",
            description:
              "Antenatal care, safe delivery services, postnatal support, and immunization programs.",
          },
          {
            title: "Disease Surveillance & Prevention",
            description:
              "Monitoring outbreaks and conducting vaccination campaigns to prevent cholera, diphtheria, and measles.",
          },
        ],
        achievements: [
          "Maintained 350+ health facilities across all camps",
          "Delivered over 800,000 medical consultations monthly",
          "Achieved 95% vaccination coverage for children under 5",
        ],
      },
      {
        name: "Shelter",
        slug: "shelter",
        description:
          "Constructing and maintaining safe shelters for refugee families, including monsoon preparedness and site improvements.",
        icon: "Home",
        order: 3,
        stats: [
          { label: "Shelters Built", value: "270,000+", icon: "Home" },
          { label: "Families Assisted", value: "200,000", icon: "Users" },
          { label: "Sites Improved", value: "33", icon: "MapPin" },
        ],
        programs: [
          {
            title: "Emergency Shelter Construction",
            description:
              "Providing bamboo and tarpaulin shelters to newly arrived and most vulnerable families.",
          },
          {
            title: "Shelter Upgrades",
            description:
              "Strengthening existing shelters with improved materials to withstand monsoon and cyclone seasons.",
          },
          {
            title: "Site Development",
            description:
              "Building roads, drainage systems, stairs, and retaining walls to improve camp infrastructure.",
          },
        ],
        achievements: [
          "Constructed over 270,000 emergency shelters since 2017",
          "Upgraded shelters for 200,000 families with weather-resistant materials",
          "Completed major site improvement works across all 33 camps",
        ],
      },
      {
        name: "WASH",
        slug: "wash",
        description:
          "Ensuring access to safe water, sanitation, and hygiene services to prevent waterborne diseases and promote health.",
        icon: "Droplets",
        order: 4,
        stats: [
          { label: "Water Points", value: "12,000+", icon: "Droplet" },
          { label: "Latrines Built", value: "60,000+", icon: "Building" },
          { label: "People Reached", value: "900,000+", icon: "Users" },
        ],
        programs: [
          {
            title: "Safe Water Supply",
            description:
              "Installing tubewells, water treatment plants, and piped water systems for reliable access to clean water.",
          },
          {
            title: "Sanitation Facilities",
            description:
              "Constructing and maintaining latrines, bathing cubicles, and fecal sludge management systems.",
          },
          {
            title: "Hygiene Promotion",
            description:
              "Community-led hygiene education sessions and distribution of soap and hygiene kits.",
          },
        ],
        achievements: [
          "Installed over 12,000 water points across all camps",
          "Constructed 60,000+ latrines with proper waste management",
          "Reached 900,000+ people with hygiene promotion campaigns",
        ],
      },
      {
        name: "Food Security",
        slug: "food-security",
        description:
          "Providing food assistance through rations and e-voucher programs to ensure adequate nutrition for all refugees.",
        icon: "Wheat",
        order: 5,
        stats: [
          { label: "People Fed Monthly", value: "945,000", icon: "Users" },
          { label: "E-Voucher Outlets", value: "1,200+", icon: "CreditCard" },
          { label: "Monthly Ration Value", value: "$12/person", icon: "DollarSign" },
        ],
        programs: [
          {
            title: "General Food Distribution",
            description:
              "Monthly rice, lentils, and oil distribution to every registered refugee household.",
          },
          {
            title: "E-Voucher Program",
            description:
              "Digital voucher system allowing refugees to purchase fresh food from local vendors, promoting choice and dignity.",
          },
          {
            title: "Community Kitchens & Gardens",
            description:
              "Supporting small-scale vegetable gardens and shared cooking facilities to supplement rations.",
          },
        ],
        achievements: [
          "Provided monthly food assistance to 945,000+ refugees",
          "Transitioned 80% of beneficiaries to e-voucher program for greater food choice",
          "Established 1,200+ e-voucher retail outlets within the camps",
        ],
      },
      {
        name: "Protection",
        slug: "protection",
        description:
          "Safeguarding the rights and well-being of refugees through legal support, child protection, and gender-based violence prevention.",
        icon: "Shield",
        order: 6,
        stats: [
          { label: "Protection Cases", value: "85,000+", icon: "FileText" },
          { label: "Safe Spaces", value: "450+", icon: "ShieldCheck" },
          { label: "GBV Support Centers", value: "120", icon: "Heart" },
        ],
        programs: [
          {
            title: "Child Protection",
            description:
              "Identifying and supporting unaccompanied minors, preventing child labor, and operating child-friendly spaces.",
          },
          {
            title: "GBV Prevention & Response",
            description:
              "Running women-friendly spaces, case management, psychosocial support, and awareness campaigns.",
          },
          {
            title: "Legal Aid & Documentation",
            description:
              "Providing legal counseling, registration support, and advocacy for refugee rights.",
          },
        ],
        achievements: [
          "Managed over 85,000 individual protection cases",
          "Operated 450+ child-friendly and women-friendly safe spaces",
          "Provided GBV response services through 120 dedicated support centers",
        ],
      },
      {
        name: "Livelihoods",
        slug: "livelihoods",
        description:
          "Empowering refugees and host communities through skills training, income-generating activities, and self-reliance programs.",
        icon: "Briefcase",
        order: 7,
        stats: [
          { label: "People Trained", value: "65,000+", icon: "Users" },
          { label: "Micro-Enterprises", value: "8,500", icon: "Store" },
          { label: "Host Community Members Supported", value: "30,000+", icon: "Handshake" },
        ],
        programs: [
          {
            title: "Skills Training",
            description:
              "Tailoring, electronics repair, carpentry, and other vocational courses for youth and adults.",
          },
          {
            title: "Cash-for-Work",
            description:
              "Employing refugees in camp maintenance, construction, and environmental projects for daily wages.",
          },
          {
            title: "Host Community Support",
            description:
              "Extending livelihood programs to Bangladeshi host communities to ease social tensions and promote cohesion.",
          },
        ],
        achievements: [
          "Trained over 65,000 refugees in marketable vocational skills",
          "Supported establishment of 8,500 micro-enterprises within the camps",
          "Extended livelihood support to 30,000+ host community members",
        ],
      },
      {
        name: "Nutrition",
        slug: "nutrition",
        description:
          "Preventing and treating malnutrition among children, pregnant women, and lactating mothers through targeted nutrition programs.",
        icon: "Apple",
        order: 8,
        stats: [
          { label: "Nutrition Centers", value: "250+", icon: "Building" },
          { label: "Children Screened/Month", value: "120,000", icon: "Baby" },
          { label: "SAM Cases Treated", value: "18,000+", icon: "Activity" },
        ],
        programs: [
          {
            title: "Community-Based Management of Acute Malnutrition",
            description:
              "Screening, referral, and treatment of severe and moderate acute malnutrition in children under 5.",
          },
          {
            title: "Blanket Supplementary Feeding",
            description:
              "Providing specialized nutritious food to all children 6–59 months and pregnant/lactating women.",
          },
          {
            title: "Infant & Young Child Feeding Counseling",
            description:
              "Promoting exclusive breastfeeding, appropriate complementary feeding, and maternal nutrition education.",
          },
        ],
        achievements: [
          "Operated 250+ nutrition treatment and stabilization centers",
          "Screened 120,000+ children monthly for acute malnutrition",
          "Successfully treated over 18,000 severe acute malnutrition cases",
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
        title: "New Learning Centers Open in Cox's Bazar",
        slug: "new-learning-centers",
        category: "Education",
        excerpt:
          "Twelve new temporary learning centers have opened across refugee camps in Cox's Bazar, providing educational opportunities for over 3,000 Rohingya children.",
        content: `<p>Twelve new temporary learning centers have officially opened across refugee camps in Cox's Bazar district, marking a significant milestone in efforts to provide quality education to displaced Rohingya children. The centers, built in collaboration with local and international partners, will serve over 3,000 children aged 4 to 14.</p>
<p>Each learning center is equipped with basic educational materials, seating, and weather-resistant structures designed to withstand the monsoon season. Trained volunteer teachers from the Rohingya community will deliver lessons aligned with the Myanmar Curriculum, ensuring continuity of education for children who have been out of school since fleeing their homeland.</p>
<p>Community leaders have welcomed the initiative, noting that education offers hope and stability for families living in uncertain conditions. Plans are already underway to expand the program with additional centers in underserved areas of the camps, with a focus on reaching adolescent girls who face the greatest barriers to education.</p>`,
        author: "Admin",
        published: true,
        image: "",
      },
      {
        title: "Mobile Health Clinics Reach Remote Camps",
        slug: "mobile-health-clinics",
        category: "Health",
        excerpt:
          "A fleet of mobile health clinics is now providing essential medical services to refugees in hard-to-reach areas of the Cox's Bazar camps.",
        content: `<p>A new fleet of mobile health clinics has begun operating in some of the most remote and underserved areas of the Rohingya refugee camps in Cox's Bazar. The initiative aims to bridge critical gaps in healthcare access for families living far from permanent health facilities.</p>
<p>Each mobile unit is staffed by trained medical professionals including doctors, nurses, and community health workers who provide primary care consultations, maternal and child health services, vaccinations, and referrals for serious cases. The clinics are equipped with essential medicines and diagnostic tools, allowing them to treat common illnesses and injuries on-site.</p>
<p>Since launching, the mobile clinics have already conducted over 5,000 consultations, identifying and treating conditions ranging from respiratory infections to malnutrition. Health workers have also used the visits to conduct hygiene promotion sessions and distribute oral rehydration salts and zinc supplements to prevent diarrheal diseases, one of the leading causes of child mortality in the camps.</p>`,
        author: "Admin",
        published: true,
        image: "",
      },
      {
        title: "Skills Training Program Empowers Youth",
        slug: "skills-training-program",
        category: "Community",
        excerpt:
          "A new vocational skills training program is equipping Rohingya youth with practical skills in tailoring, electronics repair, and small business management.",
        content: `<p>Hundreds of young Rohingya refugees are gaining new skills and confidence through a recently launched vocational training program operating across several camps in Cox's Bazar. The program offers courses in tailoring, electronics repair, carpentry, and small business management, giving participants practical abilities they can use to support themselves and their families.</p>
<p>The six-month training modules combine classroom instruction with hands-on practice, and graduates receive starter kits containing tools and materials to begin applying their skills immediately. Early cohorts have shown promising results, with several graduates already providing tailoring and repair services within their camp communities.</p>
<p>Program coordinators emphasize that empowering youth with marketable skills is essential for building self-reliance and dignity among the refugee population. The initiative also extends to host community members, fostering positive relationships and shared economic opportunities between refugees and their Bangladeshi neighbors.</p>`,
        author: "Admin",
        published: true,
        image: "",
      },
      {
        title: "Child Protection Initiatives Expand",
        slug: "child-protection-initiatives",
        category: "Protection",
        excerpt:
          "Expanded child protection programs are strengthening safeguards for vulnerable Rohingya children through new safe spaces, case management, and community awareness campaigns.",
        content: `<p>Child protection services in the Rohingya refugee camps have been significantly expanded with the opening of 50 new child-friendly spaces and the deployment of additional trained case workers. The initiative responds to growing concerns about the vulnerabilities faced by children in the densely populated camps, including risks of trafficking, child labor, and early marriage.</p>
<p>The child-friendly spaces provide safe environments where children can play, learn, and receive psychosocial support from trained facilitators. Activities include structured recreational programs, art therapy, and life skills sessions designed to help children process trauma and build resilience. Each space serves approximately 100 children per day on a rotating schedule.</p>
<p>Alongside the safe spaces, community awareness campaigns are being conducted to educate parents and caregivers about child protection risks and the importance of reporting concerns. Trained community volunteers go door-to-door, sharing information about available services and helping to identify children who may need specialized support, including unaccompanied minors and children with disabilities.</p>`,
        author: "Admin",
        published: true,
        image: "",
      },
      {
        title: "Mental Health Support Programs Launch",
        slug: "mental-health-support",
        category: "Health",
        excerpt:
          "New mental health and psychosocial support programs are addressing the widespread trauma experienced by Rohingya refugees through counseling and community-based interventions.",
        content: `<p>Recognizing the deep psychological toll of displacement and violence, humanitarian organizations have launched comprehensive mental health and psychosocial support (MHPSS) programs across the Rohingya refugee camps. The initiative includes individual counseling, group therapy sessions, and community-based support activities designed to address trauma, anxiety, and depression among the refugee population.</p>
<p>Trained counselors, many of whom are Rohingya community members, provide culturally sensitive support in dedicated counseling centers within the camps. Group sessions focus on topics such as coping strategies, stress management, and rebuilding social connections. Special programs have been developed for women who have experienced gender-based violence and for children showing signs of severe emotional distress.</p>
<p>Early data from the program shows encouraging engagement, with over 2,000 individuals accessing services in the first two months. Program leaders note that reducing stigma around mental health remains a priority, and community awareness sessions are being held regularly to encourage people to seek support. The goal is to integrate mental health services into all aspects of the humanitarian response.</p>`,
        author: "Admin",
        published: true,
        image: "",
      },
      {
        title: "Digital Literacy Classes Begin",
        slug: "digital-literacy-classes",
        category: "Education",
        excerpt:
          "Rohingya youth are learning essential digital skills through a new program that introduces basic computer literacy, internet safety, and digital communication tools.",
        content: `<p>A pioneering digital literacy program has begun in several learning centers across the refugee camps, introducing Rohingya youth to fundamental computer skills and digital tools. The program uses donated tablets and laptops to teach participants basic computer operation, word processing, internet navigation, and digital communication — skills increasingly essential in the modern world.</p>
<p>Classes are designed for youth aged 15 to 24 and are conducted in small groups to ensure each participant receives adequate hands-on practice time. The curriculum also covers internet safety, responsible online behavior, and how to identify misinformation — critical knowledge for a community that has been targeted by harmful online content in the past.</p>
<p>Instructors report high levels of enthusiasm and rapid learning among participants, many of whom are using computers for the first time. The program aims to not only build technical skills but also to open pathways for online learning, remote work opportunities, and digital engagement that could support the community's long-term development and self-reliance.</p>`,
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
        title: "Joint Response Plan 2024",
        description:
          "Comprehensive inter-agency response plan outlining strategic objectives, funding requirements, and coordination mechanisms for the Rohingya humanitarian response.",
        fileUrl: "#",
        fileType: "PDF",
        category: "Reports",
        fileSize: "2.4 MB",
        published: true,
      },
      {
        title: "Refugee Population Statistics Q4",
        description:
          "Quarterly statistical report on refugee population figures, demographics, new arrivals, and camp-level breakdowns for the fourth quarter.",
        fileUrl: "#",
        fileType: "XLSX",
        category: "Data Sheets",
        fileSize: "1.1 MB",
        published: true,
      },
      {
        title: "Education Sector Guidelines",
        description:
          "Operational guidelines for education sector partners covering curriculum standards, learning center requirements, teacher training, and monitoring frameworks.",
        fileUrl: "#",
        fileType: "PDF",
        category: "Guidelines",
        fileSize: "3.2 MB",
        published: true,
      },
      {
        title: "Health Assessment Report",
        description:
          "Detailed assessment of health sector performance, disease surveillance data, facility coverage, and recommendations for improving healthcare delivery in the camps.",
        fileUrl: "#",
        fileType: "PDF",
        category: "Reports",
        fileSize: "4.5 MB",
        published: true,
      },
      {
        title: "WASH Infrastructure Data",
        description:
          "Comprehensive dataset on water, sanitation, and hygiene infrastructure including water point locations, latrine coverage ratios, and water quality testing results.",
        fileUrl: "#",
        fileType: "XLSX",
        category: "Data Sheets",
        fileSize: "890 KB",
        published: true,
      },
      {
        title: "Protection Framework 2024",
        description:
          "Strategic framework for protection sector interventions including child protection, GBV prevention and response, legal aid, and community-based protection mechanisms.",
        fileUrl: "#",
        fileType: "PDF",
        category: "Publications",
        fileSize: "1.8 MB",
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
        title: "Aerial View of Kutupalong Camp",
        caption:
          "Sprawling view of the world's largest refugee settlement in Kutupalong, Cox's Bazar, home to hundreds of thousands of Rohingya refugees.",
        imageUrl: "/images/placeholder.jpg",
        category: "Camps",
        featured: true,
        order: 1,
      },
      {
        title: "Children Learning in Temporary Classroom",
        caption:
          "Rohingya children attend lessons in a bamboo-and-tarpaulin temporary learning center, eager to continue their education despite displacement.",
        imageUrl: "/images/placeholder.jpg",
        category: "Education",
        featured: true,
        order: 2,
      },
      {
        title: "Health Worker Conducting Vaccination",
        caption:
          "A community health worker administers vaccines to children during a routine immunization campaign in the refugee camps.",
        imageUrl: "/images/placeholder.jpg",
        category: "Health",
        featured: false,
        order: 3,
      },
      {
        title: "Women's Tailoring Workshop",
        caption:
          "Rohingya women participate in a tailoring skills training session, learning to sew garments as part of a livelihood empowerment program.",
        imageUrl: "/images/placeholder.jpg",
        category: "Community",
        featured: true,
        order: 4,
      },
      {
        title: "Water Collection Point at Dawn",
        caption:
          "Refugees queue at a solar-powered water collection point early in the morning, one of thousands installed across the camps to ensure safe drinking water access.",
        imageUrl: "/images/placeholder.jpg",
        category: "Camps",
        featured: false,
        order: 5,
      },
      {
        title: "Youth Reading Circle",
        caption:
          "Adolescent Rohingya youth gather for a reading circle in a community library space, sharing stories and practicing literacy skills together.",
        imageUrl: "/images/placeholder.jpg",
        category: "Education",
        featured: false,
        order: 6,
      },
      {
        title: "Mobile Clinic in Action",
        caption:
          "A mobile health clinic team sets up in a remote section of the camp, bringing essential medical services to families who cannot easily reach permanent health facilities.",
        imageUrl: "/images/placeholder.jpg",
        category: "Health",
        featured: true,
        order: 7,
      },
      {
        title: "Community Gathering for Awareness Session",
        caption:
          "Community members gather under a large canopy for a hygiene awareness and disaster preparedness session led by trained volunteers.",
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
        name: "Dr. Sarah Ahmed",
        role: "Executive Director",
        bio: "Dr. Sarah Ahmed brings over 15 years of experience in humanitarian leadership and international development. She has worked with major UN agencies and international NGOs across South and Southeast Asia, specializing in refugee protection and durable solutions. Under her leadership, the organization has expanded its programs to reach over 500,000 beneficiaries across all 33 refugee camps in Cox's Bazar.",
        photo: "",
        order: 1,
      },
      {
        name: "Mohammad Rahman",
        role: "Program Manager",
        bio: "Mohammad Rahman oversees the design, implementation, and monitoring of all field programs across education, health, and livelihoods sectors. With a background in public health and community development, he has spent over a decade working directly with displaced communities in Bangladesh. His hands-on approach and deep understanding of local dynamics have been instrumental in ensuring programs are effective and culturally appropriate.",
        photo: "",
        order: 2,
      },
      {
        name: "Fatima Begum",
        role: "Field Coordinator",
        bio: "Fatima Begum manages day-to-day operations in the refugee camps, coordinating with field teams, community leaders, and partner organizations to deliver services efficiently. Born and raised in Cox's Bazar, she brings invaluable local knowledge and strong community relationships to the role. Her dedication to the Rohingya cause and her ability to navigate complex field conditions make her an essential part of the team.",
        photo: "",
        order: 3,
      },
      {
        name: "James Wilson",
        role: "Communications Director",
        bio: "James Wilson leads the organization's communications, advocacy, and fundraising efforts, ensuring that the stories and needs of Rohingya refugees reach global audiences. With a background in journalism and nonprofit communications, he has produced award-winning reports and multimedia content from humanitarian crises around the world. He is passionate about using storytelling to drive awareness, empathy, and meaningful action.",
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
