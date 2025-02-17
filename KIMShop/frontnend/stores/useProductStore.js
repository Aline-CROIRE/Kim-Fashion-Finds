import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,

	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true });
		try {
	
const res = await axios.post("/products/createProduct", productData); // Corrected URL
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
             toast.success("Product created successfully!"); // Optional success message
		} catch (error) {
            console.error("Error creating product:", error); // Log the error for debugging
			toast.error(error.response?.data?.error || "Failed to create product");
			set({ loading: false });
		}
	},
/*************  ✨ Codeium Command ⭐  *************/
/**
 * Fetches all products from the server.
 * Sets loading state to true at the start and false upon completion.
 * On success, updates the products state with the fetched data.
 * On failure, sets an error message and displays a toast notification.
 */

/******  9f8b2020-baf7-421e-bdcd-e2ad2e5ee747  *******/
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response?.data?.error || "Failed to fetch products");
		} finally {
            set({ loading: false }); // Ensure loading is set to false even on error
        }
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response?.data?.error || "Failed to fetch products");
		} finally {
            set({ loading: false });
        }
	},
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
            toast.success("Product deleted successfully!");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to delete product");
		} finally {
            set({ loading: false });
        }
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
            toast.success("Product updated successfully!");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to update product");
		} finally {
            set({ loading: false });
        }
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
            toast.error(error.response?.data?.error || "Failed to fetch featured products");
		} finally {
            set({ loading: false });
        }
	},
}));
