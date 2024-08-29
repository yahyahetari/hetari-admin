import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";

export default function DeleteProductPage() {
  const router = useRouter();
  const [productInfo,setProductInfo] = useState();
  const {id} = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/products?id='+id).then(response => {
      setProductInfo(response.data);
    });
  }, [id]);
  function goBack() {
    router.push('/products');
  }
  async function deleteProduct() {
    await axios.delete('/api/products?id='+id);
    goBack();
  }
  return (
     <div class="flex items-center justify-center h-full">
    <div class="max-w-sm p-6  bg-opacity-30 backdrop-blur-md border bg-h-glass border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-red-900 dark:text-white">Delete Product</h5>
        <p class="mb-4 text-gray-900 font-semibold dark:text-gray-400">Are you sure you want to delete this <span className=" text-xl text-red-800 font-semibold" >{productInfo?.title} </span>? This action cannot be undone.</p>
        <div class="flex justify-between">
            <button type="button" onClick={deleteProduct} class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800">Delete</button>
            <button type="button" onClick={goBack} class="text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-500">Cancel</button>
        </div>
    </div>
</div> 
    
  );
}
