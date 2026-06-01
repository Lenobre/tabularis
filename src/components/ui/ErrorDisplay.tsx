import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { TFunction } from "i18next";
import { useAlert } from "../../hooks/useAlert";
import { useToast } from "../../hooks/useToast";

interface ErrorDisplayProps {
  error: string;
  t: TFunction;
}

export function ErrorDisplay({ error, t }: ErrorDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);

  const { showToast } = useToast();

  const separatorIndex = error.indexOf("\n\n");
  const hasDetails = separatorIndex !== -1 && separatorIndex < error.length - 2;
  const brief = hasDetails ? error.slice(0, separatorIndex) : error;
  const details = hasDetails ? error.slice(separatorIndex + 2) : "";

  async function handleErrorClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();

    await navigator.clipboard.writeText(error);
    showToast({ title: t("editor.copied"), message: t("editor.errorCopied"), kind: "success" });
  }

  return (
    <div className="p-4 text-red-400 font-mono text-sm bg-red-900/10 h-full overflow-auto select-text" onClick={handleErrorClick} title="Click to copy error details">
      <div className="whitespace-pre-wrap">Error: {brief}</div>
      {hasDetails && (
        <>
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className="mt-2 flex items-center gap-1 text-xs text-red-300/70 hover:text-red-300 transition-colors cursor-pointer"
          >
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showDetails
              ? t("editor.hideErrorDetails")
              : t("editor.showErrorDetails")}
          </button>
          {showDetails && (
            <div className="mt-2 whitespace-pre-wrap text-red-400/60 border-t border-red-400/20 pt-2">
              {details}
            </div>
          )}
        </>
      )}
    </div>
  );
}
