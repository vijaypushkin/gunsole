import { TemplateData, templateEngine } from "@/utils/template";
import { Component, createMemo, createResource } from "solid-js";

interface LogRendererProps {
  template: string;
  data: TemplateData;
  class?: string;
  onError?: (error: string) => void;
}

const LogRenderer: Component<LogRendererProps> = (props) => {
  const [renderedHtml] = createResource<string, [string, TemplateData], string>(
    () => [props.template, props.data], // dependencies
    async ([template, data]) => {
      try {
        return await templateEngine.renderTemplate("basic", data);
      } catch (error) {
        const errorMsg = `Template error: ${String(error)}`;
        props.onError?.(errorMsg);
        return `<div class="template-error bg-red-50 border border-red-200 p-2 rounded text-red-700">${errorMsg}</div>`;
      }
    }
  );

  return <div class={props.class} innerHTML={renderedHtml()} />;
};

export { LogRenderer };
