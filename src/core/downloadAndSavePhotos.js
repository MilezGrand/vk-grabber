import request from "request";
import fs from "fs";
import Jimp from 'jimp';

const downloadAndSavePhotos = async (links) => {
	const pathes = []

	for await (const imageLink of links) {
		var imageName = Date.now().toString();
		var imagePath = `./posts/${imageName}.jpg`;
		await downloadFile(imageLink, imagePath);
		await editImage(imagePath);
		pathes.push(imagePath);
	}

	return pathes;
}

const editImage = async (path) => {
	Jimp.read(path, (err,img) => {
		if (err) throw err;
		img.contrast(0.03).write(path); 
	})
}

const downloadFile = async (url, filename) => {
	return new Promise(resolve => {
		request.head(url, () => {
			request(url).pipe(fs.createWriteStream(filename)).on("close", () => resolve(true));
		});
	});
};

export default downloadAndSavePhotos;