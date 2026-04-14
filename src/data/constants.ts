export const ARRONDISSEMENTS = {
  "1":  { lat: 48.8603, lon: 2.3477, label: "1er — Louvre" },
  "2":  { lat: 48.8666, lon: 2.3504, label: "2ème — Bourse" },
  "3":  { lat: 48.8630, lon: 2.3601, label: "3ème — Marais" },
  "4":  { lat: 48.8533, lon: 2.3526, label: "4ème — Hôtel de Ville" },
  "5":  { lat: 48.8462, lon: 2.3500, label: "5ème — Panthéon" },
  "6":  { lat: 48.8490, lon: 2.3340, label: "6ème — Luxembourg" },
  "7":  { lat: 48.8562, lon: 2.3187, label: "7ème — Palais-Bourbon" },
  "8":  { lat: 48.8745, lon: 2.3084, label: "8ème — Élysée" },
  "9":  { lat: 48.8777, lon: 2.3358, label: "9ème — Opéra" },
  "10": { lat: 48.8759, lon: 2.3622, label: "10ème — Entrepôt" },
  "11": { lat: 48.8589, lon: 2.3796, label: "11ème — Popincourt" },
  "12": { lat: 48.8427, lon: 2.3946, label: "12ème — Reuilly" },
  "13": { lat: 48.8315, lon: 2.3626, label: "13ème — Gobelins" },
  "14": { lat: 48.8280, lon: 2.3259, label: "14ème — Observatoire" },
  "15": { lat: 48.8420, lon: 2.3014, label: "15ème — Vaugirard" },
  "16": { lat: 48.8636, lon: 2.2735, label: "16ème — Passy" },
  "17": { lat: 48.8905, lon: 2.3139, label: "17ème — Batignolles" },
  "18": { lat: 48.8926, lon: 2.3474, label: "18ème — Butte-Montmartre" },
  "19": { lat: 48.8847, lon: 2.3799, label: "19ème — Buttes-Chaumont" },
  "20": { lat: 48.8646, lon: 2.3979, label: "20ème — Ménilmontant" }
};

export const MODEL_PERFORMANCE_HISTORY = [
  { model: "LinearRegression", MAE: 2558, R2: 0.12 },
  { model: "GAM", MAE: 2459, R2: 0.16 },
  { model: "LightGBM v1", MAE: 2417, R2: 0.19 },
  { model: "LightGBM v2", MAE: 2035, R2: 0.37 },
  { model: "LightGBM v3", MAE: 1417, R2: 0.43 },
  { model: "LightGBM v4 (current)", MAE: 1427, R2: 0.43 }
];

export const FEATURE_IMPORTANCE = [
  { feature: "voie_recent_prix_m2", importance: 0.92 },
  { feature: "arr_target_enc", importance: 0.85 },
  { feature: "grid_target_enc", importance: 0.78 },
  { feature: "log_surface", importance: 0.72 },
  { feature: "dist_center_km", importance: 0.65 },
  { feature: "nombre_pieces", importance: 0.55 },
  { feature: "is_premium_arr", importance: 0.42 },
  { feature: "latitude", importance: 0.38 },
  { feature: "longitude", importance: 0.29 },
  { feature: "trimestre", importance: 0.15 }
];

export const MOCK_URL_ANALYSIS = {
  "success": true,
  "source": "SeLoger",
  "titre": "Appartement T4/F4 92 m² — Goutte d'Or Paris 18e",
  "prix_annonce": 745000,
  "surface": 92.0,
  "pieces": 4,
  "arrondissement": 18,
  "latitude": 48.8926,
  "longitude": 2.3474,
  "prix_affiche_m2": 8097,
  "prix_predit_m2_brut": 8738,
  "prix_predit_m2": 8424,
  "prix_predit_total": 775024,
  "gem_score": 0.053,
  "gain_potentiel": 40849,
  "is_hidden_gem": false,
  "days_on_market": 7,
  "negotiation_margin": 0.05,
  "shap_top3": [
    { "feature": "Street price", "impact": -456 },
    { "feature": "18th arrondissement", "impact": -310 },
    { "feature": "Latitude", "impact": -202 }
  ],
  "listing_extras": {
    "etage": 1,
    "dpe_classe": "C",
    "has_balcon": true,
    "has_cave": true,
    "exposition": "O",
    "features_found": ["Étage 1", "rénov", "cave", "gardien", "ascenseur", "haussmannien", "Balcon", "Cave", "Exposition O"]
  },
  "vision": {
    "renovation_score": 3,
    "space_category": "Standard",
    "luminosite": "Lumineuse",
    "hauteur_plafond": "Standard",
    "has_outdoor_space": true,
    "qualite_generale": "Standard",
    "reasoning": "L'appartement est en bon état général avec des finitions classiques (parquet, moulures) et une bonne luminosité.",
    "photos_analyzed": 5
  },
  "corrections": {
    "market_trend": 0.97,
    "floor_corr": 0.96,
    "dpe_corr": 1.0,
    "reno_corr": 1.035,
    "expo_corr": 1.0,
    "reno_cost_m2": 300,
    "total_corr": 0.964
  },
  "photo_url": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000"
};

export const MOCK_GEMS = [
  {
    id: 1,
    title: "Haussmannian Core",
    arrondissement: 75001,
    location: "Rue Saint-Honoré, Paris",
    price: 845000,
    surface: 54,
    gem_score: 0.124,
    potential_gain: 45000,
    tags: ["Balcony", "Top Floor"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Canal-Side Loft",
    arrondissement: 75011,
    location: "Quai de Valmy, Paris",
    price: 620000,
    surface: 42,
    gem_score: 0.088,
    potential_gain: 32500,
    tags: ["Renovated", "View"],
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Trocadéro Retreat",
    arrondissement: 75016,
    location: "Av. d'Iéna, Paris",
    price: 1150000,
    surface: 78,
    gem_score: 0.152,
    potential_gain: 68000,
    tags: ["Doorman", "Prime"],
    image: "https://images.unsplash.com/photo-1499916078039-922301b0eb9b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "Marais Micro-Gem",
    arrondissement: 75004,
    location: "Rue des Francs Bourgeois, Paris",
    price: 395000,
    surface: 19,
    gem_score: 0.078,
    potential_gain: 18400,
    tags: ["History", "Rental Yield"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "Montmartre Artist Studio",
    arrondissement: 75018,
    location: "Rue Lepic, Paris",
    price: 510000,
    surface: 35,
    gem_score: 0.112,
    potential_gain: 28000,
    tags: ["View", "Quiet"],
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    title: "Bastille Modernist",
    arrondissement: 75011,
    location: "Rue de la Roquette, Paris",
    price: 725000,
    surface: 62,
    gem_score: -0.032,
    potential_gain: -15000,
    tags: ["Modern", "Elevator"],
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800"
  }
];
