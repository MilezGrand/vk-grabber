import fs from "fs"

const cleanPostsDirectory = () => {
	const Directory = "./posts"
	fs.readdirSync(Directory).forEach(file => fs.rmSync(`${Directory}/${file}`));
}

export default cleanPostsDirectory;