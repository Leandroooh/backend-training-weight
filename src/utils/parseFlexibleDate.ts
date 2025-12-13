export const parseFlexibleDate = (input: string): string | null => {
	const parts = input.split(/[-/]/).map(Number);
	if (parts.length !== 3) return null;

	let day: number, month: number, year: number;

	// tenta DD/MM/YYYY
	if (parts[0] > 12) {
		[day, month, year] = parts;
	}
	// tenta MM/DD/YYYY
	else if (parts[1] > 12) {
		[month, day, year] = parts;
	}
	// ambíguo → assume DD/MM/YYYY
	else {
		[day, month, year] = parts;
	}

	if (day < 1 || month < 1 || month > 12) return null;

	// cria data no horário local
	const date = new Date(year, month - 1, day);

	// valida se o JS não "corrigiu" automaticamente
	if (
		date.getFullYear() !== year ||
		date.getMonth() + 1 !== month ||
		date.getDate() !== day
	) {
		return null;
	}

	// retorna ISO sem timezone (YYYY-MM-DD)
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");

	return `${yyyy}-${mm}-${dd}`;
};
