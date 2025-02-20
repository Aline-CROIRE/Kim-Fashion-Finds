import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../../stores/useProductStore";

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductForm = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
    });

    const { createProduct, loading, error } = useProductStore(); // Get error from store

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createProduct(newProduct);
            setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
        } catch (err) {  // catch the error in this component to prevent unhandled promise rejections
            console.error("Error creating a product:", err); // Log the error
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result });
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <motion.div
            className='bg-[#1A2027] shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className='text-2xl font-semibold mb-6 text-[#8C9EFF]'>Create New Product</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>} {/* Display error */}

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor='name' className='block text-sm font-medium text-[#E0E0E0]'>
                        Product Name
                    </label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className='mt-1 block w-full bg-[#1A2027] border border-gray-600 rounded-md shadow-sm py-2
                         px-3 text-[#E0E0E0] focus:outline-none focus:ring-2
                        focus:ring-[#8C9EFF] focus:border-[#8C9EFF]'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='description' className='block text-sm font-medium text-[#E0E0E0]'>
                        Description
                    </label>
                    <textarea
                        id='description'
                        name='description'
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows='3'
                        className='mt-1 block w-full bg-[#1A2027] border border-gray-600 rounded-md shadow-sm
                         py-2 px-3 text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#8C9EFF]
                         focus:border-[#8C9EFF]'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='price' className='block text-sm font-medium text-[#E0E0E0]'>
                        Price
                    </label>
                    <input
                        type='number'
                        id='price'
                        name='price'
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        step='0.01'
                        className='mt-1 block w-full bg-[#1A2027] border border-gray-600 rounded-md shadow-sm
                        py-2 px-3 text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#8C9EFF]
                         focus:border-[#8C9EFF]'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='category' className='block text-sm font-medium text-[#E0E0E0]'>
                        Category
                    </label>
                    <select
                        id='category'
                        name='category'
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className='mt-1 block w-full bg-[#1A2027] border border-gray-600 rounded-md
                         shadow-sm py-2 px-3 text-[#E0E0E0] focus:outline-none
                         focus:ring-2 focus:ring-[#8C9EFF] focus:border-[#8C9EFF]'
                        required
                    >
                        <option value=''>Select a category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='mt-1 flex items-center'>
                    <input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
                    <label
                        htmlFor='image'
                        className='cursor-pointer bg-[#1A2027] py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-[#E0E0E0] hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8C9EFF]'
                    >
                        <Upload className='h-5 w-5 inline-block mr-2' />
                        Upload Image
                    </label>
                    {newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>}
                </div>

                <button
                    type='submit'
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                     shadow-sm text-sm font-medium text-white bg-[#8C9EFF] hover:bg-[#6C7EFF]
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8C9EFF] disabled:opacity-50'
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                            Loading...
                        </>
                    ) : (
                        <>
                            <PlusCircle className='mr-2 h-5 w-5' />
                            Create Product
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default CreateProductForm;
