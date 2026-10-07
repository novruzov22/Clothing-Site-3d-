"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

const BASE =
  "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/";

const OPTIONS = [
  { key: "scene", label: "Səhnə", file: 2 },
  { key: "light", label: "İşıqlandırma", file: 3 },
  { key: "colorway", label: "Geyim", file: 1 },
  { key: "fullLook", label: "Kolleksiya", file: 4 },
] as const;

const CLIPS = [
  "video-1.mp4",
  "video-1-reverse.mp4",
  "video-2.mp4",
  "video-2-reverse.mp4",
  "video-3.mp4",
  "video-3-reverse.mp4",
  "video-4.mp4",
  "video-4-reverse.mp4",
];

const PRODUCTS = [
  {
    id: "shirt",
    name: "Rahat kəsimli köynək",
    category: "Pambıq / süd rəngi",
    price: 7900,
    group: "Üst geyim",
    description:
      "Yumşaq pambıqdan hazırlanmış rahat kəsimli köynək. Gündəlik istifadə üçün sadə və təmiz siluet.",
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "knitwear",
    name: "Gündəlik trikotaj",
    category: "Yumşaq trikotaj / qum rəngi",
    price: 8900,
    group: "Trikotaj",
    description:
      "Yumşaq toxuması və rahat forması ilə gündəlik qarderob üçün hazırlanmış sakit tonlu trikotaj.",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "denim",
    name: "Düz kəsimli denim",
    category: "Denim / washed blue",
    price: 11900,
    group: "Alt geyim",
    description:
      "Klassik düz kəsim və yuyulmuş mavi ton. Gündəlik kombinlər üçün universal denim.",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "tshirt",
    name: "Baza futbolkası",
    category: "Pambıq / ağ",
    price: 3900,
    group: "Üst geyim",
    description:
      "Sadə və rahat baza futbolkası. Təmiz siluet və yumşaq pambıq material.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85",
  },
];

type Product = (typeof PRODUCTS)[number];

type Line = {
  product: Product;
  size: string;
  quantity: number;
};

function money(value: number) {
  const formatted = String(value).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ".",
  );

  return `${formatted} ₼`;
}

function Logo() {
  return (
    <svg
      viewBox="0 0 82 32"
      fill="none"
      aria-hidden="true"
    >
      <text
        x="0"
        y="25"
        fill="currentColor"
        fontSize="25"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
        letterSpacing="-1"
      >
        ASI
      </text>
    </svg>
  );
}

/* =========================================================
   HERO
========================================================= */

