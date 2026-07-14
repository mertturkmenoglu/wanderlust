import { describe, expect, test } from 'vitest';
import { detectLanguage, LangCodeFormats } from './lang';

describe('language detection', () => {
	test('should return null given empty string', () => {
		const input = '';
		const result = detectLanguage(input, {
			outputFormat: LangCodeFormats.TwoLetter,
		});
		expect(result).toBeNull();
	});

	test('should return en given English text', () => {
		const input = `
			To be or not to be, that is the question. 
			Whether tis nobler in the mind to suffer 
			the slings and arrows of outrageous fortune, or to take arms against a sea of troubles
			and by opposing end them.`;

		const result = detectLanguage(input, {
			outputFormat: LangCodeFormats.TwoLetter,
		});

		expect(result).toBe('en');
	});

	test('should return es given Spanish text', () => {
		const input = `
			Ser o no ser, esa es la cuestión.
			¿Qué es más elevado para el espíritu, sufrir los golpes y dardos de la 
			ultrajante fortuna o tomar las armas contra un mar de aflicciones y, 
			haciéndoles frente, acabar con ellas?`;

		const result = detectLanguage(input, {
			outputFormat: LangCodeFormats.TwoLetter,
		});
		expect(result).toBe('es');
	});

	test('should return tr given Turkish text', () => {
		const input = `
			Olmak ya da olmamak, işte bütün mesele bu!
			Düşüncemizin katlanması mı güzel
			Zalim kaderin yumruklarına, oklarına
			Yoksa diretip bela denizlerine karşı
			Dur, yeter demesi mi?`;

		const result = detectLanguage(input, {
			outputFormat: LangCodeFormats.TwoLetter,
		});
		expect(result).toBe('tr');
	});

	test('should return null guven all numbers', () => {
		const input = '1234567890';
		const result = detectLanguage(input, {
			outputFormat: LangCodeFormats.TwoLetter,
		});
		expect(result).toBeNull();
	});

	test('should return 3 letter code given output format is ISO 639-3', () => {
		const input = `
			To be or not to be, that is the question. 
			Whether tis nobler in the mind to suffer 
			the slings and arrows of outrageous fortune, or to take arms against a sea of troubles
			and by opposing end them.`;

		const result = detectLanguage(input, {
			outputFormat: LangCodeFormats.ThreeLetter,
		});

		expect(result).toBe('eng');
	});

	test('should return null given short English text', () => {
		const input = 'Hello';
		const result = detectLanguage(input, {
			outputFormat: LangCodeFormats.TwoLetter,
		});
		expect(result).toBeNull();
	});
});
