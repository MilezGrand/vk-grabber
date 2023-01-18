const getGroupPhotos = async (vk, groupId) => {
	const photos = []
	
	const res = await vk.api.wall.get({
		owner_id: -groupId,
		count: 3,
	})

	for await (const item of res.items) {

		if (item.is_pinned) {
			continue
		} 

		if (photos.length > 0) {
			break
		}

		if (!item.attachments) {
			continue
		}

		if (item.copyright) {
			continue
		}

		if (timeDifference(item.date) > 60) {
			continue
		}

		if (attachmentValidation(item)) {
			continue
		}

		for (const attachment of item.attachments) {
			let url = attachment.photo.sizes[attachment.photo.sizes.length - 1].url;
			photos.push(url);
		}
	}

	return photos
}

const attachmentValidation = (item) => {
    for (var i = 0; i < item.attachments.length; i++) {
        if (item.attachments[i].type == 'video' || item.attachments[i].type == 'link'|| item.attachments[i].type == 'doc') {
            return true;
        } else return false;
    } 
}

const timeDifference = (previous) => {
	var current = new Date();
	previous = new Date(previous * 1000)
    var msPerMinute = 60 * 1000;
    var elapsed = current - previous;

    return Math.round(elapsed/msPerMinute);   
}

export default getGroupPhotos;