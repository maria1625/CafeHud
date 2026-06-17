import { create } from "zustand";
//#region src/store/useThemeStore.js
var canUseDOM = () => typeof window !== "undefined" && typeof document !== "undefined" && typeof localStorage !== "undefined";
var getPreferredTheme = () => {
	if (!canUseDOM()) return false;
	return localStorage.getItem("theme") === "dark" || !("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches;
};
var applyThemeClass = (isDark) => {
	if (!canUseDOM()) return;
	if (isDark) document.documentElement.classList.add("dark");
	else document.documentElement.classList.remove("dark");
};
var useThemeStore = create((set) => ({
	isDark: false,
	toggleTheme: () => set((state) => {
		const newIsDark = !state.isDark;
		if (canUseDOM()) localStorage.setItem("theme", newIsDark ? "dark" : "light");
		applyThemeClass(newIsDark);
		return { isDark: newIsDark };
	}),
	initTheme: () => {
		const isDark = getPreferredTheme();
		applyThemeClass(isDark);
		set({ isDark });
	}
}));
//#endregion
export { useThemeStore as t };
