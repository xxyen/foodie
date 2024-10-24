import { MongoClient, Db, Collection, InsertOneResult, UpdateResult, DeleteResult } from 'mongodb';

// Replace the uri string with your connection string.
const uri = "mongodb+srv://new-user:5lCV5NvTTPCaIFNT@echos.eojk4.mongodb.net/?retryWrites=true&w=majority&appName=Echos";

const dbName = 'User';  // Replace with your actual database name
const collectionName = 'crendentials';  // The collection name you mentioned

// Create a new MongoClient
const client: MongoClient = new MongoClient(uri);

export const create = async (username : string, email: string, password: string) => {
    try{
        await client.connect();
        const newUser = {
            username: username,
            email : email,
            password : password
        };
        const database: Db = client.db(dbName);
        const collection: Collection = database.collection(collectionName);
        const findResultName = await collection.findOne({username: username});
        if(findResultName){
            await client.close();
            return -2;
        }
        const findResultEmail = await collection.findOne({email: email});
        if(findResultEmail){
            await client.close();
            return -2;
        }
        const insertResult: InsertOneResult = await collection.insertOne(newUser);
        console.log("You have successfully registered, ", username);
        await client.close();
        return insertResult.insertedId;
    } catch (err) {
        console.error('Error occurred:', err);
        return -1;
    }
    
};

export const login = async (username : string, password: string) => {
    let res = -1;
    try{
        await client.connect();
        const user1 = {username: username,password : password};
        const user2 = {email: username, password : password}
        const database: Db = client.db(dbName);
        const collection: Collection = database.collection(collectionName);
        const findResult1 = await collection.findOne(user1);
        const findResult2 = await collection.findOne(user2);
        if(findResult1 || findResult2){
            console.log("You have successfully logged in, ", username);
            res = 1;
        }
        else{
            res = -1;
        }
        
    } catch (err) {
        console.error('Error occurred:', err);
        res = -2;
    } finally {
        await client.close();
        return res;
    }
    
    
};

// async function run(): Promise<void> {
//     try {
//         // Connect the client to the server
//         await client.connect();
//         console.log('Connected successfully to MongoDB Atlas');

//         // Select the database and collection
//         const database: Db = client.db(dbName);
//         const collection: Collection = database.collection(collectionName);

//         // 1. Insert a test document
//         const insertResult: InsertOneResult = await collection.insertOne({
//             username: 'test_user',
//             password: 'password123',
//         });
//         console.log('Inserted document:', insertResult.insertedId);

//         // 2. Query the inserted document
//         const findResult = await collection.findOne({ username: 'test_user' });
//         console.log('Found document:', findResult);

//         // 3. Update the test document
//         const updateResult: UpdateResult = await collection.updateOne(
//             { username: 'test_user' },
//             { $set: { password: 'newpassword456' } }
//         );
//         console.log('Updated document count:', updateResult.modifiedCount);

//         // 4. Delete the test document
//         const deleteResult: DeleteResult = await collection.deleteOne({ username: 'test_user' });
//         console.log('Deleted document count:', deleteResult.deletedCount);
        
//     } catch (err) {
//         console.error('Error occurred:', err);
//     } finally {
//         // Close the connection
//         await client.close();
//     }
// }

