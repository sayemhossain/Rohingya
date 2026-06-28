export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import bcryptjs from "bcryptjs";
import User from "@/models/User";
import SiteSettings from "@/models/SiteSettings";
import Sector from "@/models/Sector";
import SubProgramme from "@/models/SubProgramme";
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
            label: "Our Programmes",
            href: "/programmes",
            order: 2,
            children: [
              { label: "Health", href: "/programmes/health" },
              { label: "Nutrition", href: "/programmes/nutrition" },
              { label: "Education", href: "/programmes/education" },
              { label: "WaSH", href: "/programmes/wash" },
              { label: "Food Security & Livelihood", href: "/programmes/food-security-and-livelihood" },
              { label: "DRR", href: "/programmes/drr" },
              { label: "Climate Change", href: "/programmes/climate-change" },
              { label: "Protection", href: "/programmes/protection" },
              { label: "Agriculture", href: "/programmes/agriculture" },
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
            ctaLink: "/programmes/health",
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
      {
        key: "home_journey",
        value: {
          label: "About AROHI",
          title: "Journey of AROHI",
          image: "",
          body: [
            "<p>Association of Rural Opportunity and Human Initiative (AROHI) is a community-based development organization established in 2002, registered with the NGO Affairs Bureau &amp; Department of Social Welfare, Government of Bangladesh. We work to improve the socio-economic condition of disadvantaged and vulnerable communities across the Barisal Division through a wide range of humanitarian and development programs.</p>",
            "<p>AROHI believes in building an inclusive and resilient society where poor and marginalized people can live with dignity, access essential services, and participate actively in community development. Through strong collaboration with government institutions, local authorities, and national &amp; international NGOs, we have reached thousands of vulnerable households in remote and climate-affected areas.</p>",
            "<p><strong>Health &amp; Nutrition —</strong> Community-based interventions for women, children, and adolescents, including awareness on maternal and child health, immunization, hygiene, and nutrition counselling to reduce malnutrition.</p>",
            "<p><strong>Water, Sanitation &amp; Hygiene (WaSH) —</strong> Safe drinking water, hygienic latrines, and handwashing facilities in schools and communities, alongside awareness on menstrual hygiene and water safety.</p>",
            "<p><strong>Disaster Risk Reduction &amp; Climate Change —</strong> Disaster preparedness, early-warning awareness, and climate-smart agriculture to strengthen the resilience of cyclone- and flood-prone coastal communities.</p>",
            "<p><strong>Agriculture, Food Security &amp; Livelihood —</strong> Training in modern farming, homestead gardening, poultry and livestock rearing, and income-generating skills for women and youth to improve household income.</p>",
            "<p><strong>Education &amp; Capacity Building —</strong> Improving access to education for disadvantaged children and building the capacity of community groups, youth leaders, and women's groups for sustainable development.</p>",
            "<p><strong>Eye Care, HIV/AIDS Awareness &amp; Women Empowerment —</strong> Free eye camps, behaviour-change communication, and programs promoting gender equality, prevention of child marriage, and women's participation in decision-making.</p>",
            "<p>Over the years, AROHI has played a significant role in improving the lives of disadvantaged and climate-vulnerable communities in the Barisal Division. We remain committed to building a healthy, educated, resilient, and self-reliant society where every individual has equal opportunities for growth and dignity.</p>",
          ].join(""),
        },
      },
      {
        key: "impact_stories",
        value: [
          {
            image: "",
            quote:
              "When the mobile eye camp came to our area, the doctors found my cataract early. After the free surgery I can see my grandchildren again. AROHI gave me back my sight and my independence.",
            name: "Rahima Khatun",
            designation: "Eye Camp Beneficiary, Mehendiganj",
          },
          {
            image: "",
            quote:
              "The livelihood training taught me tailoring and how to run a small business. I now earn enough to support my children's education and stand on my own feet with dignity.",
            name: "Shahnaz Parvin",
            designation: "Livelihood Program Graduate, Barisal Sadar",
          },
          {
            image: "",
            quote:
              "Through AROHI's nutrition counselling I learned about balanced diets and breastfeeding. My youngest child is now healthy and growing well — knowledge that changed our whole family.",
            name: "Mosammat Fatema",
            designation: "Health & Nutrition Beneficiary, Bhola Sadar",
          },
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

    // ─── 3a. Backfill programme long descriptions (sourced from AROHI docs) ──
    // Only fills programmes that don't already have a longDescription, so admin
    // edits are never overwritten.
    const programmeLongDescriptions: Record<string, string> = {
      health:
        "<p>AROHI delivers community-based health interventions to improve the overall health status of women, children, adolescents, and vulnerable populations across Barisal Division. Through health camps and awareness sessions on maternal and child health, immunization, reproductive health, and disease prevention, the organization brings essential primary healthcare to underserved rural unions and urban slums.</p><p>Community health workers and volunteers organize courtyard meetings, growth-monitoring activities, and awareness campaigns, while specialized initiatives such as free eye camps and HIV/AIDS prevention extend care to the most marginalized. These efforts ensure that even the hardest-to-reach families receive medical attention, early diagnosis, and the knowledge to live healthier lives.</p>",
      nutrition:
        "<p>AROHI's nutrition programme focuses on reducing malnutrition among under-five children, pregnant women, and lactating mothers in Barisal District. Trained health workers carry out community-based screening and growth monitoring, identify malnourished children early, and provide supplementary feeding and referral support for severe cases.</p><p>A strong emphasis on Behaviour Change Communication helps mothers and caregivers adopt exclusive breastfeeding, timely complementary feeding, dietary diversity, and improved hygiene. By building the capacity of community health workers and engaging local leaders, AROHI ensures these gains in nutritional knowledge and practice are sustained at the household level.</p>",
      education:
        "<p>Education is one of AROHI's key focus areas. The organization improves access to learning for disadvantaged children, school dropouts, and vulnerable adolescents through child-friendly community learning centres, early childhood development activities, and bridge education that helps out-of-school children return to formal schooling.</p><p>Alongside direct education support, AROHI conducts capacity-building training for community groups, youth leaders, women's groups, and volunteers on leadership, rights awareness, social accountability, and livelihood development. Together these activities raise enrolment, reduce dropout rates, and empower communities to drive their own sustainable development.</p>",
      wash:
        "<p>Safe water and sanitation remain a major concern in many coastal and rural communities of Barisal Division. AROHI's WaSH programme ensures access to safe drinking water, hygienic sanitation facilities, and improved hygiene behaviour by installing and rehabilitating tube wells, sanitary latrines, and handwashing stations in schools and communities.</p><p>Regular awareness sessions on handwashing, menstrual hygiene management, safe water storage, and waste management — supported by active Community WaSH Committees — drive lasting behaviour change. These interventions have significantly reduced waterborne diseases and improved public-health conditions in targeted communities.</p>",
      "food-security-and-livelihood":
        "<p>To improve food security and economic resilience, AROHI supports vulnerable households through sustainable agriculture and livelihood development. Farmers receive training in modern and organic farming, homestead gardening, poultry rearing, livestock management, and fisheries, while women and youth gain skills for income-generating activities and small businesses.</p><p>Through programmes such as Vulnerable Group Development and micro-enterprise promotion — alongside AROHI Agro Business — the organization links producers to fair markets and steady income. These interventions contribute directly to poverty reduction, higher household income, and improved food security among disadvantaged communities.</p>",
      drr:
        "<p>The coastal region of Barisal Division is highly vulnerable to cyclones, floods, tidal surges, and river erosion. AROHI strengthens community resilience through community-based disaster risk reduction — early-warning awareness, emergency preparedness training, evacuation planning, and the formation of local disaster management committees.</p><p>Community members are trained in first aid, emergency response, and risk-mitigation strategies, and AROHI supports post-disaster rehabilitation for families affected by natural disasters. By building local preparedness and coordinating with government agencies, the programme reduces vulnerability and helps communities recover faster.</p>",
      "climate-change":
        "<p>As one of Bangladesh's most climate-vulnerable regions, Barisal Division faces salinity intrusion, irregular rainfall, flooding, and erosion. AROHI promotes climate justice and resilience through awareness campaigns, climate-smart agriculture, tree plantation, and environmental conservation that help communities adapt to a changing environment.</p><p>The organization supports salt-tolerant and floating-garden cultivation, rainwater harvesting, climate-resilient sanitation, and diversified livelihoods, while engaging women and youth in disaster-preparedness committees. These integrated efforts build safer, stronger, and more sustainable coastal communities.</p>",
      protection:
        "<p>AROHI safeguards the rights and dignity of the most marginalized — persons with disabilities, women, children, and vulnerable groups. The organization promotes disability-inclusive local governance, distributes assistive devices, supports inclusive education and rehabilitation, and provides legal aid and awareness on human rights, women's rights, and child rights.</p><p>Through gender-equality campaigns, prevention of child marriage and violence against women, and community mobilization, AROHI encourages women's participation in decision-making and economic life. These initiatives reduce stigma and discrimination and help build an inclusive society where everyone can live with equality and opportunity.</p>",
      agriculture:
        "<p>AROHI modernizes agricultural practices and strengthens rural livelihoods through AROHI Agro Business (AAB), established in 2015. Farmers receive training in modern and eco-friendly cultivation, quality inputs, and post-harvest management, with guaranteed market access through contract farming for mung bean, rice, milk, and handmade puffed rice.</p><p>By processing and branding products such as mung dal, frozen milk, and puffed rice — and building the capacity of ICM/IPM clubs with the Department of Agriculture — AROHI eliminates middlemen, secures fair prices for farmers, and supplies safe, high-quality produce to consumers across Barisal and beyond.</p>",
    };

    let descBackfilled = 0;
    for (const [slug, longDescription] of Object.entries(programmeLongDescriptions)) {
      const r = await Sector.updateOne(
        { slug, $or: [{ longDescription: { $exists: false } }, { longDescription: "" }, { longDescription: null }] },
        { $set: { longDescription } }
      );
      descBackfilled += r.modifiedCount;
    }
    results.programmeDescriptions = `Backfilled ${descBackfilled} programme descriptions`;

    // ─── 3b. Seed Sub-Programmes ────────────────────────────────────────
    // Sub-programmes belong to a parent Sector. Content sourced from AROHI's
    // programme reports. Defined by parentSlug; the parent _id is resolved
    // from the DB so this works whether sectors were just seeded or pre-exist.

    const subProgrammesToSeed = [
      {
        parentSlug: "health",
        name: "Health Camp Activities",
        slug: "health-camp",
        icon: "HiHeart",
        order: 1,
        description:
          "Free community health camps bringing primary healthcare, screening, and medicines to underserved rural unions and urban slums across Barisal.",
        longDescription:
          "<p>AROHI organizes health camps across Barisal district, sub-districts (Upazilas), union parishads, and urban areas under Barisal City Corporation. These camps serve as a bridge between underserved populations and essential healthcare services, ensuring even the most vulnerable groups receive basic medical attention.</p><p>Services include general health check-ups, blood pressure and diabetes screening, maternal and child health advice, free or subsidized medicine distribution, and awareness on hygiene, nutrition, and disease prevention. Strong community mobilization through local volunteers and leaders ensures high participation and lasting behavioural change.</p>",
        stats: [
          { label: "Health Camps Conducted", value: "200+", icon: "Hospital" },
          { label: "Beneficiaries Served", value: "15,000+", icon: "Users" },
          { label: "Upazilas Covered", value: "5+", icon: "MapPin" },
        ],
        achievements: [
          "Improved healthcare access for people in remote unions without long travel",
          "Early detection of hypertension and diabetes through routine screening",
          "Reduced financial burden on low-income families via free services",
          "Increased community awareness on hygiene, nutrition, and disease prevention",
        ],
        gallery: [],
      },
      {
        parentSlug: "health",
        name: "Eye Camp Program",
        slug: "eye-camp",
        icon: "HiHeart",
        order: 2,
        description:
          "Free eye screening, treatment, spectacles, and cataract referrals for vulnerable communities, with the support of Ispahani Islamia Eye Institute & Hospital.",
        longDescription:
          "<p>AROHI implements the Eye Camp Program across districts and sub-districts of Barisal Division with the support of Ispahani Islamia Eye Institute and Hospital. The program improves access to eye care for poor, vulnerable, and underserved communities — especially the elderly, children, women, and day labourers who suffer from untreated eye problems.</p><p>Qualified eye specialists conduct comprehensive examinations including vision testing, disease screening, and cataract identification. Beneficiaries receive free or low-cost spectacles, essential medicines, and referral support for advanced treatment and surgery. Special school eye-health sessions identify vision problems among children early.</p>",
        stats: [
          { label: "Patients Screened", value: "5,000+", icon: "Eye" },
          { label: "Spectacles Distributed", value: "2,000+", icon: "Glasses" },
          { label: "Cataract Referrals", value: "800+", icon: "Heart" },
        ],
        achievements: [
          "Increased access to eye care for poor and vulnerable people",
          "Early detection and treatment of common eye diseases",
          "Reduced avoidable blindness through cataract referrals and surgeries",
          "Improved educational participation among children with corrected vision",
        ],
        gallery: [],
      },
      {
        parentSlug: "health",
        name: "Tobacco Control Program",
        slug: "tobacco-control",
        icon: "HiHeart",
        order: 3,
        description:
          "Reducing tobacco consumption and promoting smoke-free communities in Barisal through awareness, school campaigns, and advocacy — with WBB Trust and Gram Bangla.",
        longDescription:
          "<p>AROHI implements the Tobacco Control Program in Barisal district with the support of WBB Trust and Gram Bangla. The program reduces tobacco consumption, raises awareness of its harmful effects, and protects vulnerable groups — youth, women, school students, and low-income families — from the social, economic, and health impacts of tobacco.</p><p>Activities include community awareness sessions, school and youth campaigns, observation of World No Tobacco Day, advocacy with local government and law enforcement for smoke-free public places, and distribution of IEC materials such as leaflets, posters, and stickers.</p>",
        stats: [
          { label: "Awareness Sessions", value: "150+", icon: "Megaphone" },
          { label: "Schools Engaged", value: "40+", icon: "School" },
          { label: "Smoke-free Pledges", value: "1,000+", icon: "Users" },
        ],
        achievements: [
          "Increased awareness of the health and economic impacts of tobacco",
          "Greater youth and volunteer participation in anti-tobacco campaigns",
          "Improved understanding of tobacco control laws among local stakeholders",
          "Encouraged smoke-free environments in schools and public places",
        ],
        gallery: [],
      },
      {
        parentSlug: "nutrition",
        name: "Community Nutrition Program",
        slug: "community-nutrition",
        icon: "HiCake",
        order: 1,
        description:
          "Improving the nutritional status of under-five children and pregnant & lactating mothers through screening, supplementary feeding, and behaviour-change counselling.",
        longDescription:
          "<p>AROHI's Nutrition Program targets children under five and pregnant and lactating mothers (PLW) in Barisal District. Trained health workers conduct household screening using MUAC tapes and growth monitoring to identify malnutrition early, enrolling affected children in appropriate support services.</p><p>The program provides supplementary food and micronutrient powders, refers severe cases to health facilities, and places strong emphasis on Behaviour Change Communication — educating mothers on exclusive breastfeeding, complementary feeding, dietary diversity, and hygiene. Community health workers and volunteers are trained to ensure services remain sustainable.</p>",
        stats: [
          { label: "Children Screened", value: "8,000+", icon: "Baby" },
          { label: "Mothers Counselled", value: "3,000+", icon: "Heart" },
          { label: "Volunteers Trained", value: "120+", icon: "Users" },
        ],
        achievements: [
          "Early identification and treatment of malnutrition among under-fives",
          "Increased exclusive breastfeeding and improved complementary feeding rates",
          "Strengthened capacity of community health workers for lasting impact",
          "Measurable reduction in child malnutrition in target communities",
        ],
        gallery: [],
      },
      {
        parentSlug: "education",
        name: "Early Childhood Development & Dropout Support",
        slug: "ecd-dropout-support",
        icon: "HiAcademicCap",
        order: 1,
        description:
          "Child-friendly early learning for ages 3–6 and bridge education to bring dropout children back to school, reducing child labour and early marriage.",
        longDescription:
          "<p>AROHI's Education Project focuses on Early Childhood Development (ECD) and support for dropout children in Barisal, in partnership with the Government and national & international NGOs. Child-friendly learning centres offer interactive sessions — storytelling, drawing, games, and basic literacy and numeracy — using child-centred methods that build confidence.</p><p>For dropout children, the project provides non-formal education, bridge courses, and counselling with parents to reintegrate them into formal schools, with special attention to children from poor families, children with disabilities, and those at risk of child labour or early marriage. Teachers and community volunteers are trained in child protection and positive parenting.</p>",
        stats: [
          { label: "Children Enrolled", value: "1,200+", icon: "Users" },
          { label: "Learning Centres", value: "25+", icon: "School" },
          { label: "Dropouts Reintegrated", value: "400+", icon: "Award" },
        ],
        achievements: [
          "Many children successfully enrolled in ECD centres and primary schools",
          "Dropout children returned to education with positive academic improvement",
          "Increased parental awareness of education, hygiene, and child protection",
          "Stronger community participation in supporting children's education",
        ],
        gallery: [],
      },
      {
        parentSlug: "wash",
        name: "Safe Water & Sanitation Program",
        slug: "safe-water-sanitation",
        icon: "HiBeaker",
        order: 1,
        description:
          "Improving public health through safe drinking water, improved sanitation, and hygiene promotion in rural and hard-to-reach communities of Barisal.",
        longDescription:
          "<p>AROHI's Water, Sanitation and Hygiene (WaSH) program in Barisal District improves public health, reduces waterborne diseases, and ensures access to safe drinking water and improved sanitation. The program promotes hygiene practices among households, schools, and vulnerable communities in both rural and hard-to-reach areas.</p><p>Activities include installation and rehabilitation of tube wells and safe water points, construction of household and community latrines, formation of Community WaSH Committees, hygiene promotion in schools, and distribution of hygiene kits with soap, sanitary materials, and water purification tablets.</p>",
        stats: [
          { label: "Water Points", value: "300+", icon: "Droplet" },
          { label: "Latrines Built", value: "1,500+", icon: "Building" },
          { label: "People Reached", value: "20,000+", icon: "Users" },
        ],
        achievements: [
          "Increased access to safe and functional water sources",
          "Improved sanitation coverage and reduced open defecation",
          "Behaviour change on handwashing and hygiene practices",
          "Active community participation in maintaining WaSH facilities",
        ],
        gallery: [],
      },
      {
        parentSlug: "climate-change",
        name: "Building Resilience Against Climate Change",
        slug: "climate-resilience",
        icon: "HiGlobeAlt",
        order: 1,
        description:
          "Strengthening the resilience of climate-vulnerable coastal communities through disaster preparedness, climate-smart livelihoods, and environmental protection.",
        longDescription:
          "<p>AROHI implements the \"Building Resilience Against Climate Change\" program in Barisal Division — one of Bangladesh's most climate-vulnerable regions — with support from the Government and national & international NGOs. It strengthens the adaptive capacity of communities affected by cyclones, tidal surges, river erosion, flooding, salinity intrusion, and irregular rainfall.</p><p>The program promotes climate-smart agriculture (salt-tolerant crops, floating gardens, homestead gardening), supports alternative income activities, conducts tree-plantation and environmental conservation drives, forms community disaster management committees with mock drills, and provides climate-resilient WaSH support including rainwater harvesting and raised latrines.</p>",
        stats: [
          { label: "Communities Engaged", value: "50+", icon: "Users" },
          { label: "Trees Planted", value: "10,000+", icon: "TreePine" },
          { label: "Households Supported", value: "3,000+", icon: "Home" },
        ],
        achievements: [
          "Increased community awareness and preparedness for climate disasters",
          "Wider adoption of climate-smart agricultural practices",
          "Diversified livelihoods and increased household income",
          "Stronger community disaster response and coordination mechanisms",
        ],
        gallery: [],
      },
      {
        parentSlug: "protection",
        name: "Disability Support & Rehabilitation",
        slug: "disability-support",
        icon: "HiShieldCheck",
        order: 1,
        description:
          "Promoting the rights, dignity, and self-reliance of persons with disabilities through rehabilitation, assistive devices, inclusive education, and livelihoods.",
        longDescription:
          "<p>AROHI implements the Disability Support & Rehabilitation Program with the support of the Bangladesh Government to improve the quality of life, dignity, inclusion, and self-reliance of persons with disabilities across Barisal Division. Using a rights-based and inclusive approach, the program reduces social stigma and promotes equal opportunity.</p><p>Activities include community-based identification and registration, medical support and physiotherapy, distribution of assistive devices (wheelchairs, hearing aids, white canes, artificial limbs), inclusive education support, livelihood and skills training (tailoring, handicrafts, poultry, small business), and awareness campaigns including observation of the International Day of Persons with Disabilities.</p>",
        stats: [
          { label: "PWD Supported", value: "2,000+", icon: "Heart" },
          { label: "Assistive Devices", value: "800+", icon: "Wheelchair" },
          { label: "Awareness Sessions", value: "300+", icon: "Megaphone" },
        ],
        achievements: [
          "Increased access to rehabilitation and healthcare services",
          "Improved mobility and independence through assistive devices",
          "Enhanced school participation of children with disabilities",
          "Reduced social stigma and discrimination in communities",
        ],
        gallery: [],
      },
    ];

    const existingSubCount = await SubProgramme.countDocuments();
    if (existingSubCount === 0) {
      // 1. Create the standalone sub-programmes (drop the `parentSlug` helper —
      //    it only records which programme to assign each one to).
      const created = await SubProgramme.insertMany(
        subProgrammesToSeed.map(({ parentSlug, ...rest }) => {
          void parentSlug;
          return rest;
        })
      );
      const subIdBySlug = new Map(created.map((s) => [s.slug, s._id]));

      // 2. Group the created ids by their target programme.
      const assignByParent: Record<string, unknown[]> = {};
      for (const sp of subProgrammesToSeed) {
        const id = subIdBySlug.get(sp.slug);
        if (!id) continue;
        (assignByParent[sp.parentSlug] ??= []).push(id);
      }

      // 3. Assign them to each programme in order.
      let assignedCount = 0;
      for (const [pSlug, ids] of Object.entries(assignByParent)) {
        const r = await Sector.updateOne(
          { slug: pSlug },
          { $set: { subProgrammes: ids } }
        );
        if (r.matchedCount > 0) assignedCount += ids.length;
      }

      results.subProgrammes = `Created ${created.length} sub-programmes, assigned ${assignedCount} to programmes`;
    } else {
      results.subProgrammes = `${existingSubCount} sub-programmes already exist — skipped`;
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
