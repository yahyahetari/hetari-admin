import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Products";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect()
    await isAdminRequest(req,res)

    if (method === 'GET') {
        if(req.query?.id){
            const product = await Product.findById(req.query.id)
            return res.json(product)
        }else{
            res.json(await Product.find())
        }
    }

    if (method === 'POST') {
        const { title, description, price, cost, images, category, properties } = req.body;
        const productDoc = await Product.create({
            title,
            description,
            price,
            cost, // تخزين التكلفة
            images,
            category: category || null,
            properties,
        })
        res.json(productDoc)
    }

    if(method === 'PUT'){
        const { title, description, price, cost, images, category, properties, _id } = req.body;
        await Product.updateOne({_id}, {
            title,
            description,
            price,
            cost, // تحديث التكلفة
            images,
            category: category || null, 
            properties,
        })
        res.json(true)
    }

    if (method === 'DELETE'){
        const { id } = req.query
        await Product.deleteOne({ _id:req.query?.id })
        res.json(true)
    }
}
