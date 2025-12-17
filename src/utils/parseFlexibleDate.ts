export const parseFlexibleDate = (input: string): string | null => {
	const dateIsoRegex = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);

	if (dateIsoRegex) {
		// 🎯 Tentativa 1: formato ISO estrito (YYYY-MM-DD)
		const [_fullDate, yearString, monthString, dayString] =
			dateIsoRegex;

		const day = Number(dayString);
		const month = Number(monthString);
		const year = Number(yearString);

		const date = new Date(Date.UTC(year, month - 1, day));

		if (
			date.getUTCFullYear() !== year ||
			date.getUTCMonth() + 1 !== month ||
			date.getUTCDate() !== day
		) {
			return null;
		}

		return input;
	}
	// 🎯 Tentativa 2: formatos humanos com barra (DD/MM/YYYY ou MM/DD/YYYY)
	const dateParts = input.split("/").map(Number);

	if (dateParts.length !== 3) {
		return null;
	}

	let day: number, month: number, year: number;

	if (dateParts[0] > 12) {
		[day, month, year] = dateParts;
	} else if (dateParts[1] > 12) {
		[month, day, year] = dateParts;
	} else {
		[day, month, year] = dateParts;
	}

	if (day < 1 || month < 1 || month > 12) {
		return null;
	}

	const date = new Date(Date.UTC(year, month - 1, day));

	if (
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() + 1 !== month ||
		date.getUTCDate() !== day
	) {
		return null;
	}

	const DD = date.getUTCDate().toString().padStart(2, "0");
	const MM = (date.getUTCMonth() + 1).toString().padStart(2, "0");
	const YYYY = date.getUTCFullYear().toString();

	return `${YYYY}-${MM}-${DD}`;
};
