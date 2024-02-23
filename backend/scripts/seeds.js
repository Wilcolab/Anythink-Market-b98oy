//TODO: seeds script should come here, so we'll be able to put some data in our local env
let mongoose = require('mongoose')
let User = require('../models/User')
let Item = require('../models/Item')
let Comment = require('../models/Comment')

// let User = mongoose.model("User", UserSchema);
// let Item = mongoose.model("Item", ItemSchema);
// let Comment = mongoose.model("Comment", CommentSchema)

const numberToSeed = 100;
const maxRetries = 5;

main().catch(err => console.error(err)).then(() => mongoose.disconnect());

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    for (let i = 0; i < maxRetries; i++){
        try{
            await generateUsers().catch();
            break;
        } catch (error) {
            console.error(`Attempt ${i + 1}...`)
        }
    }
    for (let i = 0; i < maxRetries; i++){
        try{
            await generateItems();
        } catch (error) {
            console.error(error)
        }
    }
}

function generateRandomName() {
    const firstNames = ['John', 'Jane', 'Sam', 'Sally', 'James', 'Emily', 'Kyle', 'Jenny', 'Timothy', 'Jake', 'Greg', 'Dan', 'Cindy', 'Aaron', 'Adam'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Liang', 'Ermey', 'Wang'];
  
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${randomFirstName}${randomLastName}${Math.floor(Math.random() * 1000)}`;
    return name;
}

function generateRandomTitle(){
    const adjectives = ['Amazing', 'Incredible', 'Fantastic', 'Magical', 'Colorful', 'Awesome', 'Brilliant', 'Giant', 'Strong', 'Delicious'];
    const nouns = ['Phone', 'Laptop', 'Headphones', 'Chair', 'Table', 'Shoes', 'Watch', 'Yogurt', 'Charger', 'Dog', 'Bench', 'Beanbag'];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective} ${randomNoun}`;
}

async function generateUsers(){
    for (let i = 0; i < numberToSeed; i++){
        let username = generateRandomName();
        let email = `${username}@emailaddress.com`;
        let user = new User({username, email})
        await user.save()
    }
}

async function generateItems(){
    try {
        let description = "The best a person can get, guaranteed!"
        let image = "./frontend/public/sunray.jpeg"
        let body = "This is a fantastic product"
        let seller = await User.findOne();
        for (let i = 0; i < numberToSeed; i++){
            let title = generateRandomTitle();
            let item = new Item({
                title, 
                description, 
                image, 
                favoritesCount: (Math.floor(Math.random() * 100))
            });
            let comment = new Comment({ body, item, seller});
            await item.save();
            await comment.save();
        }
    } catch (error) {
        console.error(error);
    }
}

