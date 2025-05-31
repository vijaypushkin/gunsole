import { Liquid } from "liquidjs";
import DOMPurify from "dompurify";

export interface TemplateData {
  [key: string]: any;
}

class GunsoleTemplateEngine {
  private liquid: Liquid;
  private templateCache = new Map<string, any>();

  constructor() {
    this.liquid = new Liquid({
      cache: true,
      strictFilters: false,
      strictVariables: false,
    });

    // Register custom filters
    this.registerFilters();
  }

  private registerFilters() {
    // Date formatting
    this.liquid.registerFilter("formatTime", (date: string | number | Date) => {
      return new Date(date).toLocaleTimeString();
    });

    this.liquid.registerFilter("formatDate", (date: string | number | Date) => {
      return new Date(date).toLocaleDateString();
    });

    this.liquid.registerFilter(
      "formatDateTime",
      (date: string | number | Date) => {
        return new Date(date).toLocaleString();
      }
    );

    // String formatting
    this.liquid.registerFilter(
      "uppercase",
      (str: string) => str?.toUpperCase() || ""
    );
    this.liquid.registerFilter(
      "lowercase",
      (str: string) => str?.toLowerCase() || ""
    );
    this.liquid.registerFilter(
      "truncate",
      (str: string, length: number = 50) => {
        if (!str || str.length <= length) return str;
        return str.substring(0, length) + "...";
      }
    );

    // HTML escaping
    this.liquid.registerFilter("escape", (str: string) => {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    });

    // JSON formatting
    this.liquid.registerFilter("json", (obj: any, pretty: boolean = false) => {
      try {
        return JSON.stringify(obj, null, pretty ? 2 : 0);
      } catch {
        return String(obj);
      }
    });

    // Array/Object helpers
    this.liquid.registerFilter("length", (arr: any[]) => arr?.length || 0);
    this.liquid.registerFilter("keys", (obj: object) => Object.keys(obj || {}));
    this.liquid.registerFilter("values", (obj: object) =>
      Object.values(obj || {})
    );

    // Conditional classes
    this.liquid.registerFilter(
      "addClass",
      (baseClass: string, condition: any, additionalClass: string) => {
        return condition ? `${baseClass} ${additionalClass}` : baseClass;
      }
    );
  }

  /**
   * Register a template for a tab
   */
  async registerTemplate(tabId: string, templateString: string): Promise<void> {
    try {
      // Parse and cache the template
      const template = this.liquid.parse(templateString);
      this.templateCache.set(tabId, template);
    } catch (error) {
      console.error(`Failed to register template for tab ${tabId}:`, error);
      throw new Error(`Invalid template syntax: ${error}`);
    }
  }

  /**
   * Render a template with data
   */
  async renderTemplate(tabId: string, data: TemplateData): Promise<string> {
    try {
      const template = this.templateCache.get(tabId);
      if (!template) {
        throw new Error(`Template not found for tab: ${tabId}`);
      }

      // Render the template
      const html = await this.liquid.render(template, data);

      // Sanitize the output
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          "div",
          "span",
          "p",
          "strong",
          "em",
          "code",
          "pre",
          "ul",
          "ol",
          "li",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "br",
          "hr",
          "small",
          "mark",
          "del",
          "ins",
          "sub",
          "sup",
          "time",
          "kbd",
          "samp",
          "var",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
          "details",
          "summary",
        ],
        ALLOWED_ATTR: [
          "class",
          "id",
          "data-*",
          "aria-*",
          "role",
          "title",
          "alt",
          "style",
        ],
        ALLOW_DATA_ATTR: true,
        ALLOW_ARIA_ATTR: true,
      });
    } catch (error) {
      console.error(`Template rendering error for tab ${tabId}:`, error);
      return `<div class="template-error bg-red-50 border border-red-200 p-2 rounded text-red-700">
        Template Error: ${String(error)}
      </div>`;
    }
  }

  /**
   * Validate template syntax
   */
  async validateTemplate(
    templateString: string
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      this.liquid.parse(templateString);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Clear template cache
   */
  clearCache(): void {
    this.templateCache.clear();
  }
}

// Export singleton instance
export const templateEngine = new GunsoleTemplateEngine();