function Hero() {
  const stage = useRef<HTMLElement>(null);
  const controller = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const glassRect = useRef<DOMRect | null>(null);

  const [ready, setReady] = useState<boolean[]>(
    Array(8).fill(false),
  );

  const [selected, setSelected] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [titleHidden, setTitleHidden] = useState(false);

  const visible = useRef(0);

  const reveal = useCallback((index: number) => {
    videos.current.forEach((video, i) => {
      if (video) {
        video.style.visibility =
          i === index ? "visible" : "hidden";
      }
    });

    visible.current = index;
  }, []);

  useEffect(() => {
    videos.current.forEach((video, index) => {
      if (!video) return;

      const loaded = () => {
        if (video.readyState < 2) return;

        setReady((prev) => {
          if (prev[index]) return prev;

          const next = [...prev];
          next[index] = true;
          return next;
        });

        if (index === 0) {
          video.pause();
          reveal(0);
        }
      };

      video.addEventListener("loadeddata", loaded);
      video.addEventListener("canplay", loaded);

      loaded();

      return () => {
        video.removeEventListener("loadeddata", loaded);
        video.removeEventListener("canplay", loaded);
      };
    });
  }, [reveal]);

  function capsule(index: number) {
    const element = controller.current;

    if (!element || selected !== null) return;

    element.style.setProperty(
      "--cap-left",
      index ? `${index * 20}%` : "-5px",
    );

    element.style.setProperty(
      "--cap-width",
      index === 0 || index === 4
        ? "calc(20% + 5px)"
        : "20%",
    );

    element.classList.toggle("highlighted", index > 0);
  }

  function measureTravel(index: number) {
    const bar = controller.current;
    const button = buttons.current[index];

    if (!bar || !button) return;

    const rect = bar.getBoundingClientRect();
    const cell = button.getBoundingClientRect();

    button.style.setProperty(
      "--travel-x",
      `${rect.left + rect.width / 2 - cell.left - cell.width / 2}px`,
    );

    button.style.setProperty(
      "--travel-y",
      `${rect.top + 35 - cell.top - cell.height / 2}px`,
    );
  }

  function start(index: number, reverse: boolean) {
    const option = OPTIONS[index];

    const clipIndex =
      (option.file - 1) * 2 + (reverse ? 1 : 0);

    const video = videos.current[clipIndex];

    if (!video) return;

    if (!reverse && selected !== null) return;

    if (reverse && selected !== index) return;

    if (!ready[clipIndex]) return;

    if (!reverse) {
      measureTravel(index);

      setSelected(index);
      setCollapsed(true);
      setTitleHidden(true);
    } else {
      setSelected(null);
      setCollapsed(false);
      setTitleHidden(false);

      controller.current?.style.setProperty(
        "--cap-left",
        "-5px",
      );

      controller.current?.style.setProperty(
        "--cap-width",
        "calc(20% + 5px)",
      );
    }

    videos.current.forEach((item) => item?.pause());

    video.currentTime = 0;

    reveal(clipIndex);

    video.play().catch(() => {});

    video.onended = () => {
      if (reverse) {
        reveal(0);
        setSelected(null);
        setCollapsed(false);
        setTitleHidden(false);
      } else {
        setSelected(index);
      }
    };
  }

  return (
    <section
      ref={stage}
      className={`stage ${
        titleHidden ? "title-hidden" : ""
      }`}
      aria-label="İnteraktiv kolleksiya"
    >
      {CLIPS.map((clip, index) => (
        <video
          key={clip}
          ref={(element) => {
            videos.current[index] = element;
          }}
          className="media"
          src={BASE + clip}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      ))}

      <div className="hero">
        <h1>
          <span>The</span>{" "}
          <span>world</span>{" "}
          <span>model</span>
        </h1>

        <p>
          ASI sizə tam nəzarət imkanı verən açıq dünya
          modelləri yaradır — istehsala hazır videodan
          fiziki dünyanı anlayan və onunla işləyə bilən
          sistemlərə qədər.
        </p>
      </div>

      <div
        ref={controller}
        className={`controller ${
          collapsed ? "collapsed" : ""
        }`}
        role="group"
        aria-label="Səhnə vəziyyətini idarə et"
        onPointerEnter={() => {
          glassRect.current =
            controller.current?.getBoundingClientRect() || null;
        }}
        onPointerMove={(event) => {
          const rect = glassRect.current;
          if (!rect) return;

          event.currentTarget.style.setProperty(
            "--glass-x",
            `${((event.clientX - rect.left) / rect.width) * 100}%`,
          );

          event.currentTarget.style.setProperty(
            "--glass-y",
            `${((event.clientY - rect.top) / rect.height) * 100}%`,
          );
        }}
        onPointerLeave={() => {
          capsule(0);
        }}
      >
        <div className="track glass" />
        <div className="capsule glass" />

        <div className="cells">
          <div className="cell select-label">
            Vəziyyəti seç →
          </div>

          {OPTIONS.map((option, index) => {
            const pair = (option.file - 1) * 2;

            const isChosen = selected === index;
            const hidden = collapsed && !isChosen;

            const enabled =
              ready[pair] &&
              ready[pair + 1] &&
              (selected === null || isChosen);

            return (
              <button
                key={option.key}
                ref={(element) => {
                  buttons.current[index] = element;
                }}
                type="button"
                className={`cell ${
                  isChosen ? "chosen" : ""
                }`}
                disabled={!enabled}
                aria-hidden={hidden || undefined}
                tabIndex={hidden || !enabled ? -1 : 0}
                onPointerEnter={() =>
                  capsule(index + 1)
                }
                onFocus={() => capsule(index + 1)}
                onBlur={() => capsule(0)}
                onClick={() =>
                  start(index, selected === index)
                }
              >
                {collapsed && isChosen ? (
                  <span className="reset-label">
                    Sıfırla
                  </span>
                ) : (
                  <span>{option.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <header className="site-header">
        <a
          href="#"
          className="logo"
          aria-label="ASI ana səhifə"
        >
          <Logo />
        </a>

        <a
          className="try-link"
          href="https://app.ltx.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          İndi yoxla
        </a>
      </header>

      <div className="hero-bottom">
        <span>KOLLEKSİYA / GÜNDƏLİK FORM</span>

        <a href="#collection">
          Kolleksiyanı araşdır <span>↓</span>
        </a>

        <span>HƏRƏKƏT ÜÇÜN DİZAYN EDİLİB</span>
      </div>
    </section>
  );
}

/* =========================================================
   SHOP
========================================================= */

export default function Home() {
  const [filter, setFilter] = useState("Hamısı");
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [cart, setCart] = useState<Line[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const dialog = useRef<HTMLDialogElement>(null);
  const productDialog = useRef<HTMLDialogElement>(null);

  const count = cart.reduce(
    (sum, line) => sum + line.quantity,
    0,
  );

  const total = cart.reduce(
    (sum, line) =>
      sum + line.product.price * line.quantity,
    0,
  );

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("asi-bag") || "[]",
      );

      if (Array.isArray(saved)) {
        setCart(saved);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (cartOpen) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [cartOpen]);

  useEffect(() => {
    if (selectedProduct) {
      productDialog.current?.showModal();
    } else {
      productDialog.current?.close();
    }
  }, [selectedProduct]);

  function updateCart(next: Line[]) {
    setCart(next);

    try {
      localStorage.setItem(
        "asi-bag",
        JSON.stringify(next),
      );
    } catch {}
  }

  function add(product: Product) {
    const size = sizes[product.id] || "M";

    const existing = cart.find(
      (line) =>
        line.product.id === product.id &&
        line.size === size,
    );

    const next = existing
      ? cart.map((line) =>
          line === existing
            ? {
                ...line,
                quantity: line.quantity + 1,
              }
            : line,
        )
      : [
          ...cart,
          {
            product,
            size,
            quantity: 1,
          },
        ];

    updateCart(next);

    setMessage(
      `${product.name}, ${size} ölçüsü: səbətə əlavə edildi.`,
    );
  }

  function closeCart() {
    dialog.current?.close();
    setCartOpen(false);
  }

  function openProduct(product: Product) {
    setSelectedProduct(product);
  }

  function closeProduct() {
    productDialog.current?.close();
    setSelectedProduct(null);
  }

  return (
    <main>
      <Hero />

      <nav className="shop-nav" aria-label="Mağaza">
        <a className="shop-wordmark" href="#">
          ASI / WARDROBE
        </a>

        <div className="shop-links">
          <a href="#collection">Kolleksiya</a>
          <a href="#editorial">Obrazlar</a>
          <a href="#about">Yanaşmamız</a>
        </div>

        <button
          type="button"
          onClick={() => setCartOpen(true)}
        >
          Səbət{" "}
          <span>
            ({count})
          </span>
        </button>
      </nav>

      <section
        id="collection"
        className="collection section-pad"
      >
        <div className="section-intro">
          <span className="eyebrow">
            GÜNDƏLİK SEÇİM
          </span>

          <h2>
            Daha az geyim.
            <br />
            <span>Daha çox sən.</span>
          </h2>

          <p>
            Sərbəst siluetlər, sakit tonlar və yenidən
            geyinmək istəyəcəyin parçalar.
          </p>
        </div>

        <div className="collection-toolbar">
          <div
            className="filters"
            role="group"
            aria-label="Məhsul kateqoriyaları"
          >
            {[
              "Hamısı",
              "Üst geyim",
              "Alt geyim",
              "Trikotaj",
            ].map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <span className="item-count">
            {
              PRODUCTS.filter(
                (product) =>
                  filter === "Hamısı" ||
                  product.group === filter,
              ).length
            }{" "}
            məhsul
          </span>
        </div>

        <div className="product-grid">
          {PRODUCTS.filter(
            (product) =>
              filter === "Hamısı" ||
              product.group === filter,
          ).map((product) => (
            <article
              className="product"
              key={product.id}
              role="button"
              tabIndex={0}
              onClick={() => openProduct(product)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  openProduct(product);
                }
              }}
            >
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  width="800"
                  height="1050"
                />

                <button
                  className="quick-add"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    add(product);
                  }}
                >
                  <span>Səbətə əlavə et</span>
                  <span>+</span>
                </button>
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <span>{money(product.price)}</span>
              </div>

              <p className="product-category">
                {product.category}
              </p>

              <div
                className="sizes"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                {["XS", "S", "M", "L"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={
                      (sizes[product.id] || "M") === size
                    }
                    onClick={() =>
                      setSizes((previous) => ({
                        ...previous,
                        [product.id]: size,
                      }))
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="collection-note">
          <span>
            Yaxşı qarderob say çoxluğundan başlamır.
          </span>
          <span>Dörd parça. Sənin ritmin.</span>
        </div>
      </section>

      <section className="editorial" id="editorial">
        <div className="editorial-image">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=85"
            alt="Gündəlik şəhər stili"
            loading="lazy"
          />
        </div>

        <div className="editorial-copy">
          <span className="eyebrow">
            XÜSUSİ GÜN ÜÇÜN DEYİL
          </span>

          <h2>
            Həyat üçün.
            <br />
            Hərəkətdə.
          </h2>

          <p>
            Səhər qəhvəsi, uzun yol, səbəbsiz görüş.
            Geyim planlarını dəyişməməlidir. Sadəcə onlar
            üçün yer saxlamalıdır.
          </p>

          <a href="#collection" className="text-link">
            Öz qarderobunu yarat <span>↗</span>
          </a>
        </div>
      </section>

      <section className="about section-pad" id="about">
        <span className="eyebrow">
          BİZİM YANAŞMAMIZ
        </span>

        <h2>
          Daha yüksək səslə yox.
          <br />
          <span>Daha dəqiq.</span>
        </h2>

        <div className="about-text">
          <p>
            Biz qarderoba şəxsi məkan kimi baxırıq. Burada
            azadlıq, proporsiya və özünü rahat hiss etmək
            vacibdir.
          </p>

          <p>
            Mürəkkəb qaydalar yoxdur. Birlikdə geyin, əhvalını
            dəyiş və yalnız sənə uyğun olanları saxla.
          </p>
        </div>
      </section>

      <footer className="footer section-pad">
        <a className="footer-logo" href="#">
          <Logo />
        </a>

        <div>
          <span>HAQQIMIZDA</span>
          <span>ASI / WARDROBE</span>
          <span>
            Gündəlik həyat üçün minimal və rahat geyimlər.
            Sakit rənglər, rahat siluetlər və asan
            kombinlər.
          </span>
        </div>

        <div>
          <span>ƏLAQƏ</span>
          <span>055-535-68-36</span>
        </div>

        <a href="#collection">
          Kolleksiyaya ↗
        </a>

        <p>
          Demo mağaza. Ödəniş sistemi qoşulmayıb.
        </p>
      </footer>

      {message && (
        <div className="cart-feedback">
          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage("")}
          >
            ×
          </button>
        </div>
      )}

      <dialog
        ref={productDialog}
        className="product-dialog"
        onCancel={(event) => {
          event.preventDefault();
          closeProduct();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeProduct();
          }
        }}
      >
        {selectedProduct && (
          <div className="product-dialog-inner">
            <button
              className="product-dialog-close"
              type="button"
              onClick={closeProduct}
              aria-label="Bağla"
            >
              ×
            </button>

            <div className="product-dialog-image">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
              />
            </div>

            <div className="product-dialog-content">
              <span className="eyebrow">
                {selectedProduct.group}
              </span>

              <h2>{selectedProduct.name}</h2>

              <p className="product-dialog-category">
                {selectedProduct.category}
              </p>

              <strong className="product-dialog-price">
                {money(selectedProduct.price)}
              </strong>

              <p className="product-dialog-description">
                {selectedProduct.description}
              </p>

              <div className="product-dialog-sizes">
                <span>Ölçü seç</span>

                <div>
                  {["XS", "S", "M", "L"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={
                        (sizes[selectedProduct.id] || "M") ===
                        size
                      }
                      onClick={() =>
                        setSizes((previous) => ({
                          ...previous,
                          [selectedProduct.id]: size,
                        }))
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="product-dialog-add"
                type="button"
                onClick={() => {
                  add(selectedProduct);
                  closeProduct();
                }}
              >
                Səbətə əlavə et
                <span>+</span>
              </button>
            </div>
          </div>
        )}
      </dialog>

      <dialog
        ref={dialog}
        className="bag"
        onCancel={(event) => {
          event.preventDefault();
          closeCart();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeCart();
          }
        }}
      >
        <div className="bag-inner">
          <div className="bag-heading">
            <h2>
              Sənin seçimin <span>({count})</span>
            </h2>

            <button
              type="button"
              onClick={closeCart}
            >
              ×
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="bag-empty">
              <p>Burada hələ heç nə yoxdur.</p>

              <button
                type="button"
                onClick={closeCart}
              >
                Kolleksiyaya qayıt ↗
              </button>
            </div>
          ) : (
            <>
              <div className="bag-lines">
                {cart.map((line) => (
                  <div
                    className="bag-line"
                    key={
                      line.product.id + line.size
                    }
                  >
                    <img
                      src={line.product.image}
                      alt={line.product.name}
                    />

                    <div>
                      <h3>{line.product.name}</h3>

                      <p>
                        {line.size} / {line.quantity} ədəd
                      </p>

                      <span>
                        {money(
                          line.product.price *
                            line.quantity,
                        )}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        updateCart(
                          cart.filter(
                            (item) => item !== line,
                          ),
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="bag-total">
                <span>Ümumi</span>
                <strong>{money(total)}</strong>
              </div>

              <p className="bag-disclaimer">
                Bu demo səbətidir. Sifariş və ödəniş
                həyata keçirilmir.
              </p>

              <button
                className="bag-continue"
                type="button"
                onClick={closeCart}
              >
                Seçimə davam et ↗
              </button>
            </>
          )}
        </div>
      </dialog>
    </main>
  );
}