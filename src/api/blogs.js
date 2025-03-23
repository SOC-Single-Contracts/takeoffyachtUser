import { API_BASE_URL } from '@/lib/api';
import axios from 'axios';

export const getAllBlogs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Blogs/blogs/`);
    
    // Ensure we return the nested 'data' array
    if (response.data && response.data.status && response.data.data) {
      return response.data;  // Return entire response object
    }
    
    return { data: [], status: false };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return { data: [], status: false }; // Return empty array with status
  }
};

export const getBlogDetail = async (blogId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Blogs/blogs/${blogId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog with ID ${blogId} error`);
    throw error;
 }
}

export const createBlog = async (blogData) => {
 try {
   const formData = new FormData();
   
   formData.append('title', blogData.title);
   formData.append('content', blogData.content);
   formData.append('author_name', blogData.author_name);
   if (blogData.thumbnail_image) {
     formData.append('thumbnail_image', blogData.thumbnail_image);
   }
   formData.append('tags', blogData.tags);
   formData.append('meta_tags', blogData.meta_tags);
   if (blogData.created_at) {
     formData.append('created_at', blogData.created_at);
   }
    const response = await axios.post(`${API_BASE_URL}/Blogs/blogs/`, formData, {
     headers: {
       'Content-Type': 'multipart/form-data',
     },
   });
   return response.data;
 } catch (error) {
   console.error('Error creating blog:', error);
   throw error;
 }
};

export const updateBlog = async (blogId, blogData) => {
 try {
   const formData = new FormData();
   
   Object.keys(blogData).forEach(key => {
     if (blogData[key] !== undefined) {
       formData.append(key, blogData[key]);
     }
   });
    const response = await axios.put(
     `${API_BASE_URL}/Blogs/blogs/${blogId}/`, 
     formData,
     {
       headers: {
         'Content-Type': 'multipart/form-data',
       },
     }
   );
   return response.data;
 } catch (error) {
   console.error(`Error updating blog with ID ${blogId}:`, error);
   throw error;
 }
};

export const getRelatedBlogs = async (currentBlogId, tags) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Blogs/blogs/`);
    const allBlogs = response.data.data; // Access the data array
    
    const relatedBlogs = allBlogs
      .filter(blog => blog.ID !== currentBlogId && 
        blog.tags.split(',').some(tag => 
          tags.split(',').map(t => t.trim().toLowerCase())
            .includes(tag.trim().toLowerCase())
        )
      )
      .slice(0, 3);
      
    return relatedBlogs;
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return []; // Return an empty array instead of throwing an error
  }
};
