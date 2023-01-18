import uploadPhotosOnServer from "./uploadPhotosOnServer.js"

const postPhotosToGroup = async (vk, groupId, images) => {
	const saveWallPhotoDatas = [];
	const photos = [];
	
	const uploadServerDatas = await uploadPhotosOnServer(vk, groupId, images);

	for await (const data of uploadServerDatas) {
		const res = await vk.api.photos.saveWallPhoto({
			group_id: groupId,
			server: data.server,
			hash: data.hash,
			photo: data.photo
		})

		saveWallPhotoDatas.push(res[0]);
	}

	for (const data of saveWallPhotoDatas) {
		photos.push(`photo${data.owner_id}_${data.id}`);
	}

	var date = new Date();
	var mins = Math.floor(Math.random() * 60);
	date = Math.floor(date.setMinutes(date.getMinutes() + mins)/1000);

	vk.api.wall.post({
		owner_id: -groupId,
		from_group: 1,
		publish_date: date,
		attachments: photos,
	});
}

export default postPhotosToGroup;