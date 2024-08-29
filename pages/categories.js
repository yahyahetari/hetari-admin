import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PenBox, Trash2 } from "lucide-react";

export default function Categories() {
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties ,setProperties] = useState([])
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        axios.get('https://hetari.vercel.app/api/categories')
            .then(result => {
                setCategories(result.data);
            });
    }

    async function saveCategory(ev) {
        ev.preventDefault();
        const data = { 
            name, 
            parentCategory, 
            properties:properties.map(property => ({
                name: property.name,
                values: property.values.split(','), 
            })) };
        if (editingCategory) {
            data._id = editingCategory._id;
            await axios.put('/api/categories/', data);
            setEditingCategory(null);
        } else {
            await axios.post('/api/categories', data);
        }
        setName('');
        setParentCategory('');
        setProperties([])
        fetchCategories();
    }

    function editCategory(Category) {
        setEditingCategory(Category);
        setName(Category.name);
        setParentCategory(Category.parent?._id);
        setProperties(Category.properties.map(({name,values}) =>{
            return {name,values:values.join(',')};
            }))
    }

    function confirmDeleteCategory(category) {
        setCategoryToDelete(category);
    }

    async function deleteCategory() {
        await axios.delete('/api/categories?id=' + categoryToDelete._id);
        setCategoryToDelete(null);
        fetchCategories();
    }

    function cancelDelete() {
        setCategoryToDelete(null);
    }
    
    function addProperty() {
        setProperties(prev => {
          return [...prev, {name:'',values:''}];
        });
      }

    function PropertyNameChange (index,property,newName) {
        setProperties(perv => {
            const properties = [...perv];
            properties[index].name = newName;
            return properties;
            });
    }  

    function PropertyValueChange (index,property,newValues) {
        setProperties(perv => {
            const properties = [...perv];
            properties[index].values = newValues;
            return properties;
            });
    } 

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return prev.filter((_, pIndex) => pIndex !== indexToRemove);
        });
    }
    
            

    return (
        <div>
            <h1>Categories page</h1>
            <label className="mt-4 ml-3">{editingCategory ? `Edit Category ${editingCategory.name}` : 'Create New Categories'}</label>
            <form onSubmit={saveCategory} className="mb-2">
                <div className="flex gap-1 -mb-3 " >
                <input 
                    type="text"
                    className=""
                    placeholder="Categories Name"
                    onChange={ev => setName(ev.target.value)}
                    value={name}
                />
                <select
                    className="ml-2 text-white bg-glass"
                    onChange={ev => setParentCategory(ev.target.value)}
                    value={parentCategory}
                >
                    <option className="bg-black hover:bg-cyan-950" value="">no parameters here</option>
                    {categories.length > 0 && categories
                        .filter(category => !editingCategory || category._id !== editingCategory._id)
                        .map(category => (
                            <option className="bg-black hover:bg-cyan-950" key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                </select>
                </div>
                <div>
                    <label className="ml-4 mt-2">properties</label>
                    <button type="button" onClick={addProperty} className="btn-default m-1">Add New Property </button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className="flex gap-1" key={index}>
                            <input
                                type="text"
                                className=""
                                placeholder="Property Name"
                                value={property.name}
                                onChange={ev => PropertyNameChange (index,property,ev.target.value) }
                            />
                            <input
                                type="text"
                                className=""
                                placeholder="Property Values"
                                value={property.values}
                                onChange={ev => PropertyValueChange (index,property,ev.target.value) }
                            />
                             <button type="button" onClick={ () => removeProperty  (index)} className="inline-flex  text-white px-2 pb-7 pt-3 h-12 mt-0.5 rounded-lg py-4 bg-red-900 hover:bg-h-glass hover:font-bold hover:text-red-900">
                                    <Trash2 className="w-5 h-7 mr-1 pb-1 " />
                                    Remove</button>
                        </div>
                    ))}
                </div>
                {editingCategory && (
                    <button
                    type="button"
                    onClick={() => {
                        setEditingCategory(null)
                        setName('')
                        setParentCategory('')
                        setProperties([])
                    }} 
                    className="btn-default m-1">
                    Cancel
                    </button>
                )}
                <button className="bg-cyan-800 p-2 h-10 m-1 rounded-lg py-2">Save</button>
            </form>
            {!editingCategory && (

            <table className="basic">
                <thead>
                    <tr>
                        <td>Categories Name</td>
                        <td>Parent Category</td>
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td className="text-center">
                                <button onClick={() => editCategory(category)} className="inline-flex  text-white px-2  rounded-lg py-2 bg-h-glass hover:bg-glass">
                                <PenBox className="w-5 h-7 mr-1 pb-1" />
                                    Edit</button>
                            </td>
                            <td className="text-center">
                                <button onClick={() => confirmDeleteCategory(category)} className="inline-flex  text-white px-2  rounded-lg py-2 bg-red-900 hover:bg-h-glass hover:font-bold hover:text-red-900">
                                    <Trash2 className="w-5 h-7 mr-1 pb-1" />
                                    Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}

            {categoryToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                    <div className="max-w-sm p-6 bg-white bg-opacity-30 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-950 dark:text-white">Delete Category</h5>
                        <p className="mb-4 text-gray-200">Are you sure you want to delete <span className="text-gray-950 font-semibold text-2xl">({categoryToDelete.name})</span>? This action cannot be undone.</p>
                        <div className="flex justify-between">
                            <button className="btn-red" onClick={deleteCategory}>Delete</button>
                            <button className="btn-default" onClick={cancelDelete}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
