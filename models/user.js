import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, "The provided User already exists!"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        minLength: [6, "The choosen password has to be at least 6 characters long!"],
        select: false,
    },
    characters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserCharacter'
    }],
    role: {
        type: String,
        default: 'user',
        enum: {
            values: [
                'user',
                'admin'
            ],
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

// ENCRYPTION 
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}


export default mongoose.models.User || mongoose.model('User', userSchema)