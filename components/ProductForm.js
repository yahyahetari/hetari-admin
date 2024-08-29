import axios from "axios";
import { Trash2, Upload } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    cost: existingCost, // إضافة التكلفة هنا
    images: existingImages,
    category: existingCategory,
    properties: existingProperties,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(existingCategory || '');
    const [productProperties, setProductProperties] = useState(existingProperties || {});
    const [price, setPrice] = useState(existingPrice || '');
    const [cost, setCost] = useState(existingCost || ''); // إضافة حالة التكلفة
    const [images, setImages] = useState(existingImages || []);
    const [categories, setCategories] = useState([]);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }, []);

    async function saveProducts(ev) {
        ev.preventDefault();
        const data = {
            title,
            description,
            price,
            cost, // إضافة التكلفة إلى البيانات
            images,
            category,
            properties: productProperties
        };
        if (_id) {
            // Update
            await axios.put('/api/products', { ...data, _id });
        } else {
            // Create
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push('/products');
    }

    async function uploadImages(ev) {
        const files = ev.target?.files;

        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.Links];
            });
            setIsUploading(false);
        }
    }

    function imagesOrdering(images) {
        setImages(images);
    }

    async function removeImage(imageLink) {
        setImages(images.filter(img => img !== imageLink));
    }

    const propertiesToFill = new Set();
    const visitedCategories = new Set();

    if (Array.isArray(categories) && categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category);
        while (catInfo && !visitedCategories.has(catInfo._id)) {
            visitedCategories.add(catInfo._id);

            if (Array.isArray(catInfo.properties)) {
                catInfo.properties.forEach(prop => propertiesToFill.add(prop));
            }
            catInfo = categories.find(({ _id }) => _id === catInfo?.parent?._id);
        }
    }
    const propertiesArray = Array.from(propertiesToFill);

    function toggleProperty(propName, value) {
        setProductProperties(prev => {
            const currentValues = Array.isArray(prev[propName]) ? prev[propName] : [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(val => val !== value)
                : [...currentValues, value];
            return {
                ...prev,
                [propName]: newValues
            };
        });
    }

    return (
        <form onSubmit={saveProducts}>
            <div className="flex flex-col justify-start items-start h-full p-4">
                <label>Product Name</label>
                <input
                    type="text"
                    placeholder="product name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} />
                <label>Product Description</label>
                <textarea
                    placeholder="product description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} />
                <label>Product Category</label>
                <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
                    <option value="" className="bg-black cap">With Out Category</option>
                    {categories.length > 0 && categories.map(category => (
                        <option key={category._id} value={category._id} className="bg-black">{category.name}</option>
                    ))}
                </select>
                <div className="">
                    {propertiesArray.length > 0 && propertiesArray.map(property => {
                        const { name, values } = property; // Destructure the property object
                        return (
                            <div className=" gap-1 items-center mb-2" key={name}>
                                <label className="mb-1 cap">{name}</label>
                                <div className="flex gap-2">
                                    {values.map(value => (
                                        <button
                                            type="button"
                                            key={value}
                                            className={`py-1 px-2 rounded-lg text-gray-100 ${productProperties[name]?.includes(value) ? 'bg-h-glass' : 'bg-glass'}`}
                                            onClick={() => toggleProperty(name, value)}
                                        >
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <label>Product Images</label>
                <div className="mt-2 flex flex-wrap gap-2">
                    <ReactSortable list={images} className="flex flex-wrap" setList={imagesOrdering}>
                        {!!images?.length && images.map(Link => (
                            <div key={Link} className="relative w-40 h-40 p-2 rounded-md">
                                <img src={Link} alt="product image" className="w-full h-full object-cover border rounded-lg cursor-move" />
                                <button
                                    onClick={() => removeImage(Link)}
                                    className="absolute top-2 right-2 bg-red-700 text-white p-0.5 rounded-lg m-1">
                                    <Trash2 className="w-5" />
                                </button>
                            </div>
                        ))}
                    </ReactSortable>
                    {isUploading && (
                        <div className="flex items-center justify-between p-2 rounded-md">
                            <Loader />
                        </div>
                    )}
                    <label className="w-32 mt-9 h-24 cursor-pointer bg-gray-400 text-gray-800 rounded-lg text-center flex flex-col items-center justify-center text-2xl">
                        <Upload className="w-32 h-12 text-gray-800" />
                        <div>Upload</div>
                        <input
                            type="file"
                            className="hidden"
                            onChange={uploadImages}
                            multiple={true}
                        />
                    </label>
                </div>
                <label>Product Cost $</label> {/* إضافة حقل التكلفة */}
                <input
                    type="number"
                    placeholder="product cost"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)} />
                <label>Product Price $</label>
                <input
                    type="number"
                    placeholder="product price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)} />
                <button type="submit" className="bg-h-glass hover:bg-glass mt-6 text-white py-2 px-4 rounded-full">
                    Save Product
                </button>
            </div>
        </form>
    );
}
