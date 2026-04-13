type ToastType = "success" | "error";

type ToastOptions = {
  type?: ToastType;
  durationMs?: number;
};

function ensureToasterRoot() {
  let root = document.getElementById("toaster");
  if (root) return root;

  root = document.createElement("div");
  root.id = "toaster";
  root.className =
    "fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none";
  document.body.appendChild(root);
  return root;
}

export function showToast(message: string, options: ToastOptions = {}) {
  if (typeof window === "undefined") return;

  const { type = "error", durationMs = 2600 } = options;
  const root = ensureToasterRoot();
  const node = document.createElement("div");
  node.className = [
    "mb-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200",
    type === "success" ? "bg-emerald-500" : "bg-red-500",
  ].join(" ");
  node.textContent = message;

  root.appendChild(node);

  window.setTimeout(
    () => {
      node.style.opacity = "0";
      node.style.transform = "translateY(6px)";
    },
    Math.max(durationMs - 180, 0),
  );

  window.setTimeout(() => {
    node.remove();
  }, durationMs);
}
