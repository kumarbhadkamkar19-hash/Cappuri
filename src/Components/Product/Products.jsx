// Components/Product/Products.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./Products.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;

const slugify = (str) =>
  str
    ?.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// ✅ attributes normalize
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

// ✅ attributes मधून description शोधतो — key case-insensitive
function getDescriptionFromAttrs(attributes = []) {
  const normalized = normalizeAttributes(attributes);
  // "description", "Description", "DESC", "desc" — सगळे handle करतो
  const descAttr = normalized.find(
    (a) => a.attributeKey?.toLowerCase() === "description"
  );
  return descAttr?.values?.[0] || null;
}

// ✅ फक्त 2 sentences किंवा max 160 chars
function getTwoLineDescription(description) {
  if (!description) return null;
  const trimmed = String(description).trim();
  if (!trimmed) return null;

  // sentence split
  const sentences = trimmed.split(/(?<=[.!?])\s+/);
  if (sentences.length >= 2) {
    return sentences.slice(0, 2).join(" ");
  }
  if (trimmed.length > 160) return trimmed.slice(0, 160).trimEnd() + "…";
  return trimmed;
}

// ✅ product मधून description काढतो — सर्व possible locations तपासतो
function extractDescription(product) {
  if (!product) return null;

  // 1) attributes array मधून (case-insensitive key match)
  const fromAttrs = getDescriptionFromAttrs(product.attributes || []);
  if (fromAttrs) return fromAttrs;

  // 2) product.description (string)
  if (product.description && typeof product.description === "string") {
    return product.description;
  }

  // 3) product.desc
  if (product.desc && typeof product.desc === "string") {
    return product.desc;
  }

  // 4) product.shortDescription
  if (product.shortDescription && typeof product.shortDescription === "string") {
    return product.shortDescription;
  }

  return null;
}

/* ════════════════════════════════════════════════════════
   Products Component
   ════════════════════════════════════════════════════════ */
