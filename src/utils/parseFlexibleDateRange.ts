type DateRange = {
	start: Date;
	end: Date;
};

export const parseFlexibleDateRange = (input: string): DateRange | null => {
	// 1️⃣ ISO estrito YYYY-MM-DD
	const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
	let year: number, month: number, day: number;

	if (isoMatch) {
		[, year, month, day] = isoMatch.map(Number);
	} else {
		// 2️⃣ formatos humanos
		const parts = input.split("/").map(Number);
		if (parts.length !== 3) return null;

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
	}

	// validação real de calendário
	const base = new Date(Date.UTC(year, month - 1, day));
	if (
		base.getUTCFullYear() !== year ||
		base.getUTCMonth() + 1 !== month ||
		base.getUTCDate() !== day
	) {
		return null;
	}

	// 3️⃣ fronteiras explícitas do dia (UTC)
	const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
	const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

	return { start, end };
};
