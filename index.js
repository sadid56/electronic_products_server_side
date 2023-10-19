const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

//! middleware
app.use(cors())
app.use(express.json())


//! CRUD operation
//WcptlQVUQMp1fxKA
//assignment-10


const uri = "mongodb+srv://assignment-10:WcptlQVUQMp1fxKA@cluster0.dzbhwpo.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
    const productCollection = client.db('assignment-10').collection('products');
    const AddCartCollection = client.db('assignment-10').collection('myCart')

    //! POST
    app.post('/products', async(req, res)=>{
        const product = req.body;
        const result = await productCollection.insertOne(product)
        res.send(result)
    })

    //! GET    
    app.get('/products', async(req, res)=>{
        const result = await productCollection.find().toArray()
        res.send(result)
    })

    //! get signle data
    app.get('/products/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)

    })


    //! update
    app.put('/products/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true}
      const updateProducts = req.body;
      const Products = {
        $set: {
          image:updateProducts.image,
          name:updateProducts.name,
          brandName:updateProducts.brandName,
          categorieName:updateProducts.categorieName,
          price:updateProducts.price,
          rating:updateProducts.rating
        }
      }
      const result = await productCollection.updateOne(filter, Products, options)
      res.send(result)

    })


      //! my cart related collection 
      app.get('/myCart', async(req, res)=>{
        const result = await AddCartCollection.find().toArray()
        res.send(result)
      });
      
      app.post('/myCart', async(req, res)=>{
        const myCart = req.body;
        const result = await AddCartCollection.insertOne(myCart)
        res.send(result)
      })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('Assignment 10 server is running')
})

app.listen(port, ()=>{
    console.log(`server ${port}`);
})