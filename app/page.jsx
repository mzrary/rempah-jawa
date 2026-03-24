"use client";
import { useState, useEffect } from "react";

// ============================================================
// MOCK DATA & CONSTANTS
// ============================================================
const PRODUCTS = [
  {
    id: 1, slug: "jahe-merah", name: "Jahe Merah", category: "jahe",
    price: 45000, unit: "kg", stock: 50, available: true,
    badge: "Best Seller",
    tagline: "Hangat & Berkhasiat",
    desc: "Jahe merah pilihan dari petani lokal. Kaya antioksidan, sempurna untuk minuman kesehatan, jamu, dan masakan.",
    benefits: ["Meningkatkan imunitas", "Anti-inflamasi alami", "Menghangatkan tubuh"],
    color: "#C0392B", accent: "#E74C3C", bg: "from-red-900 to-orange-800",
    emoji: "🌿",
  },
  {
    id: 2, slug: "jahe-emprit", name: "Jahe Emprit", category: "jahe",
    price: 35000, unit: "kg", stock: 30, available: true,
    badge: "Organik",
    tagline: "Segar & Aromatik",
    desc: "Jahe emprit dengan aroma segar dan rasa yang lebih ringan. Ideal untuk minuman, kue, dan masakan Asia.",
    benefits: ["Melancarkan pencernaan", "Aroma segar khas", "Cocok untuk masakan"],
    color: "#27AE60", accent: "#2ECC71", bg: "from-green-900 to-emerald-700",
    emoji: "🌱",
  },
  {
    id: 3, slug: "gula-aren", name: "Gula Aren", category: "gula",
    price: 28000, unit: "kg", stock: 80, available: true,
    badge: "Stok Terbatas",
    tagline: "Manis Alami Murni",
    desc: "Gula aren asli dari pohon enau pilihan. Proses tradisional tanpa bahan kimia, kaya mineral alami.",
    benefits: ["Indeks glikemik rendah", "Kaya mineral alami", "Bebas pengawet"],
    color: "#8B4513", accent: "#D2691E", bg: "from-amber-900 to-yellow-800",
    emoji: "🍯",
  },
  {
    id: 4, slug: "gula-kelapa", name: "Gula Kelapa", category: "gula",
    price: 25000, unit: "kg", stock: 60, available: true,
    badge: "Pre-Order",
    tagline: "Tradisional & Sehat",
    desc: "Gula kelapa murni dari nira kelapa segar. Tekstur granul sempurna, cocok untuk berbagai resep.",
    benefits: ["Proses tradisional", "Tekstur granul halus", "Rasa karamel alami"],
    color: "#A0522D", accent: "#CD853F", bg: "from-orange-900 to-amber-700",
    emoji: "🥥",
  },
  {
    id: 5, slug: "kopi-arabika", name: "Kopi Arabika", category: "kopi",
    price: 120000, unit: "kg", stock: 20, available: true,
    badge: "Premium",
    tagline: "Kompleks & Elegan",
    desc: "Biji kopi arabika single origin dari dataran tinggi. Profil rasa floral, fruity, dengan keasaman cerah.",
    benefits: ["Single origin", "Kadar kafein rendah", "Profil rasa kompleks"],
    color: "#2C1810", accent: "#6F4E37", bg: "from-stone-900 to-amber-950",
    emoji: "☕",
  },
  {
    id: 6, slug: "kopi-robusta", name: "Kopi Robusta", category: "kopi",
    price: 85000, unit: "kg", stock: 40, available: false,
    badge: "Konfirmasi Dulu",
    tagline: "Kuat & Berkarakter",
    desc: "Kopi robusta pilihan dengan body penuh dan rasa earthy yang kuat. Sempurna untuk espresso klasik.",
    benefits: ["Body penuh & bold", "Kadar kafein tinggi", "Cocok untuk espresso"],
    color: "#1A0A00", accent: "#4A2C17", bg: "from-neutral-900 to-stone-800",
    emoji: "🫘",
  },
];

const CATEGORIES = ["Semua", "jahe", "gula", "kopi"];
const CATEGORY_LABELS = { "Semua": "Semua Produk", "jahe": "Jahe", "gula": "Gula", "kopi": "Kopi" };

const formatRupiah = (n) => "Rp " + n.toLocaleString("id-ID");

// ============================================================
// PRODUCT PLACEHOLDER IMAGE
// ============================================================
function ProductPlaceholder({ product, size = 220 }) {
  const gradients = {
    1: ["#7B1F1F", "#C0392B", "#E74C3C"],
    2: ["#145A32", "#1E8449", "#27AE60"],
    3: ["#4A2700", "#8B4513", "#D4A017"],
    4: ["#3B1C0A", "#7D4B1E", "#C68B3A"],
    5: ["#0D0705", "#2C1810", "#6F4E37"],
    6: ["#080402", "#1A0A00", "#3D2010"],
  };
  const g = gradients[product.id] || ["#2d2d2d", "#555", "#888"];

  return (
    <svg width={size} height={size} viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`bg${product.id}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={g[2]} stopOpacity="0.9"/>
          <stop offset="60%" stopColor={g[1]}/>
          <stop offset="100%" stopColor={g[0]}/>
        </radialGradient>
        <filter id={`glow${product.id}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id={`noise${product.id}`} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feBlend in="SourceGraphic" mode="multiply" result="blend"/>
          <feComposite in="blend" in2="SourceGraphic" operator="in"/>
        </filter>
      </defs>
      {/* Background */}
      <rect width="220" height="220" rx="16" fill={`url(#bg${product.id})`}/>
      {/* Noise overlay */}
      <rect width="220" height="220" rx="16" fill="white" opacity="0.03" filter={`url(#noise${product.id})`}/>
      {/* Decorative rings */}
      <circle cx="110" cy="95" r="72" fill="none" stroke="white" strokeWidth="0.5" opacity="0.15"/>
      <circle cx="110" cy="95" r="55" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/>
      <circle cx="110" cy="95" r="38" fill={g[2]} opacity="0.25"/>
      {/* Main emoji */}
      <text x="110" y="115" textAnchor="middle" fontSize="56" filter={`url(#glow${product.id})`}>{product.emoji}</text>
      {/* Product name */}
      <text x="110" y="160" textAnchor="middle" fontSize="13" fontWeight="700" fill="white" opacity="0.95" fontFamily="serif">{product.name}</text>
      <text x="110" y="177" textAnchor="middle" fontSize="10" fill="white" opacity="0.6" fontFamily="sans-serif">{product.tagline}</text>
      {/* Corner decoration */}
      <circle cx="22" cy="22" r="12" fill="white" opacity="0.05"/>
      <circle cx="198" cy="198" r="18" fill="white" opacity="0.04"/>
    </svg>
  );
}

