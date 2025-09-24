import React from "react";
import DOMPurify from "dompurify";

const RenderDocument = ({ content }) => {
    // Cấu hình DOMPurify chi tiết hơn cho Jodit Editor
    const sanitizedHTML = DOMPurify.sanitize(content || "", {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: [
            "h1", "h2", "h3", "h4", "h5", "h6",
            "p", "br", "blockquote", "pre", "code",
            "strong", "b", "em", "i", "u", "s", "strike",
            "ul", "ol", "li",
            "a", "img", "figure", "figcaption",
            "table", "thead", "tbody", "tr", "th", "td",
            "div", "span", "hr", "sup", "sub"
        ],
        ALLOWED_ATTR: [
            "href", "src", "alt", "title", "class",
            "style", "width", "height", "border",
            "colspan", "rowspan", "align", "target"
        ],
        ALLOW_DATA_ATTR: false,
        FORBID_TAGS: ["script", "style", "iframe", "form"],
        FORBID_ATTR: ["onclick", "onerror", "onload"]
    });

    return (
        <article className="jodit-wysiwyg">
            <div 
                className="jodit-content"
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '20px',
                    fontFamily: 'Arial, sans-serif',
                    lineHeight: 1.6
                }}
                dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
            />
        </article>
    );
};


export default RenderDocument;
