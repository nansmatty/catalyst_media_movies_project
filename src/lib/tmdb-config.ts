const TMDB_BASE_URL = process.env.TMDB_BASE_URL!;
const TMDB_READ_BEARER_ACCESS_TOKEN = process.env.TMDB_READ_BEARER_ACCESS_TOKEN!;

export async function getImageConfig() {
	try {
		const response = await fetch(`${TMDB_BASE_URL}/configuration`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${TMDB_READ_BEARER_ACCESS_TOKEN}`,
				'Content-Type': 'application/json',
			},
			next: {
				revalidate: 60 * 60 * 24,
			},
		});
		if (!response.ok) {
			throw new Error(`Failed to fetch configuration: ${response.status}`);
		}
		const data = await response.json();
		const imageConfigs = {
			base_url: data.images.secure_base_url,
			poster_size: 'w500',
			backdrop_size: 'w1280',
			profile_size: 'w185',
		};
		return imageConfigs;
	} catch (error) {
		console.error('Error fetching TMDB configuration:', error);
		throw error;
	}
}
