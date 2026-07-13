import { useState, useMemo } from "react";

// ─── 초기 상품 데이터 ───────────────────────────────────────────
// 사진을 넣으려면 상품에 img 항목을 추가하세요. 예: img: "/coat.jpg" (public 폴더의 사진)
// 또는 img: "https://..." (인터넷 이미지 주소). img가 없으면 색상 그라데이션이 표시됩니다.
const INITIAL_PRODUCTS = [
  { id: 1,  name: "울 발마칸 코트",     en: "Wool Balmacaan Coat",  price: 289000, cat: "아우터",  temp: [-10, 8],  c1: "#3b3a44", c2: "#5a5866", desc: "묵직한 이탈리아산 울 원단. 무릎까지 떨어지는 클래식 실루엣.", soldOut: false, img: "/IMG_7171" },
  { id: 2,  name: "구스다운 푸퍼",       en: "Goose Down Puffer",    price: 245000, cat: "아우터",  temp: [-15, 4],  c1: "#1e2b23", c2: "#37503f", desc: "충전량 90/10 구스다운. 영하의 서울 출퇴근을 위한 방한 아우터.", soldOut: false },
  { id: 3,  name: "코듀로이 트러커 자켓", en: "Corduroy Trucker",     price: 128000, cat: "아우터",  temp: [6, 16],   c1: "#7a5c3e", c2: "#9c7a54", desc: "8웰 코듀로이, 워싱 가공으로 처음부터 길이 든 촉감.", soldOut: false },
  { id: 4,  name: "리넨 오픈칼라 셔츠",   en: "Linen Open Collar",    price: 79000,  cat: "상의",    temp: [22, 38],  c1: "#d8d2c2", c2: "#c2b89e", desc: "프렌치 리넨 100%. 한여름에도 바람이 지나가는 오버핏.", soldOut: false },
  { id: 5,  name: "헤비 코튼 후디",       en: "Heavy Cotton Hoodie",  price: 89000,  cat: "상의",    temp: [4, 15],   c1: "#8a8d93", c2: "#a7aab0", desc: "450gsm 기모 없는 헤비 코튼. 세 계절을 책임지는 무게감.", soldOut: false },
  { id: 6,  name: "메리노 터틀넥",        en: "Merino Turtleneck",    price: 98000,  cat: "상의",    temp: [-8, 10],  c1: "#5b3030", c2: "#7c4646", desc: "엑스트라파인 메리노 울. 얇지만 따뜻하게.", soldOut: false },
  { id: 7,  name: "수피마 코튼 티셔츠",   en: "Supima Tee",           price: 32000,  cat: "상의",    temp: [18, 36],  c1: "#e9e6dd", c2: "#d6d2c6", desc: "수피마 코튼의 광택과 탄탄함. 세 장씩 사게 되는 기본 티.", soldOut: false },
  { id: 8,  name: "와이드 치노 팬츠",     en: "Wide Chino",           price: 84000,  cat: "하의",    temp: [8, 26],   c1: "#a89878", c2: "#c0b294", desc: "허리부터 밑단까지 곧게 떨어지는 와이드 스트레이트 핏.", soldOut: false },
  { id: 9,  name: "울 플리츠 트라우저",   en: "Wool Pleated Trouser", price: 132000, cat: "하의",    temp: [-5, 14],  c1: "#2f3138", c2: "#484b55", desc: "투 플리츠 울 트라우저. 스니커즈에도 로퍼에도 어울리는 기장.", soldOut: false },
  { id: 10, name: "나일론 이지 쇼츠",     en: "Nylon Easy Shorts",    price: 54000,  cat: "하의",    temp: [24, 40],  c1: "#41525f", c2: "#5b7080", desc: "속건 나일론, 지퍼 포켓. 도심과 휴가지 어디서든.", soldOut: false },
  { id: 11, name: "레더 미니 크로스백",   en: "Leather Mini Cross",   price: 118000, cat: "액세서리", temp: [-20, 40], c1: "#241f1b", c2: "#3d342c", desc: "이탈리안 베지터블 태닝 레더. 쓸수록 색이 깊어집니다.", soldOut: false },
  { id: 12, name: "캐시미어 비니",        en: "Cashmere Beanie",      price: 62000,  cat: "액세서리", temp: [-15, 8],  c1: "#6b6456", c2: "#87806f", desc: "몽골산 캐시미어 100%. 귀까지 덮는 넉넉한 폭.", soldOut: false },
];

