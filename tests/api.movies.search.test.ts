import { GET } from '@/app/api/movies/search/route';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock environment variables
vi.stubEnv('TMDB_BASE_URL', 'https://api.themoviedb.org/3');
vi.stubEnv('TMDB_READ_BEARER_ACCESS_TOKEN', 'test-token');

describe('GET /api/movies/search', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns normalized movie results for a valid search', async () => {
		// Mock TMDB successful response
		const mockTMDBResponse = {
			page: 1,
			total_pages: 1,
			total_results: 1,
			results: [
				{
					id: 123,
					title: 'Test Movie',
					overview: 'Test overview',
					release_date: '2022-01-01',
					poster_path: '/poster.jpg',
					vote_average: 7.5,
				},
			],
		};

		global.fetch = vi
			.fn()
			// First call: TMDB search
			.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => ({
					page: 1,
					total_pages: 1,
					total_results: 1,
					results: [
						{
							id: 123,
							title: 'Test Movie',
							overview: 'Test overview',
							release_date: '2022-01-01',
							poster_path: '/poster.jpg',
							vote_average: 7.5,
						},
					],
				}),
			} as any)
			// Second call: TMDB config
			.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => ({
					images: {
						secure_base_url: 'https://image.tmdb.org/t/p/',
						poster_sizes: ['w342'],
						backdrop_sizes: ['w780'],
						profile_sizes: ['w185'],
					},
				}),
			} as any);

		const request = new Request('http://localhost:3000/api/movies/search?q=test&page=1');

		const response = await GET(request);

		expect(response.status).toBe(200);

		const json = await response.json();

		expect(json).toEqual({
			page: 1,
			total_pages: 1,
			total_results: 1,
			results: [
				{
					id: 123,
					title: 'Test Movie',
					overview: 'Test overview',
					release_date: '2022-01-01',
					poster_url: expect.any(String),
					vote_average: 7.5,
				},
			],
		});
	});

	it('returns 429 when TMDB rate limit is exceeded', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 429,
			json: async () => ({
				status_message: 'Rate limit exceeded',
			}),
		} as any);

		const request = new Request('http://localhost:3000/api/movies/search?q=test&page=1');

		const response = await GET(request);

		expect(response.status).toBe(429);

		const json = await response.json();

		expect(json).toEqual({
			message: 'Rate limit exceeded. Please try again later.',
		});
	});
});
