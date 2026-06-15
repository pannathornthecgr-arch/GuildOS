import { useState } from "react";

// City data — positions use % for responsive placement on the map canvas
const CITIES = [
  {
    id: "dev",
    emoji: "🏰",
    name: "เมืองหลวงแห่งปัญญา",
    role: "Dev Team",
    desc: "ศูนย์บัญชาการแห่งโค้ดและปัญญา",
    top: "22%",
    left: "48%",
    accent: "#6c63ff",
    glow: "rgba(108,99,255,0.5)",
  },
  {
    id: "hr",
    emoji: "🕊️",
    name: "หอคอยพฤกษา",
    role: "HR & Admin",
    desc: "ดูแลสวัสดิการและจิตใจนักรบทุกคน",
    top: "12%",
    left: "25%",
    accent: "#34d399",
    glow: "rgba(52,211,153,0.5)",
  },
  {
    id: "video",
    emoji: "🎬",
    name: "โรงหลอมภาพมายา",
    role: "Video Editors",
    desc: "หลอมรวมแสงและเวลาให้เป็นเรื่องราว",
    top: "55%",
    left: "18%",
    accent: "#f59e0b",
    glow: "rgba(245,158,11,0.5)",
  },
  {
    id: "design",
    emoji: "🎨",
    name: "หุบเขาศิลปิน",
    role: "Graphic Designers",
    desc: "ที่ซึ่งความงามถูกสร้างจากความว่างเปล่า",
    top: "68%",
    left: "42%",
    accent: "#f472b6",
    glow: "rgba(244,114,182,0.5)",
  },
  {
    id: "sales",
    emoji: "💰",
    name: "นครการค้า",
    role: "Sales & Marketing",
    desc: "ตลาดแห่งโอกาสและทองคำไหลเวียน",
    top: "40%",
    left: "72%",
    accent: "#fbbf24",
    glow: "rgba(251,191,36,0.5)",
  },
  {
    id: "support",
    emoji: "🛡️",
    name: "ป้อมปราการเหล็ก",
    role: "Support & QA",
    desc: "แนวปราการสุดท้ายก่อนถึงผู้ใช้จริง",
    top: "72%",
    left: "68%",
    accent: "#64748b",
    glow: "rgba(100,116,139,0.5)",
  },
];

// SVG decorative paths connecting cities
const MAP_PATHS = [
  "M 48 22 L 25 12",
  "M 48 22 L 72 40",
  "M 48 22 L 42 68",
  "M 25 12 L 18 55",
  "M 18 55 L 42 68",
  "M 72 40 L 68 72",
  "M 42 68 L 68 72",
];

