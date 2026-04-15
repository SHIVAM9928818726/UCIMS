import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CollegeCard({ college }) {
  const [bgImage, setBgImage] = useState("");
  const navigate = useNavigate();
  // Hover
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        let response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            college.College_Name
          )}`
        );

        let data;
        let imageFound = false;

        if (response.ok) {
          data = await response.json();
          if (data.thumbnail && data.thumbnail.source) {
            setBgImage(data.thumbnail.source);
            imageFound = true;
          } else if (data.originalimage && data.originalimage.source) {
            setBgImage(data.originalimage.source);
            imageFound = true;
          }
        }

        if (!imageFound) {
          const searchRes = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
              college.College_Name
            )}&utf8=&format=json&origin=*`
          );

          if (searchRes.ok) {
            const searchData = await searchRes.json();

            if (searchData.query?.search?.length > 0) {
              const properTitle = searchData.query.search[0].title;

              const titleRes = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
                  properTitle
                )}`
              );

              if (titleRes.ok) {
                const titleData = await titleRes.json();

                if (titleData.thumbnail && titleData.thumbnail.source) {
                  setBgImage(titleData.thumbnail.source);
                  imageFound = true;
                } else if (
                  titleData.originalimage &&
                  titleData.originalimage.source
                ) {
                  setBgImage(titleData.originalimage.source);
                  imageFound = true;
                }
              }
            }
          }
        }

        if (!imageFound) {
          setBgImage(
            "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
          );
        }
      } catch (err) {
        console.error("Failed to fetch image for", college.College_Name);
        setBgImage(
          "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        );
      }
    };

    fetchImage();
  }, [college.College_Name]);

  const formatData = (val) => {
    if (
      !val ||
      String(val).toLowerCase() === "nan" ||
      String(val).toLowerCase() === "null"
    )
      return "Info Unavailable";

    const strVal = String(val).trim();

    if (strVal.startsWith("₹") || strVal.toLowerCase().includes("lpa"))
      return strVal;

    if (
      /^\d{1,3}(,\d{3})*(\.\d+)?$/.test(strVal) ||
      /^\d+$/.test(strVal)
    )
      return `₹${strVal}`;

    return strVal;
  };

  return (
    <div className="college-card">
      <div
        className="college-img-placeholder"
        style={{
          backgroundImage: `url(${bgImage ||
            "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
            })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#e2e8f0",
        }}
      >
        <div className="college-tier-badge">{college.Tier} Tier</div>
      </div>

      <div
        className="college-content"
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem",
          textAlign: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <h3
          className="college-name"
          style={{
            fontSize: "1.4rem",
            fontWeight: "800",
            marginBottom: "0.25rem",
            color: "#1e293b",
          }}
        >
          {college.College_Name}
        </h3>

        <div
          className="college-location"
          style={{
            color: "#64748b",
            fontSize: "0.95rem",
            marginBottom: "1rem",
            fontWeight: "500",
          }}
        >
          📍 {college.City}, {college.State}
        </div>

        {college.College_Type && (
          <div
            style={{
              background: "#e0e7ff",
              color: "#223cc0ff",
              padding: "0.25rem 0.75rem",
              borderRadius: "1rem",
              fontSize: "0.8rem",
              fontWeight: "bold",
              marginBottom: "1.5rem",
            }}
          >
            {college.College_Type} Institution
          </div>
        )}

        <div
          className="college-footer"
          style={{
            marginTop: "auto",
            width: "100%",
            paddingTop: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div
            className="ratings-container"
            style={{
              display: "flex",
              gap: "1.5rem",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div
              className="reality-score"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                  fontWeight: "bold",
                }}
              >
                Reality Score
              </span>
              <span
                style={{
                  color: "#f47b3fff",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                ⭐ {college.Reality_score}/10
              </span>
            </div>

            <div
              className="user-rating"
              style={{
                display: "flex",
                flexDirection: "column",
                borderLeft: "1px solid #e2e8f0",
                paddingLeft: "1.5rem",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                  fontWeight: "bold",
                }}
              >
                User Rating
              </span>
              <span
                style={{
                  color: "#eab308",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                ⭐ {college.User_Rating} / 5
              </span>
            </div>
          </div>

          <button
            className="view-details-btn"
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "none",
              background: isHover ?  "linear-gradient(135deg, #421ee1ff, #13057bff)" :"linear-gradient(135deg, #2563eb, #7c87a6ff)" ,

              transform: isHover ? "scale(1.05)" : "scale(1)",
              transition: "0.3s ease",

              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              outline: "none",
              textTransform: "uppercase",
              letterSpacing: "1px",

              boxShadow: isHover
                ? "0 6px 12px rgba(37, 99, 235, 0.4)"
                : "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
            }}

            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={() =>
              navigate(`/college/${encodeURIComponent(college.College_Name)}`, {
                state: { college },
              })
            }
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}