function Products() {
  const { categorySlug, subCategorySlug } = useParams();

  const [categories, setCategories] = useState([]);
  const [subcategoriesMap, setSubcategoriesMap] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, [categorySlug, subCategorySlug]);

  const loadAll = async () => {
    try {
      setLoading(true);

      const catRes = await axios.get(`${API_BASE}/categories`, {
        params: { domainName: DOMAIN_NAME },
      });
      const cats = catRes.data?.data || [];
      setCategories(cats);

      const activeCategory = cats.find(
        (c) => slugify(c.slug || c.name) === slugify(categorySlug)
      );

      const subFetches = await Promise.all(
        cats.map((cat) =>
          axios
            .get(`${API_BASE}/sub-categories`, {
              params: { domainName: DOMAIN_NAME, categoryId: cat._id },
            })
            .then((res) => ({ catId: cat._id, subs: res.data?.data || [] }))
            .catch(() => ({ catId: cat._id, subs: [] }))
        )
      );

      const newSubMap = {};
      subFetches.forEach(({ catId, subs }) => {
        newSubMap[catId] = subs;
      });
      setSubcategoriesMap(newSubMap);

      const activeSubs = activeCategory
        ? newSubMap[activeCategory._id] || []
        : [];
      const allSubs = Object.values(newSubMap).flat();

      const activeSubcategory = (activeCategory ? activeSubs : allSubs).find(
        (s) => slugify(s.slug || s.name) === slugify(subCategorySlug)
      );

      let prodRes;
      if (activeSubcategory) {
        prodRes = await axios.get(`${API_BASE}/products`, {
          params: { domainName: DOMAIN_NAME, subCategoryId: activeSubcategory._id },
        });
      } else if (activeCategory) {
        prodRes = await axios.get(`${API_BASE}/products`, {
          params: { domainName: DOMAIN_NAME, categoryId: activeCategory._id },
        });
      } else {
        prodRes = await axios.get(`${API_BASE}/products`, {
          params: { domainName: DOMAIN_NAME },
        });
      }

      const fetchedProducts = prodRes.data?.data || [];

      // 🔍 DEBUG: पहिल्या product चा structure console मध्ये बघतो
      if (fetchedProducts.length > 0) {
        console.log("🔍 PRODUCT DEBUG — पहिला product:", fetchedProducts[0]);
        console.log("🔍 attributes:", fetchedProducts[0]?.attributes);
        console.log("🔍 description field:", fetchedProducts[0]?.description);
      }

      setProducts(fetchedProducts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const subcategories = useMemo(
    () => Object.values(subcategoriesMap).flat(),
    [subcategoriesMap]
  );

  const activeCategory = useMemo(
    () =>
      categories.find(
        (c) => slugify(c.slug || c.name) === slugify(categorySlug)
      ),
    [categories, categorySlug]
  );

  const activeSubcategory = useMemo(() => {
    const subs = activeCategory
      ? subcategoriesMap[activeCategory._id] || []
      : subcategories;
    return subs.find(
      (s) => slugify(s.slug || s.name) === slugify(subCategorySlug)
    );
  }, [subcategoriesMap, subcategories, activeCategory, subCategorySlug]);

  const subMap = useMemo(() => {
    const map = {};
    subcategories.forEach((sub) => {
      map[sub._id] = sub;
    });
    return map;
  }, [subcategories]);

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loader-ring">
          <span></span><span></span><span></span><span></span>
        </div>
        <p>Loading products…</p>
      </div>
    );
  }

  const activeCategorySubs = activeCategory
    ? subcategoriesMap[activeCategory._id] || []
    : [];

  return (
    <div className="products-page">
      {/* ── Breadcrumb ── */}
      <div className="breadcrumb-bar">
        <div className="container">
          <Link to="/products" className="bc-link">All Products</Link>
          {categorySlug && (
            <>
              <span className="bc-sep">›</span>
              <Link to={`/products/${categorySlug}`} className="bc-link">
                {activeCategory?.name || "Category"}
              </Link>
            </>
          )}
          {subCategorySlug && (
            <>
              <span className="bc-sep">›</span>
              <span className="bc-current">
                {activeSubcategory?.name || "Subcategory"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── Subcategory Tabs ── */}
      {activeCategory && (
        <div className="subcategory-tabs-wrap">
          <div className="container">
            <div className="subcategory-tabs">
              <Link
                to={`/products/${categorySlug}`}
                className={`sc-tab${!subCategorySlug ? " sc-tab--active" : ""}`}
              >
                All {activeCategory.name}
              </Link>
              {activeCategorySubs.map((sub) => {
                const subSlug = sub.slug || slugify(sub.name);
                const isActive = slugify(subSlug) === slugify(subCategorySlug);
                return (
                  <Link
                    key={sub._id}
                    to={`/products/${categorySlug}/${subSlug}`}
                    className={`sc-tab${isActive ? " sc-tab--active" : ""}`}
                  >
                    {sub.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="products-header">
        <div className="container">
          <h1 className="products-heading">
            {activeSubcategory?.name || activeCategory?.name || "Our Products"}
          </h1>
          <p className="products-count">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="products-section">
        <div className="container">
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No products found</h3>
              <p>Try a different category or browse all products.</p>
              <Link to="/products" className="btn-back">← Browse All Products</Link>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product, i) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  subMap={subMap}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   Product Card
   ════════════════════════════════════════════════════════ */
function ProductCard({ product, subMap = {}, index = 0 }) {
  const [mainImage, setMainImage] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchImg = async () => {
      try {
        const res = await axios.get(`${API_BASE}/product-images`, {
          params: { productId: product._id },
        });
        const images = res.data?.data || [];
        if (!cancelled) {
          setMainImage(images[0]?.image || null);
          setImgLoading(false);
        }
      } catch {
        if (!cancelled) {
          setMainImage(null);
          setImgLoading(false);
        }
      }
    };
    fetchImg();
    return () => { cancelled = true; };
  }, [product._id]);

  // ✅ Title
  const subcategory = subMap[product.subCategoryId];
  const productName = subcategory?.name || product.name || "Product";

  // ✅ Description — सर्व possible sources तपासतो
  const rawDescription = extractDescription(product);
  const description = getTwoLineDescription(rawDescription);

  return (
    <Link
      to={`/product/${product._id}`}
      className="product-card"
      style={{ "--card-delay": `${index * 60}ms` }}
    >
      <div className="card-image-wrap">
        {imgLoading && <div className="card-img-skeleton" />}
        <img
          src={mainImage || "https://via.placeholder.com/400x280?text=No+Image"}
          alt={productName}
          className={`card-img${imgLoading ? " card-img--hidden" : ""}`}
          loading="lazy"
          onLoad={() => setImgLoading(false)}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x280?text=No+Image";
            setImgLoading(false);
          }}
        />
        <div className="card-overlay">
          <span className="card-overlay-text">View Details →</span>
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title">{productName}</h3>

        {/* ✅ Description — असेल तरच, max 2 lines */}
        {description && <p className="card-desc">{description}</p>}

        <div className="card-footer">
          <span className="card-btn">View More →</span>
        </div>
      </div>
    </Link>
  );
}

export default Products;