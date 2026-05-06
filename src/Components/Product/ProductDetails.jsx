// Components/Product/ProductDetails.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;

function formatKey(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function normalizeAttributes(attributes = []) {
  const map = {};
  attributes.forEach((attr) => {
    if (!map[attr.attributeKey]) map[attr.attributeKey] = [];
    if (Array.isArray(attr.values)) map[attr.attributeKey].push(...attr.values);
  });
  return Object.entries(map).map(([key, values]) => ({
    attributeKey: key,
    values: [...new Set(values)],
  }));
}

const HIDDEN_KEYS = ["product_name", "title", "name", "description"];

// ✅ URL detect करून external link बनवतो
function isURL(str) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function AttributeValue({ values }) {
  return (
    <>
      {values.map((val, i) => (
        <span key={i}>
          {i > 0 && ", "}
          {isURL(val) ? (
            <a
              href={val}
              target="_blank"
              rel="noopener noreferrer"
              className="pd-spec-link"
              onClick={(e) => e.stopPropagation()}
            >
              {val}
            </a>
          ) : (
            val
          )}
        </span>
      ))}
    </>
  );
}

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!productId) return;
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch product
      const prodRes = await axios.get(`${API_BASE}/products/${productId}`, {
        params: { domainName: DOMAIN_NAME },
      });
      const productData = prodRes.data?.data || prodRes.data || null;
      setProduct(productData);

      // ✅ Fetch subcategory for this product to get subcategory name
      if (productData?.subCategoryId) {
        try {
          const subRes = await axios.get(
            `${API_BASE}/sub-categories/${productData.subCategoryId}`,
            { params: { domainName: DOMAIN_NAME } },
          );
          setSubcategory(subRes.data?.data || subRes.data || null);
        } catch {
          // fallback: try listing sub-categories and finding matching
          try {
            const subListRes = await axios.get(`${API_BASE}/sub-categories`, {
              params: { domainName: DOMAIN_NAME },
            });
            const subs = subListRes.data?.data || [];
            const matched = subs.find(
              (s) => s._id === productData.subCategoryId,
            );
            setSubcategory(matched || null);
          } catch {
            setSubcategory(null);
          }
        }
      }

      // Fetch images
      try {
        const imgRes = await axios.get(`${API_BASE}/product-images`, {
          params: { productId },
        });
        const imgData = imgRes.data?.data || [];
        const normalized = imgData
          .map((img) => ({
            ...img,
            image: img.image || img.url || img.imageUrl || "",
          }))
          .filter((img) => img.image);
        setImages(normalized);
      } catch {
        setImages([]);
      }
    } catch (err) {
      console.error("Failed to load product:", err);
      setError("Could not load product details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const normalizedAttributes = normalizeAttributes(product?.attributes || []);
  const getAttr = (key) =>
    normalizedAttributes.find((a) => a.attributeKey === key)?.values || [];

  // ✅ pd-title = subcategory name first, fallback to attribute/product name
  const productName =
    subcategory?.name ||
    getAttr("product_name")[0] ||
    getAttr("title")[0] ||
    getAttr("name")[0] ||
    product?.name ||
    "Product";

  const description = getAttr("description")[0] || product?.description || null;

  const fallbackImage =
    product?.image || product?.imageUrl || product?.thumbnail || null;
  const displayImages =
    images.length > 0
      ? images
      : fallbackImage
        ? [{ image: fallbackImage }]
        : [];

  const visibleAttrs = normalizedAttributes.filter(
    (a) => !HIDDEN_KEYS.includes(a.attributeKey),
  );

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (displayImages.length <= 1) return;
      if (e.key === "ArrowRight")
        setActiveIndex((i) => (i + 1) % displayImages.length);
      if (e.key === "ArrowLeft")
        setActiveIndex(
          (i) => (i - 1 + displayImages.length) % displayImages.length,
        );
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [displayImages.length]);

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-loader-ring">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>Loading product details…</p>
      </div>
    );
  }

  if (error)
    return (
      <div className="pd-error">
        <p>{error}</p>
        <Link to="/products" className="pd-back-btn">
          ← Back to Products
        </Link>
      </div>
    );

  if (!product)
    return (
      <div className="pd-error">
        <p>Product not found.</p>
        <Link to="/products" className="pd-back-btn">
          ← Back to Products
        </Link>
      </div>
    );

  return (
    <div className="pd-page">
      {/* ── Breadcrumb ── */}
      <div className="pd-breadcrumb-bar">
        <div className="pd-container">
          <Link to="/products" className="pd-bc-link">
            Products
          </Link>
          <span className="pd-bc-sep">›</span>
          {subcategory && (
            <>
              <span className="pd-bc-link pd-bc-sub">{subcategory.name}</span>
              <span className="pd-bc-sep">›</span>
            </>
          )}
          <span className="pd-bc-current">{productName}</span>
        </div>
      </div>
          
      {/* ── Back Button ── */}
      <div className="pd-container pd-top-actions">
        <Link to="/products" className="pd-back-btn">
          ← Back to Products
        </Link>
      </div>

      {/* ── Card ── */}
      <div className="pd-container">
        <div className="pd-card">
          {/* ── Gallery (RIGHT) ── */}
          <div className="pd-gallery">
            <div
              className={`pd-main-img-wrap${zoomed ? " pd-main-img-wrap--zoomed" : ""}`}
              onClick={() => displayImages.length > 0 && setZoomed((z) => !z)}
              title={displayImages.length > 0 ? "Click to zoom" : ""}
            >
              {displayImages.length > 0 ? (
                <img
                  key={activeIndex}
                  src={displayImages[activeIndex]?.image}
                  alt={productName}
                  className="pd-main-img"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/600x450?text=No+Image";
                  }}
                />
              ) : (
                <div className="pd-no-img">No Image Available</div>
              )}
              {displayImages.length > 0 && (
                <span className="pd-zoom-hint">
                  {zoomed ? "✕ Close" : "🔍 Zoom"}
                </span>
              )}
            </div>

            {displayImages.length > 1 && (
              <div className="pd-thumbs">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    className={`pd-thumb${idx === activeIndex ? " pd-thumb--active" : ""}`}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Image ${idx + 1}`}
                  >
                    <img
                      src={img.image}
                      alt={`Thumb ${idx + 1}`}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {displayImages.length > 1 && (
              <div className="pd-arrows">
                <button
                  className="pd-arrow"
                  onClick={() =>
                    setActiveIndex(
                      (i) =>
                        (i - 1 + displayImages.length) % displayImages.length,
                    )
                  }
                >
                  ‹
                </button>
                <span className="pd-img-counter">
                  {activeIndex + 1} / {displayImages.length}
                </span>
                <button
                  className="pd-arrow"
                  onClick={() =>
                    setActiveIndex((i) => (i + 1) % displayImages.length)
                  }
                >
                  ›
                </button>
              </div>
            )}
          </div>

          {/* ── Info (LEFT) ── */}
          <div className="pd-info">
            {/* ✅ Subcategory label above title */}
     
            {/* ✅ pd-title = subcategory name */}
            <h1 className="pd-title">{subcategory.name}</h1>

            {description && <p className="pd-description">{description}</p>}

            {visibleAttrs.length > 0 && (
              <div className="pd-specs-wrap">
                <h2 className="pd-specs-heading">Specifications</h2>
                <table className="pd-specs-table">
                  <tbody>
                    {visibleAttrs.map((attr, i) => (
                      <tr
                        key={attr.attributeKey}
                        style={{ "--row-delay": `${i * 40}ms` }}
                      >
                        <td className="pd-spec-key">
                          {formatKey(attr.attributeKey)}
                        </td>
                        <td className="pd-spec-val">
                          <AttributeValue values={attr.values} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="pd-actions">
              <Link to="/contact" className="pd-enquiry-btn">
                <span>📩</span> Send Enquiry
              </Link>
              <Link to="/products" className="pd-browse-btn">
                Browse More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Zoom Overlay ── */}
      {zoomed && displayImages.length > 0 && (
        <div className="pd-zoom-overlay" onClick={() => setZoomed(false)}>
          <img
            src={displayImages[activeIndex]?.image}
            alt={productName}
            className="pd-zoom-img"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="pd-zoom-close" onClick={() => setZoomed(false)}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
