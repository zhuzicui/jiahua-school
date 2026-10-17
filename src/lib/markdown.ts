import { Marked } from "marked";

export type Heading = { id: string; text: string };

/**
 * Renders editor-written Markdown (trusted: it comes from signed-in staff) to HTML.
 * Second-level headings get ids so long pages can show a page outline.
 */
export const renderMarkdown = (source: string) => {
    const headings: Heading[] = [];
    const marked = new Marked({
        gfm: true,
        breaks: true,
        renderer: {
            heading({ tokens, depth }) {
                const text = this.parser.parseInline(tokens);
                if (depth === 2) {
                    const id = `section-${headings.length + 1}`;
                    headings.push({ id, text: text.replace(/<[^>]+>/g, "") });
                    return `<h2 id="${id}">${text}</h2>`;
                }
                return `<h${depth}>${text}</h${depth}>`;
            },
            link({ href, tokens }) {
                const text = this.parser.parseInline(tokens);
                const external = /^https?:\/\//.test(href);
                return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${text}</a>`;
            },
        },
    });
    const html = marked.parse(source, { async: false });
    return { html, headings };
};
