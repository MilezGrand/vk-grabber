import { VK } from "vk-io";
import * as dotenv from 'dotenv';
import getGroupPhotos from "./src/core/getGroupPhotos.js";
import postPhotosToGroup from "./src/core/postPhotosToGroup.js";
import cleanPostsDirectory from "./src/utils/cleanPostsDirectory.js";
import downloadAndSavePhotos from "./src/core/downloadAndSavePhotos.js";

dotenv.config()

const vk = new VK({
	token: process.env.TOKEN,
})

const main = async () => {
	try {
		let myGroup = process.env.MY_GROUP;

		let targetGroup = process.env.TARGET_GROUPS.split(' ');
	
		for (let i = 0; i < targetGroup.length; i++) {
			let links = await getGroupPhotos(vk, targetGroup[i]);
	
			!links.length ? console.log(`В ${targetGroup[i]} нет подходящий постов`) : console.log(`В ${targetGroup[i]} найден пост`);
			
			if (links.length) {
				let pathes = await downloadAndSavePhotos(links);
				await postPhotosToGroup(vk, myGroup, pathes);
			} 
		}
		
		cleanPostsDirectory();
	} catch (err) {
		console.log(err);
	}
}

main();
setInterval(main, 3600000);