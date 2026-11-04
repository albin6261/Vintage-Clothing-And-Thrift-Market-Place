import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const {
  DB_HOST = '127.0.0.1',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'thrifted_db',
  DB_PORT = 3306,
} = process.env;

export async function runMigrationsAndSeed() {
  console.log('--- Initializing THRIFTED Database ---');
  
  // 1. Ensure DB exists
  const rootConn = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: Number(DB_PORT),
    multipleStatements: true,
  });

  await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await rootConn.end();

  // 2. Connect to the database
  const dbConn = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: Number(DB_PORT),
    multipleStatements: true,
  });

  // 3. Execute Schema
  const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await dbConn.query(schemaSql);
  console.log('✓ Database schema tables verified.');

  // Ensure 'gender' column exists on products table
  try {
    await dbConn.query(`ALTER TABLE products ADD COLUMN gender ENUM('boys', 'girls', 'unisex') DEFAULT 'unisex' AFTER condition_status;`);
    console.log('✓ Added gender column to products');
  } catch (e) {
    // Column already exists
  }

  // 4. Seed Users if not present
  const [usersCount] = await dbConn.query('SELECT COUNT(*) as count FROM users');
  if (usersCount[0].count === 0) {
    console.log('Seeding initial users...');
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('admin123', salt);
    const seller1Pass = await bcrypt.hash('seller123', salt);
    const seller2Pass = await bcrypt.hash('seller123', salt);
    const buyerPass = await bcrypt.hash('buyer123', salt);

    await dbConn.query(`
      INSERT INTO users (name, email, password_hash, role, avatar_url, bio, phone) VALUES
      ('Editorial Admin', 'admin@thrifted.com', ?, 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Head of Curation & Quality Assurance at THRIFTED.', '+91 98765 43210'),
      ('Kaito Tanaka', 'kaito.vintage@tokyoarchive.jp', ?, 'seller', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'Specializing in vintage sportswear, jerseys, 90s boy streetwear, and retro workwear.', '+91 98765 43211'),
      ('Helena Weber', 'helena.atelier@berlinthrift.de', ?, 'seller', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 'Curator of Y2K girls dresses, 90s slip dresses, cottagecore vintage, and retro knitwear.', '+91 98765 43212'),
      ('Clara Vance', 'clara@example.com', ?, 'buyer', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', 'Vintage enthusiast & conscious fashion collector.', '+91 98765 43213')
    `, [adminPass, seller1Pass, seller2Pass, buyerPass]);
    console.log('✓ Seeded 4 default users (admin, 2 sellers, 1 buyer)');
  }

  // 5. Seed / Sync Categories (including Girls' Thrift Dresses & Boys' Sports Jerseys)
  const categoryDefs = [
    {
      name: "Girls' Thrift Dresses & Skirts",
      slug: 'girls-dresses',
      description: 'Y2K slip dresses, floral cottagecore midi/maxi dresses, 90s grunge pinafores, retro milkmaid fits, and tennis skirts at affordable thrift rates.',
      image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
    },
    {
      name: "Boys' Sports Jerseys & Streetwear",
      slug: 'boys-jerseys',
      description: 'Authentic MLB baseball jerseys, 90s NBA basketball singlets, vintage ice hockey mesh sweaters, and moto racing gear.',
      image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80'
    },
    {
      name: 'Graphic & Band Tees',
      slug: 'graphic-tees',
      description: 'Single-stitch 90s band tour tees, collegiate lettering, anime streetwear, and sun-faded vintage blanks.',
      image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80'
    },
    {
      name: 'Jackets, Leather & Windbreakers',
      slug: 'leather-outerwear',
      description: 'Supple lambskin bikers, 90s color-block windbreakers, racing bombers, and vintage varsity jackets.',
      image_url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1000&q=80'
    },
    {
      name: 'Sweaters & Cardigans',
      slug: 'sweaters-cardigans',
      description: 'Grandpa knits, textured 3D waves, pastel crop cardigans, and oversized cozy fleece sweaters.',
      image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80'
    },
    {
      name: 'Vintage Denim & Bottoms',
      slug: 'vintage-denim',
      description: '90s baggy carpenter denim, skater jeans, parachute utility pants, and authentic washed Levi 501s.',
      image_url: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80'
    },
    {
      name: 'Everyday Flannels & Shirts',
      slug: 'everyday-classics',
      description: 'Heavyweight boxy flannel overshirts, retro Hawaiian prints, and classic oxford button-downs.',
      image_url: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=1000&q=80'
    }
  ];

  for (const cat of categoryDefs) {
    const [existing] = await dbConn.query('SELECT id FROM categories WHERE slug = ?', [cat.slug]);
    if (existing.length === 0) {
      await dbConn.query(
        'INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)',
        [cat.name, cat.slug, cat.description, cat.image_url]
      );
    } else {
      await dbConn.query(
        'UPDATE categories SET name = ?, description = ?, image_url = ? WHERE slug = ?',
        [cat.name, cat.description, cat.image_url, cat.slug]
      );
    }
  }
  console.log('✓ Categories synchronized.');

  // Fetch category and seller IDs
  const [cats] = await dbConn.query('SELECT id, slug FROM categories');
  const catMap = Object.fromEntries(cats.map(c => [c.slug, c.id]));
  const [sellers] = await dbConn.query('SELECT id, email FROM users WHERE role = "seller"');
  const sellerKaito = sellers.find(s => s.email.includes('kaito'))?.id || sellers[0].id;
  const sellerHelena = sellers.find(s => s.email.includes('helena'))?.id || sellers[1]?.id || sellerKaito;

  // 6. Comprehensive Thrift Products for Boys & Girls at Affordable Rates
  const sampleProducts = [
    // -------------------------------------------------------------
    // GIRLS' THRIFT DRESSES & SKIRTS (Affordable ₹399 - ₹899)
    // -------------------------------------------------------------
    {
      title: "90s Grunge Plaid Tartan Pinafore Overall Dress",
      slug: "90s-grunge-plaid-tartan-pinafore-dress",
      brand: "Express 90s Archive",
      era: "1990s",
      category_id: catMap['girls-dresses'],
      seller_id: sellerHelena,
      price: 599.00,
      original_price: 2499.00,
      size: "S (Chest: 34\" / Length: 32\")",
      condition_status: "Excellent Vintage",
      gender: "girls",
      description: "Authentic 90s tartan plaid mini pinafore dress in forest green and navy check. Features square neckline, adjustable straps, and side button closures. Perfect layered over a turtleneck or plain baby tee for that classic grunge riot-girl look.",
      measurements: JSON.stringify({ chest_inches: "34 in", waist: "28 in", length: "32 in", hips: "37 in" }),
      materials: "65% Soft Poly, 35% Rayon Twill",
      color: "Forest Green & Navy Plaid",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: true,
      is_new_arrival: true,
      curated_collection: "Girls' Thrift Dresses",
      image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "Cottagecore French Prairie Floral Midi Dress",
      slug: "cottagecore-french-prairie-floral-midi-dress",
      brand: "Laura Ashley Vintage",
      era: "1980s",
      category_id: catMap['girls-dresses'],
      seller_id: sellerHelena,
      price: 749.00,
      original_price: 3200.00,
      size: "M (Chest: 36\" / Length: 44\")",
      condition_status: "Near Mint Vintage",
      gender: "girls",
      description: "Dreamy vintage floral midi dress featuring a sweetheart neckline, delicate puffed sleeves with elasticated cuffs, and a flowy tiered silhouette. Soft breathable rayon with botanical print in soft blush rose and sage green.",
      measurements: JSON.stringify({ chest_inches: "36 in", waist: "30 in", length: "44 in", shoulders: "15 in" }),
      materials: "100% Breathable Rayon Challis",
      color: "Blush Floral & Sage",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: true,
      is_new_arrival: true,
      curated_collection: "Girls' Thrift Dresses",
      image_url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "Y2K Pastel Lilac Cowl-Neck Silk Satin Slip Dress",
      slug: "y2k-pastel-lilac-cowl-neck-silk-satin-slip-dress",
      brand: "Morgan de Toi Archive",
      era: "Early 2000s (Y2K)",
      category_id: catMap['girls-dresses'],
      seller_id: sellerHelena,
      price: 699.00,
      original_price: 2800.00,
      size: "S (Chest: 33\" / Length: 36\")",
      condition_status: "Excellent Vintage",
      gender: "girls",
      description: "The quintessential early 2000s cowl-neck bias-cut slip dress in iridescent pastel lilac satin. Adjustable micro spaghetti straps with side slit that catches movement effortlessly. Steal rate!",
      measurements: JSON.stringify({ chest_inches: "33 in", waist: "27 in", length: "36 in", hips: "36 in" }),
      materials: "Silk Satin Blend with subtle luster",
      color: "Pastel Lilac Lavande",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: true,
      is_new_arrival: false,
      curated_collection: "Girls' Thrift Dresses",
      image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "Retro Milkmaid Daisy Smocked Bustier Sundress",
      slug: "retro-milkmaid-daisy-smocked-bustier-sundress",
      brand: "Jessica Vintage",
      era: "1990s",
      category_id: catMap['girls-dresses'],
      seller_id: sellerHelena,
      price: 649.00,
      original_price: 2900.00,
      size: "XS/S (Chest: 32-34\" / Length: 38\")",
      condition_status: "Excellent Vintage",
      gender: "girls",
      description: "Classic vintage milkmaid sundress featuring smocked stretchy back bodice, lace-trimmed bustline with center bow, and ruffled hem in breezy daisy printed cotton.",
      measurements: JSON.stringify({ chest_inches: "32-34 in", waist: "25-28 in (elastic)", length: "38 in" }),
      materials: "100% Breathable Cotton Poplin",
      color: "Sky Blue with White Daisies",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: false,
      is_new_arrival: true,
      curated_collection: "Girls' Thrift Dresses",
      image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "90s Chunky Corduroy Dungaree Pinafore Dress",
      slug: "90s-chunky-corduroy-dungaree-pinafore-dress",
      brand: "Dickies Vintage Girl",
      era: "1990s",
      category_id: catMap['girls-dresses'],
      seller_id: sellerHelena,
      price: 799.00,
      original_price: 3100.00,
      size: "M (Chest: 36\" / Length: 34\")",
      condition_status: "Gently Loved",
      gender: "girls",
      description: "Thick camel brown fine-rib corduroy overall dress with metal buckle clasps, front kangaroo pouch, and side brass buttons. Ultra durable everyday collegiate thrift piece.",
      measurements: JSON.stringify({ chest_inches: "36 in", waist: "31 in", length: "34 in", hips: "39 in" }),
      materials: "100% Heavy Ribbed Cotton Corduroy",
      color: "Camel Tan",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: false,
      is_new_arrival: false,
      curated_collection: "Girls' Thrift Dresses",
      image_url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "Y2K Gingham Check Picnic Babydoll Mini Dress",
      slug: "y2k-gingham-check-picnic-babydoll-mini-dress",
      brand: "Jane Norman Vintage",
      era: "Early 2000s (Y2K)",
      category_id: catMap['girls-dresses'],
      seller_id: sellerHelena,
      price: 499.00,
      original_price: 2100.00,
      size: "S (Chest: 34\" / Length: 31\")",
      condition_status: "Excellent Vintage",
      gender: "girls",
      description: "Cute retro picnic babydoll dress in micro-gingham check. Sweetheart neckline with ribbon tie and flirty skater hemline. Amazing thrift steal under ₹500!",
      measurements: JSON.stringify({ chest_inches: "34 in", waist: "27 in", length: "31 in" }),
      materials: "Cotton Poly blend",
      color: "Cherry Red & White Gingham",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: false,
      is_new_arrival: true,
      curated_collection: "Under ₹499 Steals",
      image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "90s Black Crushed Velvet Evening Cocktail Slip Dress",
      slug: "90s-black-crushed-velvet-evening-cocktail-slip-dress",
      brand: "Betsey Johnson Vintage",
      era: "1990s",
      category_id: catMap['girls-dresses'],
      seller_id: sellerHelena,
      price: 899.00,
      original_price: 4200.00,
      size: "S (Chest: 34\" / Length: 35\")",
      condition_status: "Exceptional Patina",
      gender: "girls",
      description: "Sensational 90s stretch crushed velvet evening slip dress with straight square neckline and subtle side thigh slit. Flattering drape with plush tactile feel.",
      measurements: JSON.stringify({ chest_inches: "34 in", waist: "27 in", length: "35 in", hips: "37 in" }),
      materials: "90% Plush Velvet, 10% Spandex",
      color: "Midnight Obsidian Black",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: true,
      is_new_arrival: false,
      curated_collection: "Girls' Thrift Dresses",
      image_url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "Vintage 1970s Victorian Prairie Gunne Sax Maxi Dress",
      slug: "vintage-1970s-victorian-prairie-gunne-sax-maxi-dress",
      brand: "Gunne Sax by Jessica San Francisco",
      era: "1970s",
      category_id: catMap['girls-dresses'],
      seller_id: sellerHelena,
      price: 949.00,
      original_price: 5800.00,
      size: "M (Chest: 35\" / Length: 51\")",
      condition_status: "Near Mint Vintage",
      gender: "girls",
      description: "Rare 1970s authentic Gunne Sax bohemian prairie dress with Victorian lace collar, corset ribbon tie front, and billowing tiered hem trimmed in satin.",
      measurements: JSON.stringify({ chest_inches: "35 in", waist: "28 in", length: "51 in", shoulders: "14.5 in" }),
      materials: "Cotton Muslin, Calico Print, Satin Ribbon",
      color: "Antique Cream & Dusty Rose",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: false,
      is_new_arrival: true,
      curated_collection: "Girls' Thrift Dresses",
      image_url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "Y2K High-Waisted Box Pleated Tennis Mini Skirt",
      slug: "y2k-high-waisted-box-pleated-tennis-mini-skirt",
      brand: "American Apparel Vintage",
      era: "Early 2000s (Y2K)",
      category_id: catMap['girls-dresses'],
      seller_id: sellerHelena,
      price: 449.00,
      original_price: 1800.00,
      size: "S (Waist: 26\" / Length: 15\")",
      condition_status: "Near Mint",
      gender: "girls",
      description: "Structured high-waisted pleated tennis skirt with hidden side zipper and built-in safety lining. Clean knife pleats that retain shape. Steal rate under ₹450!",
      measurements: JSON.stringify({ waist: "26 in", length: "15 in", hips: "Free" }),
      materials: "100% Poly Gabardine",
      color: "Crisp Chalk White",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: false,
      is_new_arrival: true,
      curated_collection: "Under ₹499 Steals",
      image_url: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "90s Dainty Embroidered Daisy Ribbed Baby Tee",
      slug: "90s-dainty-embroidered-daisy-ribbed-baby-tee",
      brand: "Delia*s Vintage 1998",
      era: "1990s",
      category_id: catMap['graphic-tees'],
      seller_id: sellerHelena,
      price: 399.00,
      original_price: 1500.00,
      size: "S (Chest: 32\" / Length: 19\")",
      condition_status: "Excellent Vintage",
      gender: "girls",
      description: "Signature 90s baby tee in soft sky blue ribbed cotton with contrast white ringer collar and embroidered daisy center. Unbeatable thrift steal under ₹400!",
      measurements: JSON.stringify({ chest_inches: "32 in", length: "19 in", shoulders: "13.5 in" }),
      materials: "100% Soft Ribbed Cotton",
      color: "Sky Blue & White",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: true,
      is_new_arrival: true,
      curated_collection: "Under ₹499 Steals",
      image_url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80"
      ])
    },

    // -------------------------------------------------------------
    // BOYS' SPORTS JERSEYS & STREETWEAR (Affordable ₹499 - ₹999)
    // -------------------------------------------------------------
    {
      title: "1996 New York Yankees MLB Pinstripe Baseball Jersey #2",
      slug: "1996-new-york-yankees-mlb-pinstripe-baseball-jersey",
      brand: "Majestic Athletic / MLB Genuine",
      era: "1990s",
      category_id: catMap['boys-jerseys'],
      seller_id: sellerKaito,
      price: 899.00,
      original_price: 4500.00,
      size: "XL Boxy (Chest: 48\" / Length: 31\")",
      condition_status: "Excellent Vintage",
      gender: "boys",
      description: "Iconic navy pinstripe baseball jersey with tackle-twill stitched chest insignia and legendary #2 back embroidery. Heavyweight mesh fabric with authentic MLB batterman patch at the nape. Top thrift grail for boys street style.",
      measurements: JSON.stringify({ chest_inches: "48 in", length: "31 in", shoulders: "22 in" }),
      materials: "100% Double-Knit Breathable Athletic Poly Mesh",
      color: "White with Navy Pinstripe",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: true,
      is_new_arrival: true,
      curated_collection: "Boys' Sports Jerseys",
      image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "1998 Chicago Bulls NBA Basketball Jersey #23 Jordan",
      slug: "1998-chicago-bulls-nba-basketball-jersey-23",
      brand: "Champion Authentic NBA",
      era: "1990s",
      category_id: catMap['boys-jerseys'],
      seller_id: sellerKaito,
      price: 949.00,
      original_price: 5200.00,
      size: "L (Chest: 44\" / Length: 30\")",
      condition_status: "Excellent Vintage",
      gender: "boys",
      description: "Classic scarlet red Bulls championship jersey featuring gold Champion logo embroidered on the left chest and screen-printed Jordan 23. Breathable athletic mesh with ribbed trim.",
      measurements: JSON.stringify({ chest_inches: "44 in", length: "30 in", shoulders: "16 in" }),
      materials: "100% Pro Mesh Polyester",
      color: "Scarlet Red & Black Trim",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: true,
      is_new_arrival: true,
      curated_collection: "Boys' Sports Jerseys",
      image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "Retro Los Angeles Dodgers Royal Blue Baseball Script Jersey",
      slug: "retro-los-angeles-dodgers-royal-blue-baseball-jersey",
      brand: "Nike Cooperstown Collection",
      era: "Early 2000s (Y2K)",
      category_id: catMap['boys-jerseys'],
      seller_id: sellerKaito,
      price: 799.00,
      original_price: 3800.00,
      size: "M (Chest: 42\" / Length: 29\")",
      condition_status: "Near Mint Vintage",
      gender: "boys",
      description: "Deep royal blue Dodgers button-down jersey with red stitched player number and crisp white script chest lettering. Perfect streetwear layering piece over an oversized white tee.",
      measurements: JSON.stringify({ chest_inches: "42 in", length: "29 in", shoulders: "19.5 in" }),
      materials: "100% Breathable Poly Knit",
      color: "Dodgers Royal Blue",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: false,
      is_new_arrival: true,
      curated_collection: "Boys' Sports Jerseys",
      image_url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "Vintage 90s Oversized Ice Hockey Mesh Sweater Jersey",
      slug: "vintage-90s-oversized-ice-hockey-mesh-sweater-jersey",
      brand: "CCM Vintage",
      era: "1990s",
      category_id: catMap['boys-jerseys'],
      seller_id: sellerKaito,
      price: 899.00,
      original_price: 4900.00,
      size: "XXL Boxy (Chest: 50\" / Length: 32\")",
      condition_status: "Excellent Vintage",
      gender: "boys",
      description: "Ultra-boxy heavy mesh hockey sweater with lace-up V-neck collar, embroidered chest crest, and bold horizontal sleeve striping. Top-tier oversized street fit for boys.",
      measurements: JSON.stringify({ chest_inches: "50 in", length: "32 in", sleeve: "25 in" }),
      materials: "Heavyweight Breathable Air-Knit Mesh",
      color: "Black, Crimson & White",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: true,
      is_new_arrival: false,
      curated_collection: "Boys' Sports Jerseys",
      image_url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "Vintage Scuderia Moto Racing Team Pullover Jersey",
      slug: "vintage-scuderia-moto-racing-team-pullover-jersey",
      brand: "Marlboro Racing Archive",
      era: "Early 2000s (Y2K)",
      category_id: catMap['boys-jerseys'],
      seller_id: sellerKaito,
      price: 999.00,
      original_price: 5800.00,
      size: "L (Chest: 44\" / Length: 28\")",
      condition_status: "Excellent Vintage",
      gender: "boys",
      description: "2000s Formula racing team pullover jersey with embroidered sponsor patches, ribbed mock collar, and contrasting side speed panels.",
      measurements: JSON.stringify({ chest_inches: "44 in", length: "28 in", shoulders: "20 in" }),
      materials: "100% Quick-dry Racing Mesh",
      color: "Racing Red, White & Black",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: false,
      is_new_arrival: true,
      curated_collection: "Boys' Sports Jerseys",
      image_url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "Vintage Nirvana 'In Utero' 1993 Sun-Faded Band Tee",
      slug: "vintage-nirvana-in-utero-1993-faded-band-tee",
      brand: "Giant by Tee Jays",
      era: "1990s",
      category_id: catMap['graphic-tees'],
      seller_id: sellerKaito,
      price: 499.00,
      original_price: 2200.00,
      size: "L Boxy (Chest: 44\" / Length: 28\")",
      condition_status: "Gently Loved / Sun Faded",
      gender: "unisex",
      description: "Single-stitch vintage faded band tee featuring the iconic anatomical angel artwork. Perfectly worn-in charcoal wash with authentic natural crackling on the graphic.",
      measurements: JSON.stringify({ chest_inches: "44 in", length: "28 in", shoulders: "21 in" }),
      materials: "100% Ringspun Heavyweight Cotton",
      color: "Washed Charcoal Vintage Faded",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: true,
      is_new_arrival: false,
      curated_collection: "Under ₹499 Steals",
      image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "Vintage Neo-Tokyo Cyberpunk Kaneda Anime Tee",
      slug: "vintage-neo-tokyo-cyberpunk-kaneda-anime-tee",
      brand: "Fashion Victim Vintage",
      era: "1990s",
      category_id: catMap['graphic-tees'],
      seller_id: sellerKaito,
      price: 549.00,
      original_price: 2500.00,
      size: "XL Boxy (Chest: 46\" / Length: 29\")",
      condition_status: "Excellent Vintage",
      gender: "unisex",
      description: "Cult classic cyberpunk graphic on a heavyweight 220 GSM boxy cotton blank. Single stitch on sleeve hems, sun-faded vintage black tint.",
      measurements: JSON.stringify({ chest_inches: "46 in", length: "29 in", shoulders: "22 in" }),
      materials: "100% Heavy Cotton 220 GSM",
      color: "Faded Black & Crimson",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: false,
      is_new_arrival: true,
      curated_collection: "90s Streetwear",
      image_url: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1000&q=80"
      ])
    },

    // -------------------------------------------------------------
    // OUTERWEAR & JACKETS (Affordable ₹899 - ₹1,499)
    // -------------------------------------------------------------
    {
      title: "90s Color-Block Retro Nylon Shell Windbreaker",
      slug: "90s-color-block-retro-nylon-shell-windbreaker",
      brand: "Nike Vintage White Tag",
      era: "1990s",
      category_id: catMap['leather-outerwear'],
      seller_id: sellerKaito,
      price: 899.00,
      original_price: 4800.00,
      size: "L (Chest: 46\" / Length: 27\")",
      condition_status: "Excellent Vintage",
      gender: "unisex",
      description: "Retro color-blocked nylon shell jacket with embroidered swoosh on chest and back collar, breathable mesh lining, and heavy-duty metal YKK zipper pull. Lightweight weather protection.",
      measurements: JSON.stringify({ chest_inches: "46 in", length: "27 in", sleeve: "25 in" }),
      materials: "100% Crinkle Nylon Shell, Poly Mesh Lining",
      color: "Teal, Purple & Obsidian Black",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: true,
      is_new_arrival: true,
      curated_collection: "Jackets & Outerwear",
      image_url: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "Vintage Distressed Brown Leather Café Racer Biker Jacket",
      slug: "vintage-distressed-brown-leather-cafe-racer-biker-jacket",
      brand: "Wilson's Leather Vintage",
      era: "1990s",
      category_id: catMap['leather-outerwear'],
      seller_id: sellerHelena,
      price: 1499.00,
      original_price: 8500.00,
      size: "M/L (Chest: 42\" / Length: 26\")",
      condition_status: "Exceptional Patina",
      gender: "unisex",
      description: "Genuine heavy steerhide leather with rich caramel brown patina, snap mandarin collar, zippered hand pockets, and antiqued brass hardware. Unbelievable thrift price for real vintage leather.",
      measurements: JSON.stringify({ chest_inches: "42 in", length: "26 in", sleeve: "25 in", shoulders: "19 in" }),
      materials: "100% Genuine Steerhide Leather, Rayon Quilted Lining",
      color: "Caramel Brown with Distressed Patina",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: true,
      is_new_arrival: false,
      curated_collection: "Jackets & Outerwear",
      image_url: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1000&q=80"
      ])
    },

    // -------------------------------------------------------------
    // SWEATERS, KNITS & BOTTOMS (Affordable ₹599 - ₹999)
    // -------------------------------------------------------------
    {
      title: "Coogi-Style 3D Textured Wave Grandpa Knit Sweater",
      slug: "coogi-style-3d-textured-wave-grandpa-knit-sweater",
      brand: "Tundra Canada Vintage",
      era: "1990s",
      category_id: catMap['sweaters-cardigans'],
      seller_id: sellerKaito,
      price: 999.00,
      original_price: 5400.00,
      size: "XL (Chest: 46\" / Length: 28\")",
      condition_status: "Excellent Vintage",
      gender: "unisex",
      description: "Vibrant 3D mercerized cotton knit sweater with geometric waves and intricate textured ridges. Pure 90s hip-hop nostalgia with relaxed slouchy fit.",
      measurements: JSON.stringify({ chest_inches: "46 in", length: "28 in", sleeve: "24 in" }),
      materials: "100% Mercerized Cotton 3D Knit",
      color: "Multi-Color Earth & Jewel Tones",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: true,
      is_new_arrival: true,
      curated_collection: "Vintage Knits",
      image_url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "Heavyweight Buffalo Plaid Boxy Flannel Overshirt",
      slug: "heavyweight-buffalo-plaid-boxy-flannel-overshirt",
      brand: "Five Brother 1980s",
      era: "1980s",
      category_id: catMap['everyday-classics'],
      seller_id: sellerKaito,
      price: 599.00,
      original_price: 2800.00,
      size: "L (Chest: 45\" / Length: 29\")",
      condition_status: "Excellent Vintage",
      gender: "boys",
      description: "Authentic union-made heavy cotton twill flannel. Twin chest flap pockets, cat-eye buttons, and a relaxed boxy cut that layers effortlessly over graphic tees.",
      measurements: JSON.stringify({ chest_inches: "45 in", length: "29 in", shoulders: "20 in" }),
      materials: "100% Heavy Brushed Cotton Twill",
      color: "Forest Green & Black Plaid",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: false,
      is_new_arrival: true,
      curated_collection: "90s Streetwear",
      image_url: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "90s Wide-Leg Baggy Skater Carpenter Denim Jeans",
      slug: "90s-wide-leg-baggy-skater-carpenter-denim-jeans",
      brand: "SilverTab Vintage",
      era: "1990s",
      category_id: catMap['vintage-denim'],
      seller_id: sellerKaito,
      price: 849.00,
      original_price: 3600.00,
      size: "W32 / L32",
      condition_status: "Excellent Vintage",
      gender: "boys",
      description: "Light vintage wash with wide-leg baggy skateboard silhouette, utility hammer loop, side tool pocket, and rugged triple-stitched outer seams.",
      measurements: JSON.stringify({ waist: "32 in", inseam: "32 in", rise: "12 in", leg_opening: "9.5 in" }),
      materials: "100% Heavyweight Cotton Denim 14.5oz",
      color: "Faded Light Stonewash",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: true,
      is_new_arrival: true,
      curated_collection: "90s Streetwear",
      image_url: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "Vintage Pastel Knit Button-Down Crop Cardigan",
      slug: "vintage-pastel-knit-button-down-crop-cardigan",
      brand: "Benetton 90s",
      era: "1990s",
      category_id: catMap['sweaters-cardigans'],
      seller_id: sellerHelena,
      price: 649.00,
      original_price: 2900.00,
      size: "S/M (Chest: 35\" / Length: 20\")",
      condition_status: "Near Mint Vintage",
      gender: "girls",
      description: "Soft baby-pink angora blend button-down crop cardigan with delicate scalloped collar and iridescent mother-of-pearl buttons. Looks adorable paired with skirts and slip dresses.",
      measurements: JSON.stringify({ chest_inches: "35 in", length: "20 in", sleeve: "22 in" }),
      materials: "Soft Angora Wool & Cotton Blend",
      color: "Pastel Blossom Pink",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: false,
      is_new_arrival: true,
      curated_collection: "Girls' Thrift Dresses",
      image_url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "Vintage 90s Collegiate Reverse Weave Heavy Crewneck",
      slug: "vintage-90s-collegiate-reverse-weave-heavy-crewneck",
      brand: "Champion Reverse Weave",
      era: "1990s",
      category_id: catMap['sweaters-cardigans'],
      seller_id: sellerKaito,
      price: 699.00,
      original_price: 3800.00,
      size: "L (Chest: 44\" / Length: 27\")",
      condition_status: "Excellent Vintage",
      gender: "unisex",
      description: "Authentic vintage heavyweight reverse weave crewneck in athletic heather grey with faded arch collegiate lettering. Ultra cozy brushed fleece interior.",
      measurements: JSON.stringify({ chest_inches: "44 in", length: "27 in", shoulders: "20 in" }),
      materials: "82% Heavy Cotton, 18% Poly Fleece",
      color: "Athletic Heather Grey",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: false,
      is_new_arrival: false,
      curated_collection: "90s Streetwear",
      image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80"
      ])
    },
    {
      title: "Vintage 90s Parachute Cargo Utility Pants",
      slug: "vintage-90s-parachute-cargo-utility-pants",
      brand: "Alpha Industries Archive",
      era: "1990s",
      category_id: catMap['vintage-denim'],
      seller_id: sellerKaito,
      price: 799.00,
      original_price: 3400.00,
      size: "M/L (Waist: 30-34\" Adjustable)",
      condition_status: "Excellent Vintage",
      gender: "unisex",
      description: "Authentic lightweight ripstop parachute pants with drawstring toggle waist, knee pleats for balloon mobility, and 6 deep cargo utility flap pockets.",
      measurements: JSON.stringify({ waist: "30-34 in (drawstring)", inseam: "30 in", leg_opening: "Adjustable Bungee" }),
      materials: "100% Lightweight Cotton Ripstop",
      color: "Olive Drab Green",
      is_one_of_one: true,
      stock_quantity: 1,
      status: "approved",
      featured: false,
      is_new_arrival: true,
      curated_collection: "90s Streetwear",
      image_url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80"
      ])
    }
  ];

  // Upsert products so old ones don't conflict and new ones are populated
  for (const p of sampleProducts) {
    const [existing] = await dbConn.query('SELECT id FROM products WHERE slug = ?', [p.slug]);
    if (existing.length === 0) {
      await dbConn.query(`
        INSERT INTO products 
        (title, slug, brand, era, category_id, seller_id, price, original_price, size, condition_status, gender, description, measurements, materials, color, is_one_of_one, stock_quantity, status, featured, is_new_arrival, curated_collection, image_url, images)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        p.title, p.slug, p.brand, p.era, p.category_id, p.seller_id, p.price, p.original_price,
        p.size, p.condition_status, p.gender, p.description, p.measurements, p.materials, p.color,
        p.is_one_of_one, p.stock_quantity, p.status, p.featured, p.is_new_arrival, p.curated_collection,
        p.image_url, p.images
      ]);
    } else {
      await dbConn.query(`
        UPDATE products SET
          title = ?, brand = ?, era = ?, category_id = ?, seller_id = ?, price = ?, original_price = ?,
          size = ?, condition_status = ?, gender = ?, description = ?, measurements = ?, materials = ?, color = ?,
          is_one_of_one = ?, stock_quantity = ?, status = ?, featured = ?, is_new_arrival = ?, curated_collection = ?,
          image_url = ?, images = ?
        WHERE slug = ?
      `, [
        p.title, p.brand, p.era, p.category_id, p.seller_id, p.price, p.original_price,
        p.size, p.condition_status, p.gender, p.description, p.measurements, p.materials, p.color,
        p.is_one_of_one, p.stock_quantity, p.status, p.featured, p.is_new_arrival, p.curated_collection,
        p.image_url, p.images, p.slug
      ]);
    }
  }

  // Update item counts in categories
  await dbConn.query(`
    UPDATE categories c
    SET item_count = (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.status = 'approved')
  `);
  console.log(`✓ Seeded & updated ${sampleProducts.length} authentic vintage products`);

  // 7. Seed Reviews
  const [revCount] = await dbConn.query('SELECT COUNT(*) as count FROM reviews');
  if (revCount[0].count === 0) {
    const [buyer] = await dbConn.query('SELECT id FROM users WHERE role = "buyer" LIMIT 1');
    const [prods] = await dbConn.query('SELECT id FROM products LIMIT 3');
    if (buyer.length > 0 && prods.length > 0) {
      for (const prod of prods) {
        await dbConn.query(`
          INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
          (?, ?, 5, 'Super affordable thrift rate! Measurements were 100% accurate and clothing arrived freshly laundered and smelled great.')
        `, [prod.id, buyer[0].id]);
      }
      console.log('✓ Seeded reviews');
    }
  }

  await dbConn.end();
  console.log('✓ Database initialization completed successfully.');
}

// Run standalone if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrationsAndSeed().then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}