function CityTooltip({ city }) {
  return (
    <div
      style={{
        width: "100%",
        background: "rgba(22, 18, 16, 0.7)",
        backdropFilter: "blur(8px)",
        borderRadius: "8px",
        border: "1px solid rgba(139, 107, 74, 0.6)",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "-7px",
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          width: "12px",
          height: "12px",
          background: "rgba(22, 18, 16, 0.9)",
          borderRight: `1px solid ${city.accent}55`,
          borderBottom: `1px solid ${city.accent}55`,
        }}
      />
      <p
        style={{
          color: city.accent,
          fontWeight: 700,
          fontSize: "13px",
          marginBottom: "2px",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        {city.emoji} {city.name}
      </p>
      <p
        style={{
          color: "#b49b78",
          fontSize: "11px",
          marginBottom: "4px",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        [{city.role}]
      </p>
      <p
        style={{
          color: "#cbd5e1",
          fontSize: "11px",
          lineHeight: 1.5,
          maxWidth: "200px",
          whiteSpace: "normal",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        {city.desc}
      </p>
    </div>
  );
}

function CityNode({ city, selectedCity, onSelectCity }) {
  const [hovered, setHovered] = useState(false);
  const isSelected = selectedCity === city.name;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (onSelectCity) {
          onSelectCity(isSelected ? null : city.name);
        }
      }}
      style={{
        position: "absolute",
        top: city.top,
        left: city.left,
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        zIndex: (hovered || isSelected) ? 30 : 10,
        transition: "transform 0.2s ease",
      }}
    >
      {(hovered || isSelected) && <CityTooltip city={city} />}

      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: "-6px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${city.glow} 0%, transparent 70%)`,
            opacity: (hovered || isSelected) ? 1 : 0.4,
            transition: "opacity 0.3s ease",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-6px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "44px",
            height: "10px",
            borderRadius: "50%",
            background: `${city.accent}33`,
            filter: "blur(4px)",
          }}
        />

        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "12px",
            background: `linear-gradient(145deg, rgba(26,20,18,0.8) 0%, rgba(10,8,6,0.8) 100%)`,
            border: `1.5px solid ${city.accent}88`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            position: "relative",
            boxShadow: (hovered || isSelected)
              ? `0 0 0 2px ${city.accent}66, 0 8px 24px ${city.glow}, inset 0 1px 0 ${city.accent}44`
              : `0 4px 12px rgba(0,0,0,0.8), inset 0 1px 0 ${city.accent}33`,
            transform: (hovered || isSelected) ? "translateY(-4px) scale(1.08)" : "translateY(0) scale(1)",
            transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "4px",
              left: "4px",
              width: "16px",
              height: "16px",
              borderRadius: "4px 2px 2px 2px",
              background: `linear-gradient(135deg, ${city.accent}33 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />
          {city.emoji}
        </div>
      </div>

      <div
        style={{
          marginTop: "8px",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        <p
          style={{
            color: (hovered || isSelected) ? city.accent : "#d4af37",
            fontSize: "11px",
            fontWeight: 700,
            fontFamily: "'Segoe UI', sans-serif",
            letterSpacing: "0.04em",
            transition: "color 0.2s ease",
            maxWidth: "80px",
            lineHeight: 1.3,
            textShadow: (hovered || isSelected) ? `0 0 8px ${city.accent}` : "0 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          {city.name}
        </p>
      </div>
    </div>
  );
}

export default function WorldMap({ selectedCity, onSelectCity }) {
  return (
    <div 
      style={{
        width: "100%",
        /* 🌟 แก้ไข 1: กล่องนอกสุดเปลี่ยนเป็นสีกระดาษเก่าโปร่งแสง + เบลอ */
        background: "rgba(22, 18, 16, 0.5)",
        backdropFilter: "blur(8px)",
        borderRadius: "8px",
        /* 🌟 แก้ไข 2: กรอบกล่องเปลี่ยนเป็นสีทองแดงสไตล์เกมเก่า */
        border: "1px solid rgba(139, 107, 74, 0.4)",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
      }}
    >
      <div
        style={{
          padding: "16px 20px 12px",
          borderBottom: "1px solid rgba(139, 107, 74, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "linear-gradient(180deg, rgba(22,18,16,0.6) 0%, transparent 100%)",
        }}
      >
        <span style={{ fontSize: "18px" }}>🗺️</span>
        <div>
          <p
            style={{
              /* 🌟 แก้ไข 3: เปลี่ยนสีตัวหนังสือเป็นสีทอง */
              color: "#d4af37",
              fontSize: "15px",
              fontWeight: 700,
              fontFamily: "serif",
              margin: 0,
            }}
          >
            แผนที่โลกแห่งกิลด์
          </p>
          <p
            style={{
              color: "#b49b78",
              fontSize: "11px",
              fontFamily: "'Segoe UI', sans-serif",
              margin: 0,
            }}
          >
            6 อาณาจักร — คลิกเมืองเพื่อดูรายชื่อนักผจญภัย
          </p>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "56%",
          /* 🌟 แก้ไข 4: ลบสีทึบของตัวแผนที่ออก ให้เป็นโปร่งแสงล้วนๆ มองทะลุได้ */
          background: "transparent", 
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <defs>
            <filter id="glow-line">
              <feGaussianBlur stdDeviation="0.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* เงารองใต้แผนที่จางๆ ให้ดูมีมิติ */}
          <ellipse cx="38" cy="42" rx="32" ry="26" fill="rgba(0,0,0,0.3)" opacity="0.7" />
          <ellipse cx="65" cy="55" rx="22" ry="18" fill="rgba(0,0,0,0.2)" opacity="0.5" />

          {MAP_PATHS.map((d, i) => (
            <path
              key={i}
              d={`M ${d.replace("M ", "").replace(" L ", " L ")}`}
              stroke="#8b6b4a"
              strokeWidth="0.8"
              fill="none"
              strokeDasharray="2 2"
              filter="url(#glow-line)"
              opacity="0.5"
            />
          ))}

          {[
            [30, 35], [55, 45], [40, 60], [70, 30], [20, 70], [60, 78],
            [35, 18], [80, 55], [15, 40], [50, 85],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="0.8" fill="#d4af37" opacity="0.6" />
          ))}
        </svg>

        {/* 🗺️ วนลูปโชว์เมืองและส่ง Props ไปให้ */}
        {CITIES.map((city) => (
          <CityNode 
            key={city.id} 
            city={city} 
            selectedCity={selectedCity} 
            onSelectCity={onSelectCity} 
          />
        ))}

        <div
          style={{
            position: "absolute",
            inset: 0,
            /* 🌟 แก้ไข 5: เปลี่ยนเงาขอบจอล่างให้เป็นสีดำกลืนไปกับภาพปราสาท ไม่ใช่สีน้ำเงิน */
            background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.8) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      <div
        style={{
          padding: "12px 20px",
          borderTop: "1px solid rgba(139, 107, 74, 0.3)",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {CITIES.map((city) => (
          <div key={city.id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: city.accent,
                boxShadow: `0 0 4px ${city.accent}`,
                flexShrink: 0,
              }}
            />
            <span style={{ color: "#b49b78", fontSize: "10px", fontFamily: "'Segoe UI', sans-serif", whiteSpace: "nowrap" }}>
              {city.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}