import axios from 'axios'
const WP_API_URL = process.env.ACF_API_URL;

// Get ACF field groups
export async function getACFFields(postId) {
  try {
    const response = await acfApi.get(`/posts/${postId}`);
    return response.data.acf || {};
  } catch (error) {
    console.error('Error fetching ACF fields:', error);
    return {};
  }
}