const CATS = ["전체", "아우터", "상의", "하의", "액세서리"];
const PRODUCT_CATS = ["아우터", "상의", "하의", "액세서리"];
const SIZES = ["S", "M", "L", "XL"];
const ORDER_STATUS = ["결제완료", "배송중", "배송완료"];
const ADMIN_PASSWORD = "imzzang1234"; // 데모용 비밀번호

const won = (n) => Number(n).toLocaleString("ko-KR") + "원";

function accentFor(temp) {
  const t = Math.max(-15, Math.min(35, temp));
  const ratio = (t + 15) / 50;
  const hue = 210 - ratio * 192;
  const sat = 42 + ratio * 26;
  return {
    main: `hsl(${hue}, ${sat}%, 38%)`,
    soft: `hsl(${hue}, ${sat}%, 94%)`,
    line: `hsl(${hue}, ${sat}%, 78%)`,
  };
}

const tempLabel = (t) =>
  t <= -5 ? "한파주의보" : t <= 5 ? "코트의 계절" : t <= 14 ? "레이어드하기 좋은" :
  t <= 23 ? "가장 옷 입기 좋은" : t <= 30 ? "여름의 문턱" : "한여름";

const EMPTY_FORM = { name: "", en: "", price: "", cat: "상의", tempMin: 10, tempMax: 25, c1: "#5a5866", c2: "#8a8d93", desc: "", soldOut: false, img: "" };

