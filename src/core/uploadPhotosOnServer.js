import axios from 'axios';
import FormData from 'form-data';
import fs from "fs";

const uploadPhotosOnServer = async (vk, groupId, images) => {
	const uploadServerDatas = [];
	const arrayOfPhotos = [];

	const response = await vk.api.photos.getWallUploadServer({
		group_id: groupId
	})

	for (const i in images) {
		images[i] = {
			index: Number.parseInt(i, 10),
			url: images[i]
		}
	}

	for (const image of images) {
		arrayOfPhotos.push(new Promise(async resolve => {
			var bodyFormData = new FormData();
			bodyFormData.append('photo', fs.createReadStream(image.url));
			const res = await axios.post(response.upload_url, bodyFormData, { headers: {"Content-Type": "multipart/form-data" }});
			uploadServerDatas.push({index: image.index, data: res.data});
			resolve(true);
		}))
	}

	await Promise.all(arrayOfPhotos);

	images = uploadServerDatas.sort((a, b) => { 
		if (a.index > b.index) 
			return 1; 
		else if (a.index < b.index) 
			return -1 ;
		else return 0; 
	})

	for (const i in images) {
		images[i] = images[i].data;
	}

	return images;
}

export default uploadPhotosOnServer;