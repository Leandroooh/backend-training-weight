export const parseFlexibleDate = (input: string): string | null => {
	// 1️⃣ formato ISO estrito: YYYY-MM-DD
	const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
	if (isoMatch) {
		const [, yearStr, monthStr, dayStr] = isoMatch;

		const year = Number(yearStr);
		const month = Number(monthStr);
		const day = Number(dayStr);

		const date = new Date(Date.UTC(year, month - 1, day));

		if (
			date.getUTCFullYear() !== year ||
			date.getUTCMonth() + 1 !== month ||
			date.getUTCDate() !== day
		) {
			return null;
		}

		return input; // já está normalizado
	}

	// 2️⃣ formatos humanos flexíveis
	const parts = input.split("/").map(Number);
	if (parts.length !== 3) return null;

	let day: number, month: number, year: number;

	// DD/MM/YYYY
	if (parts[0] > 12) {
		[day, month, year] = parts;
	}
	// MM/DD/YYYY
	else if (parts[1] > 12) {
		[month, day, year] = parts;
	}
	// ambíguo → assume DD/MM/YYYY
	else {
		[day, month, year] = parts;
	}

	if (day < 1 || month < 1 || month > 12) return null;

	const date = new Date(Date.UTC(year, month - 1, day));

	if (
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() + 1 !== month ||
		date.getUTCDate() !== day
	) {
		return null;
	}

	const yyyy = date.getUTCFullYear();
	const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
	const dd = String(date.getUTCDate()).padStart(2, "0");

	return `${yyyy}-${mm}-${dd}`;
};