export default function ImzzangStore() {
  // 쇼핑 상태
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [temp, setTemp] = useState(22);
  const [cat, setCat] = useState("전체");
  const [curate, setCurate] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [size, setSize] = useState("M");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);

  // 관리자 상태
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminView, setAdminView] = useState(false);
  const [adminTab, setAdminTab] = useState("상품");
  const [loginOpen, setLoginOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const A = accentFor(temp);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const catOk = cat === "전체" || p.cat === cat;
      const tempOk = !curate || (temp >= p.temp[0] && temp <= p.temp[1]);
      const qOk = !q || p.name.toLowerCase().includes(q) || p.en.toLowerCase().includes(q) || p.cat.includes(q);
      return catOk && tempOk && qOk;
    });
  }, [products, cat, temp, curate, query]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const addToCart = (product, sz) => {
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === product.id && i.size === sz);
      if (found) return prev.map((i) => (i === found ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { product, size: sz, qty: 1 }];
    });
    setSelected(null);
    setCartOpen(true);
  };

  const changeQty = (idx, d) =>
    setCart((prev) => prev.map((i, n) => (n === idx ? { ...i, qty: i.qty + d } : i)).filter((i) => i.qty > 0));

  const placeOrder = () => {
    const shipping = cartTotal >= 100000 ? 0 : 3000;
    setOrders((prev) => [
      {
        id: "ORD-" + String(prev.length + 1).padStart(4, "0"),
        items: cart.map((i) => ({ name: i.product.name, size: i.size, qty: i.qty, price: i.product.price })),
        total: cartTotal + shipping,
        status: "결제완료",
        time: new Date().toLocaleString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      },
      ...prev,
    ]);
    setCart([]);
    setOrdered(true);
  };

  // ─── 관리자 액션 ───
  const tryLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      setIsAdmin(true); setAdminView(true); setLoginOpen(false); setPw(""); setPwError(false);
    } else setPwError(true);
  };

  const saveProduct = () => {
    if (!form.name.trim() || !form.price) return;
    const data = {
      name: form.name.trim(), en: form.en.trim() || form.name.trim(),
      price: Number(form.price), cat: form.cat,
      temp: [Number(form.tempMin), Number(form.tempMax)],
      c1: form.c1, c2: form.c2, desc: form.desc.trim() || "설명이 아직 없습니다.",
      soldOut: form.soldOut, img: form.img.trim(),
    };
    if (editingId) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...data } : p)));
    } else {
      setProducts((prev) => [{ id: Date.now(), ...data }, ...prev]);
    }
    setForm(EMPTY_FORM); setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, en: p.en, price: p.price, cat: p.cat, tempMin: p.temp[0], tempMax: p.temp[1], c1: p.c1, c2: p.c2, desc: p.desc, soldOut: p.soldOut, img: p.img || "" });
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) { setEditingId(null); setForm(EMPTY_FORM); }
  };

  const toggleSoldOut = (id) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, soldOut: !p.soldOut } : p)));

  const setOrderStatus = (id, status) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #d4d1c8", background: "#fff", fontSize: 14, fontFamily: "inherit" };
  const labelStyle = { fontSize: 12, fontWeight: 700, color: "#57544b", display: "block", marginBottom: 6 };

  return (
    <div style={{ minHeight: "100vh", background: "#F4F3EF", color: "#171715", fontFamily: "'Apple SD Gothic Neo','Pretendard','Noto Sans KR',system-ui,sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; }
        button { cursor: pointer; font-family: inherit; }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 2px; background: #c9c6bd; border-radius: 2px; outline: none; width: 100%; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: ${A.main}; border: 3px solid #F4F3EF; box-shadow: 0 0 0 1.5px ${A.main}; transition: background .3s; }
        .card { transition: transform .25s ease, box-shadow .25s ease; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(23,23,21,.10); }
        .fadeup { animation: fadeup .4s ease both; }
        @keyframes fadeup { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .card, .fadeup { transition: none; animation: none; } }
      `}</style>

      {/* ─── 헤더 ─── */}
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(244,243,239,.92)", backdropFilter: "blur(8px)", borderBottom: "1px solid #dedbd2" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <button onClick={() => setAdminView(false)} style={{ background: "none", border: "none", display: "flex", alignItems: "baseline", gap: 10, padding: 0 }}>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.5px" }}>임짱</span>
            <span style={{ fontSize: 11, letterSpacing: "3px", color: "#8a877d" }}>IMZZANG SEOUL</span>
          </button>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {isAdmin && (
              <button onClick={() => setAdminView(!adminView)}
                style={{ background: adminView ? "#171715" : "none", color: adminView ? "#fff" : "#171715", border: "1px solid #171715", borderRadius: 999, padding: "7px 16px", fontSize: 13, fontWeight: 600 }}>
                {adminView ? "쇼핑몰 보기" : "관리자 페이지"}
              </button>
            )}
            <button onClick={() => setCartOpen(true)} style={{ background: "none", border: "1px solid #171715", borderRadius: 999, padding: "7px 16px", fontSize: 13, fontWeight: 600, display: "flex", gap: 8, alignItems: "center" }}>
              장바구니
              <span style={{ background: A.main, color: "#fff", borderRadius: 999, fontSize: 11, minWidth: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "background .3s" }}>{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      {adminView && isAdmin ? (
        /* ═══════════════ 관리자 페이지 ═══════════════ */
        <main style={{ maxWidth: 1080, margin: "0 auto", padding: "36px 20px 80px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.5px" }}>관리자 페이지</h1>
          <p style={{ fontSize: 13, color: "#8a877d", margin: "6px 0 24px" }}>상품과 주문을 관리합니다. 데모라서 새로고침하면 초기화돼요.</p>

          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {["상품", "주문"].map((t) => (
              <button key={t} onClick={() => setAdminTab(t)}
                style={{ padding: "9px 22px", borderRadius: 999, fontSize: 14, fontWeight: 700, border: `1px solid ${adminTab === t ? "#171715" : "#d4d1c8"}`, background: adminTab === t ? "#171715" : "transparent", color: adminTab === t ? "#fff" : "#57544b" }}>
                {t} 관리 {t === "주문" && orders.length > 0 && `(${orders.length})`}
              </button>
            ))}
          </div>

          {adminTab === "상품" ? (
            <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 380px) 1fr", gap: 28, alignItems: "start" }}>
              {/* 상품 등록/수정 폼 */}
              <section style={{ background: "#fff", borderRadius: 8, border: "1px solid #e3e0d7", padding: 22 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>{editingId ? "상품 수정" : "새 상품 등록"}</h2>
                <div style={{ display: "grid", gap: 14 }}>
                  <div><label style={labelStyle}>상품명 *</label><input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="예: 캐시미어 니트" /></div>
                  <div><label style={labelStyle}>영문명</label><input style={inputStyle} value={form.en} onChange={(e) => setForm({ ...form, en: e.target.value })} placeholder="Cashmere Knit" /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div><label style={labelStyle}>가격(원) *</label><input style={inputStyle} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="89000" /></div>
                    <div><label style={labelStyle}>카테고리</label>
                      <select style={inputStyle} value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
                        {PRODUCT_CATS.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div><label style={labelStyle}>권장 기온 최저</label><input style={inputStyle} type="number" value={form.tempMin} onChange={(e) => setForm({ ...form, tempMin: e.target.value })} /></div>
                    <div><label style={labelStyle}>최고</label><input style={inputStyle} type="number" value={form.tempMax} onChange={(e) => setForm({ ...form, tempMax: e.target.value })} /></div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div><label style={labelStyle}>대표 색상 1</label><input style={{ ...inputStyle, height: 42, padding: 4 }} type="color" value={form.c1} onChange={(e) => setForm({ ...form, c1: e.target.value })} /></div>
                    <div><label style={labelStyle}>대표 색상 2</label><input style={{ ...inputStyle, height: 42, padding: 4 }} type="color" value={form.c2} onChange={(e) => setForm({ ...form, c2: e.target.value })} /></div>
                  </div>
                  <div><label style={labelStyle}>사진 주소 (선택)</label><input style={inputStyle} value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} placeholder="/coat.jpg 또는 https://..." /></div>
                  <div><label style={labelStyle}>상품 설명</label><textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></div>
                  <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, cursor: "pointer" }}>
                    <input type="checkbox" checked={form.soldOut} onChange={(e) => setForm({ ...form, soldOut: e.target.checked })} style={{ accentColor: "#171715" }} /> 품절 처리
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={saveProduct} style={{ flex: 1, padding: "12px 0", borderRadius: 6, border: "none", background: "#171715", color: "#fff", fontSize: 14, fontWeight: 700 }}>
                      {editingId ? "수정 저장" : "상품 등록"}
                    </button>
                    {editingId && (
                      <button onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }} style={{ padding: "12px 16px", borderRadius: 6, border: "1px solid #d4d1c8", background: "none", fontSize: 13 }}>취소</button>
                    )}
                  </div>
                </div>
              </section>

              {/* 상품 목록 */}
              <section>
                <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>전체 상품 {products.length}개</h2>
                <div style={{ display: "grid", gap: 10 }}>
                  {products.map((p) => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "1px solid #e3e0d7", borderRadius: 8, padding: "12px 14px", opacity: p.soldOut ? 0.55 : 1 }}>
                      <div style={{ width: 44, height: 56, borderRadius: 4, background: `linear-gradient(160deg, ${p.c1}, ${p.c2})`, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                        {p.img && <img src={p.img} alt={p.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700 }}>{p.name} {p.soldOut && <span style={{ fontSize: 11, color: "#b0342b", fontWeight: 700 }}>품절</span>}</p>
                        <p style={{ fontSize: 12, color: "#8a877d" }}>{p.cat} · {won(p.price)} · {p.temp[0]}°~{p.temp[1]}°</p>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button onClick={() => toggleSoldOut(p.id)} style={{ padding: "7px 12px", borderRadius: 6, border: "1px solid #d4d1c8", background: "none", fontSize: 12 }}>{p.soldOut ? "판매 재개" : "품절"}</button>
                        <button onClick={() => startEdit(p)} style={{ padding: "7px 12px", borderRadius: 6, border: "1px solid #d4d1c8", background: "none", fontSize: 12 }}>수정</button>
                        <button onClick={() => deleteProduct(p.id)} style={{ padding: "7px 12px", borderRadius: 6, border: "1px solid #e0b2ae", background: "none", color: "#b0342b", fontSize: 12 }}>삭제</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            /* 주문 관리 */
            <section>
              {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "70px 0", color: "#8a877d", background: "#fff", borderRadius: 8, border: "1px solid #e3e0d7" }}>
                  <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>아직 주문이 없어요</p>
                  <p style={{ fontSize: 13 }}>쇼핑몰 화면에서 주문하면 여기에 표시됩니다.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {orders.map((o) => (
                    <div key={o.id} style={{ background: "#fff", border: "1px solid #e3e0d7", borderRadius: 8, padding: "16px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                        <div>
                          <span style={{ fontSize: 14, fontWeight: 800 }}>{o.id}</span>
                          <span style={{ fontSize: 12, color: "#8a877d", marginLeft: 10 }}>{o.time}</span>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          {ORDER_STATUS.map((s) => (
                            <button key={s} onClick={() => setOrderStatus(o.id, s)}
                              style={{ padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: `1px solid ${o.status === s ? A.main : "#d4d1c8"}`, background: o.status === s ? A.main : "none", color: o.status === s ? "#fff" : "#8a877d" }}>{s}</button>
                          ))}
                        </div>
                      </div>
                      {o.items.map((it, n) => (
                        <p key={n} style={{ fontSize: 13, color: "#57544b", padding: "3px 0" }}>
                          {it.name} / {it.size} × {it.qty} — {won(it.price * it.qty)}
                        </p>
                      ))}
                      <p style={{ fontSize: 14, fontWeight: 800, marginTop: 8, textAlign: "right" }}>총 {won(o.total)}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      ) : (
        /* ═══════════════ 쇼핑몰 화면 ═══════════════ */
        <>
          <section style={{ maxWidth: 1080, margin: "0 auto", padding: "56px 20px 36px" }}>
            <p style={{ fontSize: 12, letterSpacing: "3px", color: A.main, fontWeight: 700, transition: "color .3s" }}>오늘 입을 옷의 기준은 날씨</p>
            <h1 style={{ fontSize: "clamp(34px, 6vw, 58px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.15, margin: "12px 0 6px" }}>
              지금 서울, <span style={{ color: A.main, transition: "color .3s", fontVariantNumeric: "tabular-nums" }}>{temp}°</span>
            </h1>
            <p style={{ color: "#6d6a60", fontSize: 15 }}>{tempLabel(temp)} 날씨에 어울리는 옷을 골라 드립니다.</p>

            <div style={{ marginTop: 28, maxWidth: 560 }}>
              <input type="range" min={-15} max={35} value={temp} onChange={(e) => setTemp(+e.target.value)} aria-label="기온 선택" />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9a978c", marginTop: 8 }}>
                <span>-15° 한겨울</span><span>10° 환절기</span><span>35° 한여름</span>
              </div>
            </div>

            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 18, fontSize: 13, color: "#57544b", cursor: "pointer" }}>
              <input type="checkbox" checked={curate} onChange={(e) => setCurate(e.target.checked)} style={{ accentColor: A.main }} />
              이 기온에 맞는 상품만 보기
            </label>
          </section>

          {/* 검색 + 카테고리 */}
          <nav style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px 24px", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                style={{ padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, border: `1px solid ${cat === c ? A.main : "#d4d1c8"}`, background: cat === c ? A.main : "transparent", color: cat === c ? "#fff" : "#57544b", transition: "all .25s" }}>{c}</button>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="상품 검색"
                style={{ padding: "9px 16px", borderRadius: 999, border: "1px solid #d4d1c8", background: "#fff", fontSize: 13, width: 180, fontFamily: "inherit", outline: "none" }} />
              <span style={{ fontSize: 12, color: "#9a978c", whiteSpace: "nowrap" }}>{items.length}개 상품</span>
            </div>
          </nav>

          {/* 상품 그리드 */}
          <main style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px 80px" }}>
            {items.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#8a877d" }}>
                <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>조건에 맞는 상품이 없어요</p>
                <p style={{ fontSize: 13 }}>검색어를 바꾸거나 기온 큐레이션을 꺼 보세요.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "26px 20px" }}>
                {items.map((p, i) => (
                  <button key={p.id} className="card fadeup" onClick={() => { setSelected(p); setSize("M"); }}
                    style={{ animationDelay: `${i * 40}ms`, background: "none", border: "none", padding: 0, textAlign: "left", borderRadius: 4 }}>
                    <div style={{ aspectRatio: "3/4", borderRadius: 4, background: `linear-gradient(160deg, ${p.c1}, ${p.c2})`, position: "relative", overflow: "hidden", filter: p.soldOut ? "grayscale(.7)" : "none" }}>
                      {p.img && <img src={p.img} alt={p.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />}
                      <span style={{ position: "absolute", top: 12, left: 12, fontSize: 10, letterSpacing: "2px", color: "rgba(255,255,255,.85)", fontWeight: 600 }}>{p.en.toUpperCase()}</span>
                      {p.soldOut && (
                        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(23,23,21,.35)", color: "#fff", fontSize: 15, fontWeight: 800, letterSpacing: "2px" }}>SOLD OUT</span>
                      )}
                      <span style={{ position: "absolute", bottom: 12, right: 12, fontSize: 11, background: "rgba(244,243,239,.9)", borderRadius: 999, padding: "3px 10px", color: "#171715", fontWeight: 600 }}>
                        {p.temp[0]}° ~ {p.temp[1]}°
                      </span>
                    </div>
                    <div style={{ padding: "12px 2px 0" }}>
                      <p style={{ fontSize: 11, color: "#9a978c", letterSpacing: "1px" }}>{p.cat}</p>
                      <p style={{ fontSize: 15, fontWeight: 700, margin: "3px 0 4px" }}>{p.name}</p>
                      <p style={{ fontSize: 14, color: "#57544b" }}>{won(p.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {/* ─── 상품 상세 모달 ─── */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(23,23,21,.45)", zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="fadeup" onClick={(e) => e.stopPropagation()} style={{ background: "#F4F3EF", borderRadius: 8, maxWidth: 720, width: "100%", maxHeight: "90vh", overflow: "auto", display: "grid", gridTemplateColumns: "minmax(200px, 1fr) 1.2fr" }}>
            <div style={{ background: `linear-gradient(160deg, ${selected.c1}, ${selected.c2})`, minHeight: 320, filter: selected.soldOut ? "grayscale(.7)" : "none", position: "relative", overflow: "hidden" }}>
              {selected.img && <img src={selected.img} alt={selected.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />}
            </div>
            <div style={{ padding: "28px 26px" }}>
              <p style={{ fontSize: 11, letterSpacing: "2px", color: "#9a978c" }}>{selected.cat} · {selected.en.toUpperCase()}</p>
              <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.5px", margin: "8px 0 6px" }}>{selected.name}</h2>
              <p style={{ fontSize: 19, fontWeight: 700, color: A.main, transition: "color .3s" }}>{won(selected.price)}</p>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#57544b", margin: "16px 0" }}>{selected.desc}</p>
              <p style={{ fontSize: 12, background: A.soft, border: `1px solid ${A.line}`, borderRadius: 6, padding: "8px 12px", color: "#3d3b34", transition: "all .3s" }}>
                권장 기온 {selected.temp[0]}° ~ {selected.temp[1]}° {temp >= selected.temp[0] && temp <= selected.temp[1] ? "— 지금 날씨에 딱이에요" : "— 지금 기온과는 조금 달라요"}
              </p>

              <p style={{ fontSize: 12, fontWeight: 700, margin: "20px 0 8px", letterSpacing: "1px" }}>사이즈</p>
              <div style={{ display: "flex", gap: 8 }}>
                {SIZES.map((s) => (
                  <button key={s} onClick={() => setSize(s)} disabled={selected.soldOut}
                    style={{ width: 44, height: 40, borderRadius: 4, fontSize: 13, fontWeight: 600, border: `1.5px solid ${size === s ? "#171715" : "#d4d1c8"}`, background: size === s ? "#171715" : "transparent", color: size === s ? "#fff" : "#57544b", opacity: selected.soldOut ? 0.5 : 1 }}>{s}</button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button onClick={() => addToCart(selected, size)} disabled={selected.soldOut}
                  style={{ flex: 1, padding: "14px 0", borderRadius: 6, border: "none", background: selected.soldOut ? "#b8b5ac" : A.main, color: "#fff", fontSize: 15, fontWeight: 700, transition: "background .3s", cursor: selected.soldOut ? "not-allowed" : "pointer" }}>
                  {selected.soldOut ? "품절된 상품이에요" : "장바구니 담기"}
                </button>
                <button onClick={() => setSelected(null)} style={{ padding: "14px 18px", borderRadius: 6, border: "1px solid #d4d1c8", background: "none", fontSize: 14 }}>닫기</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 장바구니 드로어 ─── */}
      {cartOpen && (
        <div onClick={() => { setCartOpen(false); setOrdered(false); }} style={{ position: "fixed", inset: 0, background: "rgba(23,23,21,.45)", zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
          <aside onClick={(e) => e.stopPropagation()} style={{ width: "min(400px, 100%)", background: "#F4F3EF", height: "100%", padding: "24px 22px", overflow: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 19, fontWeight: 800 }}>장바구니 <span style={{ color: A.main }}>{cartCount}</span></h2>
              <button onClick={() => { setCartOpen(false); setOrdered(false); }} style={{ background: "none", border: "none", fontSize: 22, color: "#57544b" }}>×</button>
            </div>

            {ordered ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <p style={{ fontSize: 32, marginBottom: 12 }}>✓</p>
                <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>주문이 완료됐어요</p>
                <p style={{ fontSize: 13, color: "#8a877d" }}>관리자 페이지의 주문 관리에서 확인할 수 있어요.</p>
              </div>
            ) : cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#8a877d" }}>
                <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>아직 담긴 옷이 없어요</p>
                <p style={{ fontSize: 13 }}>마음에 드는 상품을 눌러 사이즈를 골라 보세요.</p>
              </div>
            ) : (
              <>
                <div style={{ flex: 1 }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: "1px solid #e3e0d7" }}>
                      <div style={{ width: 56, height: 72, borderRadius: 4, background: `linear-gradient(160deg, ${item.product.c1}, ${item.product.c2})`, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                        {item.product.img && <img src={item.product.img} alt={item.product.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 700 }}>{item.product.name}</p>
                        <p style={{ fontSize: 12, color: "#8a877d", margin: "2px 0 8px" }}>사이즈 {item.size} · {won(item.product.price)}</p>
                        <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #d4d1c8", borderRadius: 999 }}>
                          <button onClick={() => changeQty(idx, -1)} style={{ background: "none", border: "none", padding: "4px 12px", fontSize: 15 }}>−</button>
                          <span style={{ fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                          <button onClick={() => changeQty(idx, 1)} style={{ background: "none", border: "none", padding: "4px 12px", fontSize: 15 }}>+</button>
                        </div>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 700 }}>{won(item.product.price * item.qty)}</p>
                    </div>
                  ))}
                </div>
                <div style={{ paddingTop: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#8a877d", marginBottom: 6 }}>
                    <span>배송비</span><span>{cartTotal >= 100000 ? "무료" : won(3000)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 800, marginBottom: 16 }}>
                    <span>총 결제금액</span>
                    <span style={{ color: A.main }}>{won(cartTotal + (cartTotal >= 100000 ? 0 : 3000))}</span>
                  </div>
                  {cartTotal < 100000 && (
                    <p style={{ fontSize: 12, color: "#8a877d", marginBottom: 12 }}>{won(100000 - cartTotal)} 더 담으면 무료배송</p>
                  )}
                  <button onClick={placeOrder}
                    style={{ width: "100%", padding: "15px 0", borderRadius: 6, border: "none", background: "#171715", color: "#fff", fontSize: 15, fontWeight: 700 }}>
                    주문하기
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* ─── 관리자 로그인 모달 ─── */}
      {loginOpen && (
        <div onClick={() => { setLoginOpen(false); setPw(""); setPwError(false); }} style={{ position: "fixed", inset: 0, background: "rgba(23,23,21,.45)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="fadeup" onClick={(e) => e.stopPropagation()} style={{ background: "#F4F3EF", borderRadius: 8, padding: "28px 26px", width: "min(360px, 100%)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>관리자 로그인</h2>
            <p style={{ fontSize: 12, color: "#8a877d", marginBottom: 16 }}>데모 비밀번호: <code style={{ background: "#e8e5dc", padding: "2px 6px", borderRadius: 4 }}>imzzang1234</code></p>
            <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setPwError(false); }}
              onKeyDown={(e) => e.key === "Enter" && tryLogin()}
              placeholder="비밀번호 입력" autoFocus
              style={{ ...inputStyle, borderColor: pwError ? "#b0342b" : "#d4d1c8" }} />
            {pwError && <p style={{ fontSize: 12, color: "#b0342b", marginTop: 6 }}>비밀번호가 맞지 않아요. 다시 확인해 주세요.</p>}
            <button onClick={tryLogin} style={{ width: "100%", marginTop: 14, padding: "12px 0", borderRadius: 6, border: "none", background: "#171715", color: "#fff", fontSize: 14, fontWeight: 700 }}>로그인</button>
          </div>
        </div>
      )}

      {/* ─── 푸터 ─── */}
      <footer style={{ borderTop: "1px solid #dedbd2", padding: "28px 20px", textAlign: "center", fontSize: 12, color: "#9a978c" }}>
        임짱 IMZZANG SEOUL — 날씨가 정하는 옷장 · 데모 스토어
        <button onClick={() => (isAdmin ? setAdminView(true) : setLoginOpen(true))}
          style={{ background: "none", border: "none", color: "#b8b5ac", fontSize: 12, marginLeft: 12, textDecoration: "underline" }}>
          {isAdmin ? "관리자 페이지" : "관리자 로그인"}
        </button>
      </footer>
    </div>
  );
}
