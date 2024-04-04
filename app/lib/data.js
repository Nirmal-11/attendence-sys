import User from "./models"
import connect from "./utils";

export const fetchUsers = async () => {

    try {
        await connect();
        const users = await User.find();
        return users;
    } catch (error) {
        console.log(error);
        throw new Error("Faild to fetch data!...")
    }
}