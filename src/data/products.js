const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'HydraBarrier Ceramide Moisturizer',
    brand: 'Skintific',
    category: 'Skincare',
    skinType: 'All Skin Types',
    price: 139000,
    description: 'Pelembap gel ringan dengan 5X Ceramide untuk memperbaiki skin barrier dan mengunci kelembapan selama 24 jam.',
    image_url: '/placeholder.svg',
    ingredients: [
      { name: 'Key Active', quantity: '5X Ceramide + Hyaluronic Acid' },
      { name: 'Volume', quantity: '30g' },
      { name: 'BPOM', quantity: 'NA11210100167' },
    ],
    steps: [
      'Bersihkan wajah dengan facial wash dan gunakan toner.',
      'Ambil produk secukupnya dan oleskan merata ke seluruh wajah dan leher.',
      'Gunakan pagi dan malam hari untuk hasil optimal.',
    ],
  },
  {
    id: 'prod-2',
    name: 'Velvet Matte Blur Cushion SPF 35',
    brand: 'Somethinc',
    category: 'Makeup',
    skinType: 'Oily & Combination',
    price: 185000,
    description: 'Cushion dengan hasil akhir velvet matte yang menyamarkan pori-pori, tahan minyak hingga 12 jam, dan non-comedogenic.',
    image_url: '/placeholder.svg',
    ingredients: [
      { name: 'Shade', quantity: 'N02 Charlotte' },
      { name: 'Coverage', quantity: 'Medium to Full' },
      { name: 'UV Filter', quantity: 'SPF 35 PA+++' },
    ],
    steps: [
      'Tekan puff secara perlahan pada bantalan cushion.',
      'Tap-tap secara merata mulai dari bagian tengah wajah ke arah luar.',
      'Set dengan loose powder pada area T-zone bila diperlukan.',
    ],
  },
  {
    id: 'prod-3',
    name: 'Niacinamide 10% + Brightening Serum',
    brand: 'Avoskin',
    category: 'Serum',
    skinType: 'Dull & Acne-Prone',
    price: 149000,
    description: 'Serum pencerah intensif untuk menyamarkan noda hitam bekas jerawat dan meratakan tekstur kulit.',
    image_url: '/placeholder.svg',
    ingredients: [
      { name: 'Key Active', quantity: 'Niacinamide 10% + Beta Glucan' },
      { name: 'Volume', quantity: '30ml' },
      { name: 'pH Level', quantity: '5.5 - 6.0' },
    ],
    steps: [
      'Teteskan 2-3 tetes serum ke telapak tangan yang bersih.',
      'Tepuk perlahan ke wajah hingga meresap sempurna sebelum pelembap.',
    ],
  },
  {
    id: 'prod-4',
    name: 'Dewy Juicy Lip Tint Gloss',
    brand: 'Barenbliss',
    category: 'Lip Product',
    skinType: 'All Skin Types',
    price: 69000,
    description: 'Lip tint bertekstur gel ringan dengan kilau sehat alami dan stain tahan lama tanpa membuat bibir kering.',
    image_url: '/placeholder.svg',
    ingredients: [
      { name: 'Shade', quantity: '04 Rose Glaze' },
      { name: 'Enriched With', quantity: 'Shea Butter & Jojoba Oil' },
      { name: 'Netto', quantity: '3g' },
    ],
    steps: [
      'Aplikasikan secara tipis di bagian dalam bibir untuk efek ombre.',
      'Ratakan ke seluruh bibir untuk tampilan full glossy lips.',
    ],
  },
]

export default INITIAL_PRODUCTS