import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { type HoursInterval, useHoursStatus } from './use-hours-status';

describe('Hooks/UseHoursStatus', () => {
	describe('Etc/UTC', () => {
		const tz = 'Etc/UTC';

		beforeEach(() => {
			vi.useFakeTimers();
			// Use a fixed date and time for testing purposes
			// 23 November 2026, 09:00:00 UTC
			// Doctor Who Day
			vi.setSystemTime(new Date('2026-11-23T09:00:00Z'));
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		test('empty intervals array should return closed', () => {
			const input: HoursInterval[] = [];
			const result = useHoursStatus(tz, input);
			expect(result).toBe('closed');
		});

		test('should return open when current time is within an interval and interval is not off', () => {
			const input: HoursInterval[] = [
				{ off: false, open: '08:00', close: '17:00' },
			];
			const result = useHoursStatus(tz, input);
			expect(result).toBe('open');
		});

		test('should return openingSoon when current time is before an off=false interval and within 60 minutes', () => {
			const input: HoursInterval[] = [
				{ off: false, open: '09:30', close: '17:00' },
			];
			const result = useHoursStatus(tz, input);
			expect(result).toBe('openingSoon');
		});

		test('should return closingSoon when current time is within an interval and within 60 minutes of closing', () => {
			const input: HoursInterval[] = [
				{ off: false, open: '08:00', close: '09:30' },
			];
			const result = useHoursStatus(tz, input);
			expect(result).toBe('closingSoon');
		});

		test('should return closed when current time is within an interval and interval is off', () => {
			const input: HoursInterval[] = [
				{ off: true, open: '08:00', close: '17:00' },
			];
			const result = useHoursStatus(tz, input);
			expect(result).toBe('closed');
		});

		test('should return closed when current time is before opening and not within 60 minutes', () => {
			const input: HoursInterval[] = [
				{ off: false, open: '11:00', close: '17:00' },
			];
			const result = useHoursStatus(tz, input);
			expect(result).toBe('closed');
		});

		test('should return closed when current time is after closing', () => {
			const input: HoursInterval[] = [
				{ off: false, open: '05:00', close: '08:00' },
			];
			const result = useHoursStatus(tz, input);
			expect(result).toBe('closed');
		});

		test('should internally sort the intervals and should return open', () => {
			// The intervals are intentionally out of order to test sorting.
			// If the useHoursStatus function does not sort the intervals
			// this test will fail.
			const input: HoursInterval[] = [
				{ off: false, open: '12:00', close: '17:00' },
				{ off: false, open: '08:00', close: '11:00' },
			];
			const result = useHoursStatus(tz, input);
			expect(result).toBe('open');
		});
	});
});
