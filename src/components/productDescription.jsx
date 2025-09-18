import React from "react";
import DOMPurify from "dompurify"; // Cần cài đặt thư viện này

const ProductDescription = ({ htmlContent }) => {
    // Sanitize HTML để phòng chống XSS
    const sanitizedHTML = DOMPurify.sanitize(htmlContent, {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "p",
            "br",
            "strong",
            "em",
            "u",
            "s",
            "ul",
            "ol",
            "li",
            "a",
            "img",
            "table",
            "thead",
            "tbody",
            "tr",
            "th",
            "td",
        ],
        ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "style"],
    });

    return (
        <div
            className="jodit-content mt-10"
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
    );
};

export default ProductDescription;