// ============================================================
// LOGO PLACEHOLDER
// ============================================================
function LogoPlaceholder({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50"/>
          <stop offset="50%" stopColor="#8BC34A"/>
          <stop offset="100%" stopColor="#D4A017"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#logoGrad)"/>
      <text x="20" y="27" textAnchor="middle" fontSize="20" fontFamily="serif">🌿</text>
    </svg>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ cartCount, onCartOpen, page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(15,10,5,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
      transition: "all 0.3s ease",
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        {/* Logo */}
        <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
          <LogoPlaceholder size={36}/>
          <span style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700, color: "#F5E6C8", letterSpacing: 0.5 }}>Rempah<span style={{ color: "#8BC34A" }}>Jawa</span></span>
        </button>

        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="desktop-nav">
          {["home","produk","tentang","kontak"].map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              background: page === p ? "rgba(139,195,74,0.15)" : "none",
              border: page === p ? "1px solid rgba(139,195,74,0.4)" : "1px solid transparent",
              color: page === p ? "#8BC34A" : "#C8B99A",
              padding: "6px 16px", borderRadius: 8, cursor: "pointer",
              fontFamily: "sans-serif", fontSize: 14, fontWeight: 500, textTransform: "capitalize",
              transition: "all 0.2s",
            }}>
              {p === "home" ? "Beranda" : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
          <button onClick={() => setPage("admin")} style={{
            background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.3)",
            color: "#D4A017", padding: "6px 14px", borderRadius: 8, cursor: "pointer",
            fontFamily: "sans-serif", fontSize: 13, fontWeight: 500,
          }}>⚙ Admin</button>
        </div>

        {/* Cart */}
        <button onClick={onCartOpen} style={{
          position: "relative", background: "rgba(139,195,74,0.15)", border: "1px solid rgba(139,195,74,0.35)",
          borderRadius: 10, padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
          color: "#F5E6C8", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600,
        }}>
          🛒 Keranjang
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: -8, right: -8,
              background: "#E74C3C", color: "white", borderRadius: "50%",
              width: 20, height: 20, fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{cartCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
}

// ============================================================
// HERO SECTION
// ============================================================
function HeroSection({ setPage }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0A0602 0%, #1A0E05 40%, #0D1A08 100%)",
      position: "relative", overflow: "hidden", paddingTop: 68,
    }}>
      {/* Background decoration */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,195,74,0.08) 0%, transparent 70%)" }}/>
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,23,0.07) 0%, transparent 70%)" }}/>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,195,74,0.03) 0%, transparent 60%)" }}/>
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${10 + (i * 7.5) % 85}%`,
            top: `${15 + (i * 11) % 70}%`,
            width: 3 + (i % 3), height: 3 + (i % 3),
            borderRadius: "50%",
            background: i % 2 === 0 ? "rgba(139,195,74,0.4)" : "rgba(212,160,23,0.35)",
            animation: `float ${3 + (i % 3)}s ease-in-out ${i * 0.4}s infinite alternate`,
          }}/>
        ))}
      </div>

      <div style={{ textAlign: "center", maxWidth: 800, padding: "0 24px", position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(139,195,74,0.12)", border: "1px solid rgba(139,195,74,0.3)",
          borderRadius: 100, padding: "6px 18px", marginBottom: 32,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#8BC34A", display: "inline-block", boxShadow: "0 0 8px #8BC34A" }}/>
          <span style={{ color: "#8BC34A", fontSize: 13, fontFamily: "sans-serif", fontWeight: 600, letterSpacing: 1 }}>PRODUK HASIL BUMI ORGANIK</span>
        </div>

        <h1 style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: "clamp(42px, 6vw, 76px)",
          fontWeight: 700, color: "#F5E6C8",
          lineHeight: 1.1, marginBottom: 24,
          textShadow: "0 4px 40px rgba(0,0,0,0.5)",
        }}>
          Dari Alam,<br/>
          <span style={{ color: "#8BC34A" }}>Untuk Kesehatan</span><br/>
          <span style={{ color: "#D4A017" }}>Anda</span>
        </h1>

        <p style={{
          fontFamily: "sans-serif", fontSize: 18, color: "#A89070",
          maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7,
        }}>
          Jahe, gula, dan kopi pilihan langsung dari petani terpercaya. 
          Kualitas premium, proses alami, dikirim ke seluruh Indonesia.
        </p>

        {/* Product pills */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 44 }}>
          {["🌿 Jahe Merah", "🌱 Jahe Emprit", "🍯 Gula Aren", "🥥 Gula Kelapa", "☕ Kopi Arabika", "🫘 Kopi Robusta"].map(p => (
            <span key={p} style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 100, padding: "6px 14px", fontSize: 13, color: "#C8B99A",
              fontFamily: "sans-serif",
            }}>{p}</span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("produk")} style={{
            background: "linear-gradient(135deg, #8BC34A, #5D9E21)",
            border: "none", borderRadius: 12, padding: "14px 36px",
            color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer",
            fontFamily: "sans-serif", boxShadow: "0 8px 32px rgba(139,195,74,0.35)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(139,195,74,0.5)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(139,195,74,0.35)"; }}
          >
            🛒 Lihat Produk
          </button>
          <button onClick={() => setPage("kontak")} style={{
            background: "transparent", border: "1px solid rgba(212,160,23,0.5)",
            borderRadius: 12, padding: "14px 36px",
            color: "#D4A017", fontSize: 16, fontWeight: 600, cursor: "pointer",
            fontFamily: "sans-serif", transition: "all 0.2s",
          }}
            onMouseOver={e => { e.currentTarget.style.background = "rgba(212,160,23,0.1)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
          >
            💬 Hubungi Kami
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
          {[["6+", "Varian Produk"], ["100%", "Organik"], ["COD", "Tersedia"], ["Pre-Order", "Accepted"]].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: 28, fontWeight: 700, color: "#F5E6C8" }}>{val}</div>
              <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#7A6A50", marginTop: 2, letterSpacing: 0.5 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float { from { transform: translateY(0px); } to { transform: translateY(-12px); } }
      `}</style>
    </div>
  );
}

// ============================================================
// PRODUCT CARD
// ============================================================
function ProductCard({ product, onAddCart, onPreOrder, onDetail }) {
  const [hover, setHover] = useState(false);

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: "rgba(255,255,255,0.03)", border: `1px solid ${hover ? "rgba(139,195,74,0.3)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 20, overflow: "hidden", transition: "all 0.3s ease",
        transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover ? "0 20px 60px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.2)",
        cursor: "pointer",
      }}>
      {/* Image */}
      <div onClick={() => onDetail(product)} style={{ position: "relative", overflow: "hidden", display: "flex", justifyContent: "center", padding: "24px 24px 8px", background: `linear-gradient(160deg, ${product.color}22, ${product.color}11)` }}>
        <ProductPlaceholder product={product} size={200}/>
        {/* Badge */}
        <div style={{
          position: "absolute", top: 16, left: 16,
          background: product.badge === "Best Seller" ? "linear-gradient(90deg,#f59e0b,#d97706)" :
            product.badge === "Premium" ? "linear-gradient(90deg,#7c3aed,#4f46e5)" :
            product.badge === "Organik" ? "linear-gradient(90deg,#059669,#047857)" :
            product.badge === "Stok Terbatas" ? "linear-gradient(90deg,#dc2626,#b91c1c)" :
            "linear-gradient(90deg,#6b7280,#4b5563)",
          color: "white", borderRadius: 6, padding: "3px 10px",
          fontSize: 11, fontWeight: 700, fontFamily: "sans-serif", letterSpacing: 0.5,
        }}>{product.badge}</div>
        {/* Availability */}
        <div style={{
          position: "absolute", top: 16, right: 16,
          background: product.available ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
          border: `1px solid ${product.available ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
          color: product.available ? "#4ade80" : "#f87171",
          borderRadius: 6, padding: "3px 10px", fontSize: 11, fontFamily: "sans-serif",
        }}>{product.available ? "● Tersedia" : "● Konfirmasi"}</div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px 20px" }}>
        <div style={{ fontSize: 11, color: "#6B7280", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{product.category}</div>
        <h3 style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700, color: "#F5E6C8", margin: "0 0 6px" }}>{product.name}</h3>
        <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#7A6A50", margin: "0 0 14px", lineHeight: 1.5 }}>{product.tagline}</p>

        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 16 }}>
          <span style={{ fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: 700, color: "#D4A017" }}>{formatRupiah(product.price)}</span>
          <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6B7280" }}>/ {product.unit}</span>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={(e) => { e.stopPropagation(); product.available ? onAddCart(product) : onPreOrder(product); }}
            style={{
              flex: 1, background: product.available ? "linear-gradient(135deg,#8BC34A,#5D9E21)" : "linear-gradient(135deg,#D4A017,#A07810)",
              border: "none", borderRadius: 10, padding: "10px 8px",
              color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer",
              fontFamily: "sans-serif", transition: "opacity 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >{product.available ? "🛒 Beli" : "📋 Pre-Order"}</button>
          <button onClick={(e) => { e.stopPropagation(); onPreOrder(product); }}
            style={{
              flex: 1, background: "transparent",
              border: "1px solid rgba(212,160,23,0.35)", borderRadius: 10, padding: "10px 8px",
              color: "#D4A017", fontWeight: 600, fontSize: 13, cursor: "pointer",
              fontFamily: "sans-serif", transition: "background 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(212,160,23,0.1)"}
            onMouseOut={e => e.currentTarget.style.background = "transparent"}
          >📅 Pre-Order</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PRODUCT PAGE
// ============================================================
function ProductPage({ onAddCart, onPreOrder, onDetail }) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = PRODUCTS.filter(p =>
    (activeCategory === "Semua" || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0A0602", paddingTop: 88, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ display: "inline-block", background: "rgba(139,195,74,0.1)", border: "1px solid rgba(139,195,74,0.25)", borderRadius: 100, padding: "4px 16px", marginBottom: 16 }}>
            <span style={{ color: "#8BC34A", fontSize: 12, fontFamily: "sans-serif", fontWeight: 600, letterSpacing: 1 }}>KATALOG PRODUK</span>
          </div>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 40, color: "#F5E6C8", margin: "0 0 12px" }}>Pilihan Terbaik Kami</h2>
          <p style={{ fontFamily: "sans-serif", color: "#7A6A50", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>Semua produk langsung dari petani lokal terpercaya, tanpa perantara.</p>
        </div>

        {/* Search & Filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                background: activeCategory === cat ? "rgba(139,195,74,0.2)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${activeCategory === cat ? "rgba(139,195,74,0.5)" : "rgba(255,255,255,0.1)"}`,
                color: activeCategory === cat ? "#8BC34A" : "#7A6A50",
                borderRadius: 100, padding: "7px 18px", cursor: "pointer",
                fontFamily: "sans-serif", fontSize: 14, fontWeight: 500, transition: "all 0.2s",
              }}>{CATEGORY_LABELS[cat]}</button>
            ))}
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Cari produk..."
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 10, padding: "9px 16px", color: "#F5E6C8",
              fontFamily: "sans-serif", fontSize: 14, outline: "none", minWidth: 220,
            }}/>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onAddCart={onAddCart} onPreOrder={onPreOrder} onDetail={onDetail}/>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 80, color: "#6B7280", fontFamily: "sans-serif" }}>Produk tidak ditemukan 😕</div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// PRODUCT DETAIL MODAL
// ============================================================
function ProductDetailModal({ product, onClose, onAddCart, onPreOrder }) {
  if (!product) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={onClose}>
      <div style={{ background: "#12100A", borderRadius: 24, maxWidth: 680, width: "100%", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 280px", background: `linear-gradient(160deg,${product.color}33,${product.color}11)`, display: "flex", justifyContent: "center", alignItems: "center", padding: 32, minWidth: 200 }}>
            <ProductPlaceholder product={product} size={220}/>
          </div>
          <div style={{ flex: 1, padding: 32, minWidth: 260 }}>
            <button onClick={onClose} style={{ float: "right", background: "none", border: "none", color: "#7A6A50", fontSize: 24, cursor: "pointer", lineHeight: 1 }}>×</button>
            <div style={{ fontSize: 11, color: "#8BC34A", fontFamily: "sans-serif", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{product.category}</div>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 28, color: "#F5E6C8", margin: "0 0 6px" }}>{product.name}</h2>
            <p style={{ color: "#D4A017", fontFamily: "sans-serif", fontSize: 14, marginBottom: 16 }}>{product.tagline}</p>
            <p style={{ color: "#8A7A60", fontFamily: "sans-serif", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{product.desc}</p>

            <div style={{ marginBottom: 20 }}>
              <div style={{ color: "#F5E6C8", fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>✨ Manfaat:</div>
              {product.benefits.map(b => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "#8BC34A", fontSize: 14 }}>✓</span>
                  <span style={{ color: "#8A7A60", fontFamily: "sans-serif", fontSize: 14 }}>{b}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 24 }}>
              <span style={{ fontFamily: "'Georgia', serif", fontSize: 28, fontWeight: 700, color: "#D4A017" }}>{formatRupiah(product.price)}</span>
              <span style={{ color: "#6B7280", fontSize: 13, fontFamily: "sans-serif" }}>/ {product.unit}</span>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { onAddCart(product); onClose(); }} style={{
                flex: 1, background: "linear-gradient(135deg,#8BC34A,#5D9E21)", border: "none",
                borderRadius: 10, padding: "12px", color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "sans-serif",
              }}>🛒 Tambah ke Keranjang</button>
              <button onClick={() => { onPreOrder(product); onClose(); }} style={{
                flex: 1, background: "transparent", border: "1px solid rgba(212,160,23,0.4)",
                borderRadius: 10, padding: "12px", color: "#D4A017", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "sans-serif",
              }}>📋 Pre-Order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CART DRAWER
// ============================================================
function CartDrawer({ open, onClose, cart, setCart, onCheckout }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const update = (id, delta) => {
    setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  return (
    <>
      {open && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 149 }} onClick={onClose}/>}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 400, maxWidth: "100vw",
        background: "#12100A", borderLeft: "1px solid rgba(255,255,255,0.08)",
        zIndex: 150, transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(.4,0,.2,1)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontFamily: "'Georgia', serif", fontSize: 22, color: "#F5E6C8", margin: 0 }}>🛒 Keranjang</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#7A6A50", fontSize: 24, cursor: "pointer" }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 60, color: "#6B7280", fontFamily: "sans-serif" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
              <p>Keranjang masih kosong</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 14, marginBottom: 20, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <ProductPlaceholder product={item} size={64}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Georgia', serif", fontSize: 15, color: "#F5E6C8", marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 14, color: "#D4A017", marginBottom: 8 }}>{formatRupiah(item.price)}/{item.unit}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => update(item.id, -1)} style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.08)", border: "none", color: "white", cursor: "pointer", fontSize: 16 }}>−</button>
                  <span style={{ fontFamily: "sans-serif", color: "#F5E6C8", minWidth: 24, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => update(item.id, 1)} style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(139,195,74,0.2)", border: "none", color: "#8BC34A", cursor: "pointer", fontSize: 16 }}>+</button>
                </div>
              </div>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: 15, color: "#D4A017", whiteSpace: "nowrap" }}>{formatRupiah(item.price * item.qty)}</div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: 24, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontFamily: "sans-serif", color: "#8A7A60", fontSize: 15 }}>Total:</span>
              <span style={{ fontFamily: "'Georgia', serif", fontSize: 22, color: "#D4A017", fontWeight: 700 }}>{formatRupiah(total)}</span>
            </div>
            <button onClick={onCheckout} style={{
              width: "100%", background: "linear-gradient(135deg,#8BC34A,#5D9E21)", border: "none",
              borderRadius: 12, padding: "14px", color: "white", fontWeight: 700, fontSize: 16,
              cursor: "pointer", fontFamily: "sans-serif", boxShadow: "0 6px 24px rgba(139,195,74,0.3)",
            }}>
              💳 Checkout & Bayar
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ============================================================
// PRE-ORDER MODAL
// ============================================================
function PreOrderModal({ product, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", qty: 1, date: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone) { alert("Mohon isi nama, email, dan telepon."); return; }
    setSubmitted(true);
    onSubmit({ ...form, product });
  };

  if (!product) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={onClose}>
      <div style={{ background: "#12100A", borderRadius: 24, maxWidth: 500, width: "100%", border: "1px solid rgba(212,160,23,0.25)", padding: 36 }}
        onClick={e => e.stopPropagation()}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h3 style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8", fontSize: 24, margin: "0 0 12px" }}>Pre-Order Diterima!</h3>
            <p style={{ color: "#8A7A60", fontFamily: "sans-serif", lineHeight: 1.6 }}>
              Pre-order <strong style={{ color: "#D4A017" }}>{product.name}</strong> Anda telah diterima.<br/>
              Kami akan konfirmasi ketersediaan dalam 1×24 jam melalui WhatsApp/email.
            </p>
            <button onClick={onClose} style={{ marginTop: 24, background: "linear-gradient(135deg,#D4A017,#A07810)", border: "none", borderRadius: 10, padding: "12px 32px", color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", fontSize: 15 }}>Tutup</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 24 }}>
              <div>
                <div style={{ color: "#D4A017", fontSize: 11, fontFamily: "sans-serif", letterSpacing: 1, marginBottom: 4 }}>FORMULIR PRE-ORDER</div>
                <h3 style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8", fontSize: 22, margin: 0 }}>{product.name}</h3>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", color: "#7A6A50", fontSize: 24, cursor: "pointer" }}>×</button>
            </div>

            <div style={{ background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontFamily: "sans-serif", fontSize: 13, color: "#C8A020", lineHeight: 1.5 }}>
              ⚠️ Produk ini perlu konfirmasi ketersediaan. Kami akan menghubungi Anda sebelum pembayaran.
            </div>

            {[
              { label: "Nama Lengkap *", key: "name", type: "text", placeholder: "Nama Anda" },
              { label: "Email *", key: "email", type: "email", placeholder: "email@contoh.com" },
              { label: "No. WhatsApp *", key: "phone", type: "tel", placeholder: "08xxxxxxxxxx" },
              { label: "Tanggal Dibutuhkan", key: "date", type: "date", placeholder: "" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 13, color: "#8A7A60", marginBottom: 5 }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "10px 14px", color: "#F5E6C8", fontFamily: "sans-serif", fontSize: 14, outline: "none" }}/>
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 13, color: "#8A7A60", marginBottom: 5 }}>Jumlah (kg)</label>
                <input type="number" min="1" value={form.qty} onChange={e => setForm(p => ({ ...p, qty: e.target.value }))}
                  style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "10px 14px", color: "#F5E6C8", fontFamily: "sans-serif", fontSize: 14, outline: "none" }}/>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 13, color: "#8A7A60", marginBottom: 5 }}>Catatan (opsional)</label>
              <textarea rows={3} placeholder="Informasi tambahan..." value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "10px 14px", color: "#F5E6C8", fontFamily: "sans-serif", fontSize: 14, outline: "none", resize: "vertical" }}/>
            </div>

            <button onClick={handleSubmit} style={{
              width: "100%", background: "linear-gradient(135deg,#D4A017,#A07810)", border: "none",
              borderRadius: 12, padding: "13px", color: "white", fontWeight: 700, fontSize: 15,
              cursor: "pointer", fontFamily: "sans-serif",
            }}>📋 Kirim Pre-Order</button>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CHECKOUT PAGE
// ============================================================
function CheckoutPage({ cart, onBack, onSuccess }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", zip: "" });
  const [payMethod, setPayMethod] = useState("qris");
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 25000;

  const handleOrder = () => {
    if (!form.name || !form.email || !form.phone || !form.address) { alert("Mohon lengkapi data pengiriman."); return; }
    setStep(3);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0602", paddingTop: 88, paddingBottom: 60 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 16px", color: "#8A7A60", cursor: "pointer", fontFamily: "sans-serif", marginBottom: 32 }}>← Kembali</button>

        {/* Steps */}
        <div style={{ display: "flex", gap: 0, marginBottom: 40, alignItems: "center", justifyContent: "center" }}>
          {[["1", "Keranjang"], ["2", "Data Pengiriman"], ["3", "Pembayaran"]].map(([n, lbl], i) => (
            <div key={n} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: step >= parseInt(n) ? "linear-gradient(135deg,#8BC34A,#5D9E21)" : "rgba(255,255,255,0.08)",
                  color: step >= parseInt(n) ? "white" : "#6B7280", fontWeight: 700, fontSize: 14, fontFamily: "sans-serif",
                }}>{n}</div>
                <span style={{ fontFamily: "sans-serif", fontSize: 11, color: step >= parseInt(n) ? "#8BC34A" : "#6B7280", marginTop: 4, whiteSpace: "nowrap" }}>{lbl}</span>
              </div>
              {i < 2 && <div style={{ width: 60, height: 1, background: step > i + 1 ? "#8BC34A" : "rgba(255,255,255,0.1)", margin: "0 8px 20px" }}/>}
            </div>
          ))}
        </div>

        {step === 3 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
            <h2 style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8", fontSize: 28, marginBottom: 12 }}>Pesanan Berhasil!</h2>
            <p style={{ color: "#8A7A60", fontFamily: "sans-serif", lineHeight: 1.7, maxWidth: 400, margin: "0 auto 12px" }}>
              Terima kasih telah memesan! Silakan lakukan pembayaran ke:
            </p>
            <div style={{ background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.25)", borderRadius: 16, padding: 28, maxWidth: 400, margin: "0 auto 28px", textAlign: "left" }}>
              <div style={{ fontFamily: "sans-serif", color: "#D4A017", fontWeight: 700, marginBottom: 14 }}>💳 Detail Pembayaran (Xendit)</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#8A7A60", fontFamily: "sans-serif", fontSize: 14 }}>Metode:</span>
                <span style={{ color: "#F5E6C8", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600 }}>{payMethod.toUpperCase()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#8A7A60", fontFamily: "sans-serif", fontSize: 14 }}>Subtotal:</span>
                <span style={{ color: "#F5E6C8", fontFamily: "sans-serif", fontSize: 14 }}>{formatRupiah(total)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: "#8A7A60", fontFamily: "sans-serif", fontSize: 14 }}>Ongkir:</span>
                <span style={{ color: "#F5E6C8", fontFamily: "sans-serif", fontSize: 14 }}>{formatRupiah(shipping)}</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#F5E6C8", fontFamily: "'Georgia', serif", fontWeight: 700 }}>Total:</span>
                <span style={{ color: "#D4A017", fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700 }}>{formatRupiah(total + shipping)}</span>
              </div>
              <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(139,195,74,0.1)", borderRadius: 8, fontFamily: "sans-serif", fontSize: 13, color: "#8BC34A" }}>
                🔒 Pembayaran diproses aman melalui <strong>Xendit</strong>. Link pembayaran akan dikirim via WhatsApp & email.
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={onSuccess} style={{ background: "linear-gradient(135deg,#8BC34A,#5D9E21)", border: "none", borderRadius: 12, padding: "13px 32px", color: "white", fontWeight: 700, fontFamily: "sans-serif", fontSize: 15, cursor: "pointer" }}>🏠 Kembali ke Beranda</button>
              <a href="https://wa.me/6285157266243?text=Halo, saya baru saja melakukan pemesanan" target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 8, background: "#25D366", border: "none", borderRadius: 12, padding: "13px 24px", color: "white", fontWeight: 700, fontFamily: "sans-serif", fontSize: 15, textDecoration: "none" }}>
                💬 Konfirmasi via WA
              </a>
            </div>
          </div>
        ) : step === 1 ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, flexWrap: "wrap" }}>
            <div>
              <h3 style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8", fontSize: 20, marginBottom: 20 }}>Ringkasan Pesanan</h3>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", alignItems: "center" }}>
                  <ProductPlaceholder product={item} size={56}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8", marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontFamily: "sans-serif", color: "#6B7280", fontSize: 13 }}>{item.qty} {item.unit} × {formatRupiah(item.price)}</div>
                  </div>
                  <div style={{ fontFamily: "'Georgia', serif", color: "#D4A017" }}>{formatRupiah(item.price * item.qty)}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                <h4 style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8", margin: "0 0 20px" }}>Rincian Biaya</h4>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ color: "#8A7A60", fontFamily: "sans-serif", fontSize: 14 }}>Subtotal</span>
                  <span style={{ color: "#F5E6C8", fontFamily: "sans-serif" }}>{formatRupiah(total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ color: "#8A7A60", fontFamily: "sans-serif", fontSize: 14 }}>Ongkos Kirim</span>
                  <span style={{ color: "#F5E6C8", fontFamily: "sans-serif" }}>{formatRupiah(shipping)}</span>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8", fontWeight: 700 }}>Total</span>
                  <span style={{ fontFamily: "'Georgia', serif", color: "#D4A017", fontSize: 20, fontWeight: 700 }}>{formatRupiah(total + shipping)}</span>
                </div>
                <button onClick={() => setStep(2)} style={{ width: "100%", background: "linear-gradient(135deg,#8BC34A,#5D9E21)", border: "none", borderRadius: 12, padding: "13px", color: "white", fontWeight: 700, fontFamily: "sans-serif", fontSize: 15, cursor: "pointer" }}>
                  Lanjut ke Pengiriman →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 28 }}>
            <div>
              <h3 style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8", fontSize: 20, marginBottom: 20 }}>Data Pengiriman</h3>
              {[["Nama Lengkap *", "name", "text"], ["Email *", "email", "email"], ["No. WhatsApp *", "phone", "tel"], ["Alamat Lengkap *", "address", "text"], ["Kota", "city", "text"], ["Kode Pos", "zip", "text"]].map(([lbl, key, type]) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 13, color: "#8A7A60", marginBottom: 5 }}>{lbl}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "10px 14px", color: "#F5E6C8", fontFamily: "sans-serif", fontSize: 14, outline: "none" }}/>
                </div>
              ))}

              <div style={{ marginTop: 20 }}>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 14, color: "#8A7A60", marginBottom: 12 }}>Metode Pembayaran</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[["qris", "QRIS", "📱"], ["transfer", "Transfer Bank", "🏦"], ["va", "Virtual Account", "💳"], ["cod", "COD", "🤝"]].map(([val, lbl, ic]) => (
                    <label key={val} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: payMethod === val ? "rgba(139,195,74,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${payMethod === val ? "rgba(139,195,74,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: 10, cursor: "pointer" }}>
                      <input type="radio" name="pay" value={val} checked={payMethod === val} onChange={() => setPayMethod(val)} style={{ accentColor: "#8BC34A" }}/>
                      <span style={{ fontSize: 16 }}>{ic}</span>
                      <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#C8B99A" }}>{lbl}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ alignSelf: "start" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                <h4 style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8", margin: "0 0 16px" }}>Ringkasan</h4>
                {cart.map(i => <div key={i.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#8A7A60" }}>{i.name} ×{i.qty}</span>
                  <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#C8B99A" }}>{formatRupiah(i.price * i.qty)}</span>
                </div>)}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14, marginTop: 8, display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8" }}>Total</span>
                  <span style={{ fontFamily: "'Georgia', serif", color: "#D4A017", fontWeight: 700, fontSize: 18 }}>{formatRupiah(total + shipping)}</span>
                </div>
                <button onClick={handleOrder} style={{ width: "100%", background: "linear-gradient(135deg,#D4A017,#A07810)", border: "none", borderRadius: 12, padding: "13px", color: "white", fontWeight: 700, fontFamily: "sans-serif", fontSize: 15, cursor: "pointer" }}>
                  💳 Buat Pesanan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================
function AdminPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const mockOrders = [
    { id: "PO-001", customer: "Budi Santoso", product: "Jahe Merah 5kg", status: "waiting_approval", date: "2026-03-15", total: 225000, phone: "0812xxx" },
    { id: "PO-002", customer: "Siti Rahayu", product: "Kopi Arabika 2kg", status: "approved", date: "2026-03-16", total: 240000, phone: "0813xxx" },
    { id: "PO-003", customer: "Andi Pratama", product: "Gula Aren 3kg", status: "waiting_approval", date: "2026-03-17", total: 84000, phone: "0814xxx" },
    { id: "PO-004", customer: "Dewi Lestari", product: "Kopi Robusta 1kg", status: "rejected", date: "2026-03-14", total: 85000, phone: "0815xxx" },
  ];
  const [orders, setOrders] = useState(mockOrders);
  const [products, setProducts] = useState(PRODUCTS);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", pass: "" });

  const statusColors = {
    waiting_approval: { bg: "rgba(234,179,8,0.15)", text: "#FACC15", label: "Menunggu" },
    approved: { bg: "rgba(34,197,94,0.15)", text: "#4ADE80", label: "Disetujui" },
    rejected: { bg: "rgba(239,68,68,0.15)", text: "#F87171", label: "Ditolak" },
    completed: { bg: "rgba(99,102,241,0.15)", text: "#818CF8", label: "Selesai" },
  };

  if (!isLoggedIn) return (
    <div style={{ minHeight: "100vh", background: "#0A0602", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#12100A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 40, maxWidth: 400, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <LogoPlaceholder size={52}/>
          <h2 style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8", marginTop: 16, marginBottom: 4 }}>Admin Login</h2>
          <p style={{ color: "#6B7280", fontFamily: "sans-serif", fontSize: 14 }}>Rempah Jawa Dashboard</p>
        </div>
        {[["Email", "email", "email"], ["Password", "pass", "password"]].map(([lbl, key, type]) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 13, color: "#8A7A60", marginBottom: 5 }}>{lbl}</label>
            <input type={type} value={loginForm[key]} onChange={e => setLoginForm(p => ({ ...p, [key]: e.target.value }))}
              style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "10px 14px", color: "#F5E6C8", fontFamily: "sans-serif", fontSize: 14, outline: "none" }}/>
          </div>
        ))}
        <button onClick={() => setIsLoggedIn(true)} style={{ width: "100%", background: "linear-gradient(135deg,#8BC34A,#5D9E21)", border: "none", borderRadius: 12, padding: "13px", color: "white", fontWeight: 700, fontFamily: "sans-serif", cursor: "pointer", marginTop: 8 }}>Masuk</button>
        <p style={{ textAlign: "center", color: "#4B5563", fontFamily: "sans-serif", fontSize: 12, marginTop: 14 }}>Demo: gunakan email & password apapun</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080604", paddingTop: 68 }}>
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <div style={{ width: 220, minHeight: "calc(100vh - 68px)", background: "#0E0C08", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "24px 0", position: "sticky", top: 68, flexShrink: 0 }}>
          <div style={{ padding: "0 16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#4B5563", letterSpacing: 1, marginBottom: 4 }}>LOGGED IN AS</div>
            <div style={{ fontFamily: "sans-serif", fontSize: 14, color: "#8BC34A", fontWeight: 600 }}>hello.rempahjawa@gmail.com</div>
          </div>
          {[["orders", "📋", "Pre-Orders"], ["products", "📦", "Produk"], ["analytics", "📊", "Analitik"]].map(([tab, ic, lbl]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 20px",
              background: activeTab === tab ? "rgba(139,195,74,0.12)" : "none",
              borderLeft: activeTab === tab ? "3px solid #8BC34A" : "3px solid transparent",
              border: "none", borderRight: "none", cursor: "pointer",
              color: activeTab === tab ? "#8BC34A" : "#6B7280", fontFamily: "sans-serif", fontSize: 14, fontWeight: 500, textAlign: "left",
            }}>{ic} {lbl}</button>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: 32, overflowX: "auto" }}>
          {activeTab === "orders" && (
            <>
              <h2 style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8", margin: "0 0 8px" }}>Manajemen Pre-Order</h2>
              <p style={{ color: "#6B7280", fontFamily: "sans-serif", marginBottom: 28 }}>Approve atau reject pre-order dari pelanggan</p>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
                {[
                  ["Menunggu", orders.filter(o => o.status === "waiting_approval").length, "#FACC15", "⏳"],
                  ["Disetujui", orders.filter(o => o.status === "approved").length, "#4ADE80", "✅"],
                  ["Ditolak", orders.filter(o => o.status === "rejected").length, "#F87171", "❌"],
                  ["Total", orders.length, "#818CF8", "📊"],
                ].map(([lbl, val, color, ic]) => (
                  <div key={lbl} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px" }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{ic}</div>
                    <div style={{ fontFamily: "'Georgia', serif", fontSize: 28, fontWeight: 700, color }}>{val}</div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6B7280", marginTop: 2 }}>{lbl}</div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                    <thead>
                      <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                        {["ID", "Pelanggan", "Produk", "Total", "Tanggal", "Status", "Aksi"].map(h => (
                          <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontFamily: "sans-serif", fontSize: 12, color: "#6B7280", fontWeight: 600, letterSpacing: 0.5 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "14px 16px", fontFamily: "sans-serif", fontSize: 13, color: "#D4A017" }}>{o.id}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ fontFamily: "sans-serif", fontSize: 14, color: "#F5E6C8" }}>{o.customer}</div>
                            <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6B7280" }}>{o.phone}</div>
                          </td>
                          <td style={{ padding: "14px 16px", fontFamily: "sans-serif", fontSize: 13, color: "#C8B99A" }}>{o.product}</td>
                          <td style={{ padding: "14px 16px", fontFamily: "'Georgia', serif", fontSize: 14, color: "#8BC34A" }}>{formatRupiah(o.total)}</td>
                          <td style={{ padding: "14px 16px", fontFamily: "sans-serif", fontSize: 13, color: "#6B7280" }}>{o.date}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ background: statusColors[o.status].bg, color: statusColors[o.status].text, borderRadius: 6, padding: "4px 10px", fontSize: 12, fontFamily: "sans-serif", fontWeight: 600 }}>
                              {statusColors[o.status].label}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            {o.status === "waiting_approval" && (
                              <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: "approved" } : x))}
                                  style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ADE80", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12 }}>✓ Approve</button>
                                <button onClick={() => setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: "rejected" } : x))}
                                  style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#F87171", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12 }}>✗ Reject</button>
                              </div>
                            )}
                            {o.status === "approved" && (
                              <a href={`https://wa.me/${o.phone}?text=Pre-order Anda telah disetujui!`} target="_blank" rel="noreferrer"
                                style={{ background: "#25D366", border: "none", color: "white", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12, textDecoration: "none" }}>💬 WA</a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "products" && (
            <>
              <h2 style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8", margin: "0 0 24px" }}>Manajemen Produk</h2>
              <div style={{ display: "grid", gap: 12 }}>
                {products.map(p => (
                  <div key={p.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <ProductPlaceholder product={p} size={52}/>
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <div style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8", fontSize: 16 }}>{p.name}</div>
                      <div style={{ fontFamily: "sans-serif", color: "#6B7280", fontSize: 13 }}>{formatRupiah(p.price)}/{p.unit} · Stok: {p.stock}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#8A7A60" }}>Tersedia:</span>
                      <button onClick={() => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, available: !x.available } : x))}
                        style={{ width: 44, height: 24, borderRadius: 12, background: p.available ? "#8BC34A" : "#374151", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                        <span style={{ position: "absolute", top: 3, left: p.available ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.2s", display: "block" }}/>
                      </button>
                      <span style={{ fontFamily: "sans-serif", fontSize: 13, color: p.available ? "#4ADE80" : "#F87171" }}>{p.available ? "Ya" : "Tidak"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "analytics" && (
            <>
              <h2 style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8", margin: "0 0 24px" }}>Analitik & Laporan</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 32 }}>
                {[["Total Revenue", "Rp 2.4jt", "+18%", "#D4A017"], ["Orders Bulan Ini", "12", "+5", "#8BC34A"], ["Pre-Order Pending", "3", "Perlu aksi", "#FACC15"], ["Produk Aktif", "6/6", "Semua aktif", "#818CF8"]].map(([lbl, val, sub, color]) => (
                  <div key={lbl} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                    <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6B7280", marginBottom: 10 }}>{lbl}</div>
                    <div style={{ fontFamily: "'Georgia', serif", fontSize: 30, fontWeight: 700, color, marginBottom: 4 }}>{val}</div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#4B5563" }}>{sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 28, textAlign: "center" }}>
                <div style={{ color: "#6B7280", fontFamily: "sans-serif", fontSize: 14, marginBottom: 8 }}>📊 Grafik penjualan akan muncul di sini setelah koneksi ke Supabase</div>
                <div style={{ color: "#4B5563", fontFamily: "sans-serif", fontSize: 13 }}>Lihat panduan setup di bawah</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ABOUT PAGE
// ============================================================
function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0602", paddingTop: 88, paddingBottom: 80 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 40, color: "#F5E6C8", margin: "0 0 16px" }}>Tentang <span style={{ color: "#8BC34A" }}>Rempah Jawa</span></h2>
          <p style={{ fontFamily: "sans-serif", color: "#7A6A50", fontSize: 17, maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
            Kami hadir sebagai jembatan antara petani lokal terpercaya dengan konsumen yang menginginkan produk hasil bumi berkualitas tinggi, alami, dan jujur.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, marginBottom: 60 }}>
          {[
            ["🌱", "Organik & Alami", "Semua produk kami bebas dari bahan kimia berbahaya. Ditanam dan diproses secara alami oleh petani berpengalaman."],
            ["🤝", "Langsung dari Petani", "Kami bermitra langsung dengan petani lokal, memastikan kesejahteraan mereka dan kualitas produk terjaga dari sumber."],
            ["📦", "Dikemas Higienis", "Setiap produk dikemas dengan standar higienitas tinggi untuk menjaga kualitas dan keamanan pangan."],
          ].map(([ic, title, desc]) => (
            <div key={title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 28 }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{ic}</div>
              <h3 style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8", margin: "0 0 10px", fontSize: 18 }}>{title}</h3>
              <p style={{ fontFamily: "sans-serif", color: "#7A6A50", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "linear-gradient(135deg, rgba(139,195,74,0.08), rgba(212,160,23,0.06))", border: "1px solid rgba(139,195,74,0.15)", borderRadius: 20, padding: 40, textAlign: "center" }}>
          <h3 style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8", fontSize: 24, marginBottom: 12 }}>Visi Kami</h3>
          <p style={{ fontFamily: "sans-serif", color: "#8A7A60", fontSize: 16, lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
            Menjadi platform terpercaya yang menghubungkan petani hasil bumi Indonesia dengan konsumen di seluruh nusantara, mendorong pertanian berkelanjutan dan gaya hidup sehat.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CONTACT PAGE
// ============================================================
function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  return (
    <div style={{ minHeight: "100vh", background: "#0A0602", paddingTop: 88, paddingBottom: 80 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 40, color: "#F5E6C8", margin: "0 0 12px" }}>Hubungi Kami</h2>
          <p style={{ fontFamily: "sans-serif", color: "#7A6A50", fontSize: 16, lineHeight: 1.7 }}>Ada pertanyaan? Kami siap membantu Anda.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, flexWrap: "wrap" }}>
          <div>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(139,195,74,0.08)", border: "1px solid rgba(139,195,74,0.2)", borderRadius: 16 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <h3 style={{ fontFamily: "'Georgia', serif", color: "#F5E6C8" }}>Pesan Terkirim!</h3>
                <p style={{ color: "#7A6A50", fontFamily: "sans-serif" }}>Kami akan membalas dalam 1×24 jam</p>
              </div>
            ) : (
              <>
                {[["Nama", "name", "text"], ["Email", "email", "email"]].map(([lbl, key, type]) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 13, color: "#8A7A60", marginBottom: 5 }}>{lbl}</label>
                    <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "10px 14px", color: "#F5E6C8", fontFamily: "sans-serif", fontSize: 14, outline: "none" }}/>
                  </div>
                ))}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 13, color: "#8A7A60", marginBottom: 5 }}>Pesan</label>
                  <textarea rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "10px 14px", color: "#F5E6C8", fontFamily: "sans-serif", fontSize: 14, outline: "none", resize: "vertical" }}/>
                </div>
                <button onClick={async () => { if (!form.name || !form.email || !form.message) { alert("Mohon isi semua field"); return; } try { const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); if (res.ok) setSent(true); else alert("Gagal kirim pesan, coba lagi"); } catch { alert("Gagal kirim pesan, coba lagi"); } }} style={{ width: "100%", background: "linear-gradient(135deg,#8BC34A,#5D9E21)", border: "none", borderRadius: 12, padding: "13px", color: "white", fontWeight: 700, fontFamily: "sans-serif", cursor: "pointer" }}>Kirim Pesan</button>
              </>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["📍", "Lokasi", "Jl. Ciledug Barat RT/RW 002/003\nTangerang Banten 15418"],
              ["📞", "Telepon / WhatsApp", "+62 812-xxxx-xxxx"],
              ["📧", "Email", "hello.rempahjawa@gmail.com"],
              ["🕐", "Jam Operasional", "Senin–Sabtu\n08.00–17.00 WIB"],
            ].map(([ic, lbl, val]) => (
              <div key={lbl} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 24 }}>{ic}</span>
                <div>
                  <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6B7280", marginBottom: 4 }}>{lbl}</div>
                  <div style={{ fontFamily: "sans-serif", color: "#C8B99A", fontSize: 14, whiteSpace: "pre-line" }}>{val}</div>
                </div>
              </div>
            ))}
            <a href="https://wa.me/62812xxxxxxxx?text=Halo Rempah Jawa, saya ingin bertanya..." target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#25D366", borderRadius: 14, padding: "15px", color: "white", fontWeight: 700, fontFamily: "sans-serif", textDecoration: "none", fontSize: 15 }}>
              💬 Chat via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer({ setPage }) {
  return (
    <footer style={{ background: "#06040200", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "48px 24px 28px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <LogoPlaceholder size={32}/>
              <span style={{ fontFamily: "'Georgia', serif", fontSize: 18, color: "#F5E6C8" }}>Rempah Jawa</span>
            </div>
            <p style={{ fontFamily: "sans-serif", color: "#5A4A3A", fontSize: 13, lineHeight: 1.7 }}>Produk hasil bumi organik pilihan, langsung dari petani lokal terpercaya.</p>
          </div>
          <div>
            <h4 style={{ fontFamily: "sans-serif", color: "#F5E6C8", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Navigasi</h4>
            {[["home","Beranda"], ["produk","Produk"], ["tentang","Tentang"], ["kontak","Kontak"]].map(([p, lbl]) => (
              <button key={p} onClick={() => setPage(p)} style={{ display: "block", background: "none", border: "none", color: "#5A4A3A", fontFamily: "sans-serif", fontSize: 13, padding: "4px 0", cursor: "pointer" }}>{lbl}</button>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "sans-serif", color: "#F5E6C8", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Produk</h4>
            {PRODUCTS.map(p => (
              <div key={p.id} style={{ fontFamily: "sans-serif", color: "#5A4A3A", fontSize: 13, padding: "4px 0" }}>{p.name}</div>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "sans-serif", color: "#F5E6C8", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Kontak</h4>
            <div style={{ fontFamily: "sans-serif", color: "#5A4A3A", fontSize: 13, lineHeight: 2 }}>
              📞 +62 812-xxxx-xxxx<br/>
              📧 hello.rempahjawa@gmail.com<br/>
              📍 Tangerang Banten
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20, textAlign: "center", fontFamily: "sans-serif", fontSize: 12, color: "#3A2A1A" }}>
          © 2026 Rempah Jawa. Semua hak dilindungi. Ditenagai oleh Xendit & Supabase.
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [preOrderProduct, setPreOrderProduct] = useState(null);

  const addCart = (product) => {
    setCart(c => {
      const existing = c.find(i => i.id === product.id);
      return existing ? c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...product, qty: 1 }];
    });
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  if (page === "checkout") return (
    <>
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} page={page} setPage={setPage}/>
      <CheckoutPage cart={cart} onBack={() => setPage("produk")} onSuccess={() => { setCart([]); setPage("home"); }}/>
    </>
  );

  if (page === "admin") return (
    <>
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} page={page} setPage={setPage}/>
      <AdminPage/>
    </>
  );

  return (
    <div style={{ background: "#0A0602", minHeight: "100vh" }}>
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} page={page} setPage={setPage}/>

      {page === "home" && <><HeroSection setPage={setPage}/><Footer setPage={setPage}/></>}
      {page === "produk" && <><ProductPage onAddCart={addCart} onPreOrder={setPreOrderProduct} onDetail={setDetailProduct}/><Footer setPage={setPage}/></>}
      {page === "tentang" && <><AboutPage/><Footer setPage={setPage}/></>}
      {page === "kontak" && <><ContactPage/><Footer setPage={setPage}/></>}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart} onCheckout={() => { setCartOpen(false); setPage("checkout"); }}/>
      <ProductDetailModal product={detailProduct} onClose={() => setDetailProduct(null)} onAddCart={addCart} onPreOrder={setPreOrderProduct}/>
      <PreOrderModal product={preOrderProduct} onClose={() => setPreOrderProduct(null)} onSubmit={() => {}}/>

      {/* Floating WA button */}
      <a href="https://wa.me/62812xxxxxxxx" target="_blank" rel="noreferrer"
        style={{ position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, textDecoration: "none", boxShadow: "0 8px 24px rgba(37,211,102,0.4)", zIndex: 90 }}>
        💬
      </a>
    </div>
  );
}
